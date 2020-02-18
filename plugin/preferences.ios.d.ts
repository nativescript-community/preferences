import { Common } from './preferences.common';
export declare class Preferences extends Common {
    userDefaults: NSUserDefaults;
    private _observer;
    constructor();
    setValue(key: string, value: any): void;
    getValue(key: string): any;
    onListenerAdded(eventName: string, count: number): void;
    onListenerRemoved(eventName: string, count: number): void;
    openSettings(): void;
    clear(): void;
    private registerDefaultsFromSettingsBundle;
}
