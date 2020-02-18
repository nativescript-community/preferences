if ((<any>global).TNS_WEBPACK) {
    require("@nativescript/core/bundle-entry-points");

    global.registerModule("main-page", () => require("./main-page"));
}