<template>
    <Page>
        <ActionBar title="Preferences Demo" />
        <StackLayout>
            <Button class="btn btn-primary" text="Open Settings" @tap="onOpeniOSSettings" />
            <StackLayout class="hr-light"></StackLayout>
            <GridLayout class="p-20" rows="auto, auto">
                <StackLayout row="0" orientation="horizontal">
                    <Label text="Name: " textWrap="true" />
                    <Label :text="name_preference == '' ? 'Not set' : name_preference" textWrap="true" />
                </StackLayout>
                <StackLayout row="1" orientation="horizontal">
                    <Label text="Enabled: " textWrap="true" />
                    <Label :text="enabled_preference" textWrap="true" />
                </StackLayout>
            </GridLayout>
            <StackLayout class="p-20">
                <Button class="btn btn-default" text="Reload Prefs" @tap="onReload" />
                <Button class="btn btn-default" text="Debug" @tap="onDebug" />
                <Button class="btn btn-default" text="Clear" @tap="onClear" />
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { CoreTypes, EventData, View, alert, confirm } from '@nativescript/core';

import { Preferences } from '@nativescript-community/preferences';

const prefs = new Preferences();
export default class Basic extends Vue {
    message: string;
    preferenceKey: string;
    name_preference: string;
    enabled_preference: boolean;
    mounted() {
        this.reloadPrefs();

        setInterval(() => {
            this.reloadPrefs();
        }, 2000);
    }

    onOpeniOSSettings(args: EventData) {
        prefs.openSettings();
    }

    onGetValue(args: EventData) {
        this.message = prefs.getValue(this.preferenceKey);
    }

    onSetValue(args: EventData) {
        const textBox = page.getViewById('setText');
        prefs.setValue(this.preferenceKey, textBox.text);
        this.message = prefs.getValue(this.preferenceKey);
    }

    onDebug(args: EventData) {
        // debugger;
    }

    onReload(args: EventData) {
        this.reloadPrefs();
    }

    onClear(args: EventData) {
        prefs.clear();
    }

    reloadPrefs() {
        console.log('Reloading prefs');
        this.name_preference = prefs.getValue('name_preference', 'Not set');
        this.enabled_preference = prefs.getValue('enabled_preference', false);
    }
}
</script>

<style scoped lang="scss">
ActionBar {
    background-color: #42b883;
    color: white;
}
Button {
    background-color: #42b883;
    color: white;
}
</style>
