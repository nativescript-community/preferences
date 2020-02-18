import { Common } from './preferences.common';
export declare class Preferences extends Common {
    setValue(key: string, value: any): void;
    getValue(key: string, defaultValue?: any): any;
    clear(): void;
    onListenerAdded(eventName: string, count: number): void;
    openSettings(): Promise<unknown>;
    sharedPreferences: android.content.SharedPreferences;
    listener: android.content.SharedPreferences.OnSharedPreferenceChangeListener;
    private getPreferences;
}
