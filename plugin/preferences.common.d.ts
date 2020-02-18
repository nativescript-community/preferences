import Observable from 'nativescript-observable';
export declare abstract class Common extends Observable {
    abstract setValue(key: string, value: any): any;
    abstract getValue(key: string, defaultValue?: any): any;
    abstract openSettings(): any;
    abstract clear(): any;
}
