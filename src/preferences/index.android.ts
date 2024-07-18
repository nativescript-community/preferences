import { AndroidActivityResultEventData, Application, Utils } from '@nativescript/core';
import { Common } from './index.common';

export class Preferences extends Common {
    sharedPreferences: android.content.SharedPreferences;
    listener: android.content.SharedPreferences.OnSharedPreferenceChangeListener;

    destroy() {
        if (this.sharedPreferences) {
            if (this.listener) {
                this.sharedPreferences.unregisterOnSharedPreferenceChangeListener(this.listener);
                this.listener = null;
            }
            this.sharedPreferences = null;
        }
    }
    public setValue(key: string, value: any) {
        const allPrefs = this.getPreferences().getAll();
        const pref = allPrefs.get(key);

        if (typeof pref === 'string') {
            this.getPreferences().edit().putString(key, value).apply();
        } else if (pref instanceof java.lang.Boolean) {
            this.getPreferences().edit().putBoolean(key, value).apply();
        } else if (typeof pref === 'number') {
            this.getPreferences().edit().putInt(key, value).apply();
        }
    }

    public getValue(key: string, defaultValue?: any): any {
        const allPrefs = this.getPreferences().getAll();
        const pref = allPrefs.get(key);

        if (typeof pref === 'string') {
            if (!defaultValue) defaultValue = '';

            return this.getPreferences().getString(key, defaultValue);
        } else if (pref instanceof java.lang.Boolean) {
            if (!defaultValue) defaultValue = false;

            return this.getPreferences().getBoolean(key, defaultValue);
        } else if (typeof pref === 'number') {
            if (!defaultValue) defaultValue = 0;

            return this.getPreferences().getInt(key, defaultValue);
        }

        return null;
    }

    public clear() {
        this.getPreferences().edit().clear().apply();
    }

    onListenerAdded(eventName: string, count: number): void {
        // ensure observers are set
        this.getPreferences();
    }

    public openSettings() {
        const ID = 5836;
        // var activity = frameModule.topmost().android.activity;
        const activity = Application.android.foregroundActivity || Application.android.startActivity;
        return new Promise<void>((resolve, reject) => {
            const onActivityResultHandler = (data: AndroidActivityResultEventData) => {
                if (data.requestCode === ID) {
                    Application.android.off(Application.android.activityResultEvent, onActivityResultHandler);
                    resolve();
                }
            };
            Application.android.on(Application.android.activityResultEvent, onActivityResultHandler);
            try {
                activity.startActivityForResult(new android.content.Intent(activity, com.nativescript.preferences.NativescriptSettingsActivity.class), ID);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });

        // var intent = new android.content.Intent(androidApp.foregroundActivity, com.nativescript.preferences.NativescriptSettingsActivity.class);
        // activity.startActivity(intent);
    }
    private getPreferences() {
        if (!this.sharedPreferences) {
            this.sharedPreferences = Utils.android.getApplicationContext().getSharedPreferences('prefs.db', 0);
            this.listener = new android.content.SharedPreferences.OnSharedPreferenceChangeListener({
                onSharedPreferenceChanged: (pref, key) => {
                    this.notify({
                        eventName: 'change',
                        key
                    });
                    this.notify({
                        eventName: 'key:' + key
                    });
                }
            });
            this.sharedPreferences.registerOnSharedPreferenceChangeListener(this.listener);
        }
        return this.sharedPreferences;
    }

    /**
     * method used to clear what's needed in cases like terminating in a worker
     *
     * @memberof Preferences
     */
    public close() {
        if (this.listener && this.sharedPreferences) {
            this.sharedPreferences.unregisterOnSharedPreferenceChangeListener(this.listener);
            this.sharedPreferences = null;
            this.listener = null;
        }
    }
}
