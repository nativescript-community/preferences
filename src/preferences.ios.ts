import { Common } from './preferences.common';
import { Application } from '@nativescript/core';

declare let UIApplicationOpenSettingsURLString: any;

@NativeClass
class ObserverClass extends NSObject {
    owner: Preferences;
    // NOTE: Refactor this - use Typescript property instead of strings....
    observeValueForKeyPathOfObjectChangeContext(path: string) {
        const owner = this.owner;
        if (owner) {
            owner.notify({
                eventName: 'key:' + path,
                object: owner,
            });
        }
    }
}

export class Preferences extends Common {
    userDefaults = NSUserDefaults.standardUserDefaults;
    private _observers: { [k: string]: NSObject } = {};
    constructor() {
        super();
        this.registerDefaultsFromSettingsBundle();
        Application.ios.addNotificationObserver(NSUserDefaultsDidChangeNotification, () => {
            this.notify({
                eventName: 'change',
                object: this,
            });
        });
    }
    public setValue(key: string, value: any) {
        this.userDefaults.setValueForKey(value, key);
    }

    public getValue(key: string): any {
        const standardUserDefaults = NSUserDefaults.standardUserDefaults;
        const us = standardUserDefaults.objectForKey(key);
        if (us == null) {
            this.registerDefaultsFromSettingsBundle();
        }

        return this.userDefaults.objectForKey(key);
    }

    onListenerAdded(eventName: string, count: number): void {
        if (eventName.startsWith('key:') && count === 1) {
            const key = eventName.replace('key:', '');
            if (!this._observers[key]) {
                this._observers[key] = ObserverClass.alloc().init();
                this._observers[key]['owner'] = this;
            }
            this.userDefaults.addObserverForKeyPathOptionsContext(this._observers[key], key, NSKeyValueObservingOptions.New, null);
        }
    }
    onListenerRemoved(eventName: string, count: number): void {
        if (eventName.startsWith('key:') && count === 0) {
            const key = eventName.replace('key:', '');
            if (this._observers[key]) {
            this.userDefaults.removeObserverForKeyPath(this._observers[key], key);
            this._observers[key] = null;
            delete this._observers[key];
            }
        }
    }

    public openSettings() {
        UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));
    }

    public clear() {}

    registered = false;
    //https://stackoverflow.com/questions/6291477/how-to-retrieve-values-from-settings-bundle-in-objective-c
    private registerDefaultsFromSettingsBundle() {
        if (this.registered) {
            return;
        }
        this.registered = true;
        const settingsPath = NSBundle.mainBundle.pathForResourceOfType('Settings', 'bundle');
        if (!settingsPath) {
            return;
        }
        const settingsBundle: NSString = NSString.stringWithString(settingsPath);
        const rootPath = settingsBundle.stringByAppendingPathComponent('Root.plist');

        const settings = NSDictionary.dictionaryWithContentsOfFile(rootPath);
        const preferences = settings.objectForKey('PreferenceSpecifiers');
        const prefs: number = (preferences as any).count;
        const defaultsToRegister = NSMutableDictionary.alloc().initWithCapacity(prefs);

        for (let i = 0; i < prefs; i++) {
            const prefSpecification = (preferences as any).objectAtIndex(i);
            const key = prefSpecification.objectForKey('Key');
            if (key) {
                defaultsToRegister.setObjectForKey('', key);
            }
        }

        this.userDefaults.registerDefaults(defaultsToRegister as any);
        this.userDefaults.synchronize();
    }
}
