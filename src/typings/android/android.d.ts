declare module com {
    export module nativescript {
        export module preferences {
            export class NativescriptSettingsActivity extends androidx.appcompat.app.AppCompatActivity {}
        }
    }
}
declare module androidx {
    export module preference {
        export class PreferenceManager {
            static getDefaultSharedPreferences(context:globalAndroid.content.Context): android.content.SharedPreferences;
        }
    }
}
