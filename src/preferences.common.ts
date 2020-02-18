import Observable from 'nativescript-observable';

export abstract class Common extends Observable {

    public abstract setValue(key: string, value: any);

    public abstract getValue(key: string, defaultValue?: any): any;

    public abstract openSettings();

    public abstract clear();
}
