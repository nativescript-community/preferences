Object.defineProperty(exports, "__esModule", { value: true });
exports.Preferences = void 0;
const preferences_common_1 = require("./preferences.common");
const app = require("@nativescript/core/application");
class ObserverClass extends NSObject {
    observeValueForKeyPathOfObjectChangeContext(path) {
        const owner = this.owner;
        if (owner) {
            owner.notify({
                eventName: 'key:' + path,
                object: owner
            });
        }
    }
}
class Preferences extends preferences_common_1.Common {
    constructor() {
        super();
        this.userDefaults = NSUserDefaults.standardUserDefaults;
        this.registered = false;
        app.ios.addNotificationObserver(NSUserDefaultsDidChangeNotification, () => {
            this.notify({
                eventName: 'change',
                object: this
            });
        });
    }
    setValue(key, value) {
        this.userDefaults.setValueForKey(value, key);
    }
    getValue(key) {
        var standardUserDefaults = NSUserDefaults.standardUserDefaults;
        var us = standardUserDefaults.objectForKey(key);
        if (us == null) {
            this.registerDefaultsFromSettingsBundle();
        }
        return this.userDefaults.objectForKey(key);
    }
    onListenerAdded(eventName, count) {
        if (eventName.startsWith('key:')) {
            const key = eventName.replace('key:', '');
            if (!this._observer) {
                this._observer = ObserverClass.alloc();
                this._observer["owner"] = this;
            }
            this.userDefaults.addObserverForKeyPathOptionsContext(this._observer, key, 1, null);
        }
    }
    onListenerRemoved(eventName, count) {
    }
    openSettings() {
        UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));
    }
    clear() { }
    registerDefaultsFromSettingsBundle() {
        if (this.registered) {
            return;
        }
        this.registered = true;
        var settingsPath = NSBundle.mainBundle.pathForResourceOfType('Settings', 'bundle');
        let settingsBundle = NSString.stringWithString(settingsPath);
        let rootPath = settingsBundle.stringByAppendingPathComponent('Root.plist');
        var settings = NSDictionary.dictionaryWithContentsOfFile(rootPath);
        let preferences = settings.objectForKey('PreferenceSpecifiers');
        let prefs = preferences.count;
        var defaultsToRegister = NSMutableDictionary.alloc().initWithCapacity(prefs);
        for (var i = 0; i < prefs; i++) {
            var prefSpecification = preferences.objectAtIndex(i);
            var key = prefSpecification.objectForKey('Key');
            if (key) {
                defaultsToRegister.setObjectForKey('', key);
            }
        }
        this.userDefaults.registerDefaults(defaultsToRegister);
        this.userDefaults.synchronize();
    }
}
exports.Preferences = Preferences;
//# sourceMappingURL=preferences.ios.mjs.map