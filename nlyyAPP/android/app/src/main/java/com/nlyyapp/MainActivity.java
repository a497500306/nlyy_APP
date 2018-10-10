package com.nlyyapp;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import java.io.File;

import javax.annotation.Nullable;

import cn.jpush.android.api.JPushInterface;
public class MainActivity extends ReactActivity {


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "nlyyAPP";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }
}
