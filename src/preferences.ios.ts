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
    private _observer: NSObject;
    constructor() {
        super();
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
        if (eventName.startsWith('key:')) {
            const key = eventName.replace('key:', '');
            if (!this._observer) {
                this._observer = ObserverClass.alloc().init();
                this._observer['owner'] = this;
            }
            this.userDefaults.addObserverForKeyPathOptionsContext(this._observer, key, NSKeyValueObservingOptions.New, null);
        }
    }
    onListenerRemoved(eventName: string, count: number): void {}

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
