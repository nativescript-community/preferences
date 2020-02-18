package com.nativescript.preferences;

import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.PreferenceManager;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

public class NativescriptSettingsActivity extends AppCompatActivity {
    final static String TAG = "NativescriptSettingsActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportFragmentManager().beginTransaction().replace(android.R.id.content, new MainPreferenceFragment())
                .commit();

    }

    public static class MainPreferenceFragment extends PreferenceFragmentCompat {
        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
        }

        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            getPreferenceManager().setSharedPreferencesName("prefs.db");
            setPreferencesFromResource(R.xml.preferences, rootKey);
        }
    }
}
