package com.rotati.oscarhq.stagging;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

public class MainApplication extends NavigationApplication {

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new VectorIconsPackage(),
            new RNExitAppPackage(),
            new ReactNativeRestartPackage(),
            new FastImageViewPackage(),
            new ReactNativeDocumentPicker(),
            new ImagePickerPackage(),
            new BackgroundTimerPackage(),
            new AsyncStoragePackage(),
            new RNFetchBlobPackage(),
            new LinearGradientPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
