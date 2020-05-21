Object.defineProperty(exports, "__esModule", { value: true });
exports.Preferences = void 0;
const app = require("@nativescript/core/application");
const preferences_common_1 = require("./preferences.common");
class Preferences extends preferences_common_1.Common {
    setValue(key, value) {
        var allPrefs = this.getPreferences().getAll();
        var pref = allPrefs.get(key);
        if (typeof pref === 'string') {
            this.getPreferences()
                .edit()
                .putString(key, value)
                .apply();
        }
        else if (pref instanceof java.lang.Boolean) {
            this.getPreferences()
                .edit()
                .putBoolean(key, value)
                .apply();
        }
        else if (typeof pref === 'number') {
            this.getPreferences()
                .edit()
                .putInt(key, value)
                .apply();
        }
    }
    getValue(key, defaultValue) {
        var allPrefs = this.getPreferences().getAll();
        var pref = allPrefs.get(key);
        if (typeof pref === 'string') {
            if (!defaultValue)
                defaultValue = '';
            return this.getPreferences().getString(key, defaultValue);
        }
        else if (pref instanceof java.lang.Boolean) {
            if (!defaultValue)
                defaultValue = false;
            return this.getPreferences().getBoolean(key, defaultValue);
        }
        else if (typeof pref === 'number') {
            if (!defaultValue)
                defaultValue = 0;
            return this.getPreferences().getInt(key, defaultValue);
        }
        return null;
    }
    clear() {
        this.getPreferences()
            .edit()
            .clear()
            .apply();
    }
    onListenerAdded(eventName, count) {
        this.getPreferences();
    }
    openSettings() {
        const ID = 5836;
        const activity = app.android.foregroundActivity || app.android.startActivity;
        return new Promise((resolve, reject) => {
            const onActivityResultHandler = (data) => {
                if (data.requestCode === ID) {
                    app.android.off(app.AndroidApplication.activityResultEvent, onActivityResultHandler);
                    resolve();
                }
            };
            app.android.on(app.AndroidApplication.activityResultEvent, onActivityResultHandler);
            try {
                activity.startActivityForResult(new android.content.Intent(activity, com.nativescript.preferences.NativescriptSettingsActivity.class), ID);
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    getPreferences() {
        if (!this.sharedPreferences) {
            this.sharedPreferences = app.getNativeApplication().getApplicationContext().getSharedPreferences('prefs.db', 0);
            this.listener = new android.content.SharedPreferences.OnSharedPreferenceChangeListener({
                onSharedPreferenceChanged: (pref, key) => {
                    this.notify({
                        eventName: 'change',
                        object: this,
                        key
                    });
                    this.notify({
                        eventName: 'key:' + key,
                        object: this
                    });
                }
            });
            this.sharedPreferences.registerOnSharedPreferenceChangeListener(this.listener);
        }
        return this.sharedPreferences;
    }
}
exports.Preferences = Preferences;
//# sourceMappingURL=preferences.android.mjs.map