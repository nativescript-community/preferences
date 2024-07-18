<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->[![Twitter Follow][twitter-image]][twitter-url]

[twitter-image]:https://img.shields.io/twitter/follow/stevemcniven.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/stevemcniven



[](#nativescript-communitypreferences)

# @nativescript-community/preferences

This plugin allows native preference saving\loading on iOS and Android

<img src="https://raw.githubusercontent.com/sitefinitysteve/@nativescript-community/preferences/master/images/ios-sample.gif" width="200" />
<img src="https://raw.githubusercontent.com/sitefinitysteve/@nativescript-community/preferences/master/images/android-sample.gif" width="200" />


[](#ios-prerequisites)

## iOS Prerequisites

* Create iOS Settings.bundle files in App_Resources/iOS [See Demo](https://github.com/sitefinitysteve/@nativescript-community/preferences/tree/master/demo/app/App_Resources/iOS/Settings.bundle)
or [Apple Developer docs](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html)


[](#android-prerequisites)

## Android Prerequisites
* In App_Resources/Android/xml create [preferences.xml](https://github.com/sitefinitysteve/@nativescript-community/preferences/blob/master/demo/app/App_Resources/Android/xml/preferences.xml)
* Android [PreferenceScreen docs](https://developer.android.com/reference/android/preference/PreferenceScreen.html)


[](#installation)

## Installation

Describe your plugin installation steps. Ideally it would be something like:

```javascript
tns plugin add @nativescript-community/preferences
```


[](#usage-)

## Usage 

```javascript
    var prefs = new Preferences();

    //Get existing value
    prefs.getValue("name_preference");

    //Set value
    prefs.setValue("name_preference", "some new text");
```


[](#api)

## API
    
| Property | Default | Description |
| --- | --- | --- |
| openSettings(): any; |  | Opens the native settings panes |
| getValue(key: string): any; |  | Gets the value for the preference |
| setValue(key: string, value: any): void; |  | Sets the passed value to the preference |
    

[](#license)

## License

Apache License Version 2.0, January 2004


[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```

[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).