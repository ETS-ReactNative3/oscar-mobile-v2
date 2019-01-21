[ ![Codeship Status for rotati/oscar-mobile](https://app.codeship.com/projects/2542c5e0-1dc3-0135-7999-72261b85e95c/status?branch=master)](https://app.codeship.com/projects/220426)
# oscar-mobile

OSCaR Mobile Application

# Getting Started

## Setup
### Install Git and Guide
[Installing and Using](http://rogerdudler.github.io/git-guide/)

### Dependencies for all

You will need to install Android Studio to run the app in the Android Emulator.

### Dependencies for Linux

You will need node.js, the React Native command line tools, Watchman, and Android Studio.

Follow the [installation instructions for your Linux distribution](https://nodejs.org/en/download/package-manager/) to install Node.js 4 or newer.

Node comes with npm, which lets you install the React Native command line interface.

```
npm install -g react-native-cli
```

### Dependencies for Mac

You will need Xcode, node.js, the React Native command line tools, and Watchman.

We recommend installing node and watchman via [Homebrew](http://brew.sh/)

```
    brew install node
    brew install watchman
```

__[Install React Native](https://facebook.github.io/react-native/docs/getting-started.html#content)__
 Node comes with npm, which lets you install the React Native command line interface.
 ```
 npm install -g react-native-cli
 ```

If you get a permission error, try with sudo: `sudo npm install -g react-native-cli`.

If you get error Cannot find module 'npmlog', try this before: curl -0 -L http://npmjs.org/install.sh | sudo sh.


### Install dependencies

 ```
  npm install
 ```

### [Link dependencies](https://facebook.github.io/react-native/docs/linking-libraries-ios.html)

## Testing your React Native Installation:

* For Android: assuming you have an emulator or device attached.

```
npm run android
```

* A common issue is that the packager is not started automatically when you run react-native run-android. You can start it manually using:

```
npm start
```

* For IOS: assuming you have an emulator.

```
npm run ios
```

* If everything is set up correctly, you should see your new app running in your emulator shortly.


## NOTE (If the app show cannot connect to the development server)

#### Make sure your computer and your device connect on same network connection

* Shake phone device
* Chooses Dev Settings
* Chooses Debug server host & port for device
* type in your network ip with the fProvisioning APNs SSL Certificatesollowing port

 ```
ex: 192.168.0.1:8081
 ```
