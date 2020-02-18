var Preferences = require("nativescript-akylas-preferences").Preferences;
var preferences = new Preferences();

describe("greet function", function() {
    it("exists", function() {
        expect(preferences.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(preferences.greet()).toEqual("Hello, NS");
    });
});