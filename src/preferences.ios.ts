import { Common } from './preferences.common';
import * as app from '@nativescript/core/application';

declare var UIApplicationOpenSettingsURLString: any;

class ObserverClass extends NSObject {
    owner:Preferences
    // NOTE: Refactor this - use Typescript property instead of strings....
    observeValueForKeyPathOfObjectChangeContext(path: string) {
        const owner = this.owner;
        if (owner) {
            owner.notify({
                eventName: 'key:'+path,
                object: owner
            });
        }
    }
}


export class Preferences extends Common {
    userDefaults = NSUserDefaults.standardUserDefaults;
    private _observer: NSObject;
    constructor() {
        super();
        app.ios.addNotificationObserver(NSUserDefaultsDidChangeNotification, () => {
            this.notify({
                eventName: 'change',
                object: this
            });
        });
    }
    public setValue(key: string, value: any) {
        this.userDefaults.setValueForKey(value, key);
    }

    public getValue(key: string): any {
        var standardUserDefaults = NSUserDefaults.standardUserDefaults;
        var us = standardUserDefaults.objectForKey(key);
        if (us == null) {
            this.registerDefaultsFromSettingsBundle();
        }

        return this.userDefaults.objectForKey(key);
    }

    onListenerAdded(eventName: string, count: number): void {
        if(eventName.startsWith('key:')) {
            const key = eventName.replace('key:', '');
            if (!this._observer) {
                this._observer = ObserverClass.alloc();
                this._observer["owner"] = this;
            }
            this.userDefaults.addObserverForKeyPathOptionsContext(this._observer, key, NSKeyValueObservingOptions.New, null);
        }

    }
    onListenerRemoved(eventName: string, count: number): void{

    }

    public openSettings() {
        UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));
    }

    public clear() {}

    registered = false
    //https://stackoverflow.com/questions/6291477/how-to-retrieve-values-from-settings-bundle-in-objective-c
    private registerDefaultsFromSettingsBundle() {
        if (this.registered) {
            return;
        }
        this.registered = true;
        var settingsPath = NSBundle.mainBundle.pathForResourceOfType('Settings', 'bundle');
        let settingsBundle: NSString = NSString.stringWithString(settingsPath);
        let rootPath = settingsBundle.stringByAppendingPathComponent('Root.plist');

        var settings = NSDictionary.dictionaryWithContentsOfFile(rootPath);
        let preferences = settings.objectForKey('PreferenceSpecifiers');
        let prefs: number = (<any>preferences).count;
        var defaultsToRegister = NSMutableDictionary.alloc().initWithCapacity(prefs);

        for (var i = 0; i < prefs; i++) {
            var prefSpecification = (<any>preferences).objectAtIndex(i);
            var key = prefSpecification.objectForKey('Key');
            if (key) {
                defaultsToRegister.setObjectForKey('', key);
            }
        }

        this.userDefaults.registerDefaults(defaultsToRegister as any);
        this.userDefaults.synchronize();
    }
}
