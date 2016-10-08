const React = require('react-native');
const Platform = require('Platform');
const _ = require('lodash');

var {
  NativeModules: {
      Utils,
  }
} = React;

var Uitls = {
  trackClick(name, atr) {
    console.log(name + ":" + atr);
    if (Platform.OS === 'android') {
      Utils.trackClick({name: name, atr: atr});
    } else if (Platform.OS === 'ios') {
      Utils.trackClick(name, atr);
    }
  },

  appInfo(cb) {
    if (Platform.OS === 'android') {
      Utils.appInfo((info) => {
        try {
          info = JSON.parse(info);
        } catch (e) {}
        cb && cb(info);
      });
    } else if (Platform.OS === 'ios') {
      Utils.appInfo((info) => {
        cb && cb(info);
      });
    }
  }
};

module.exports = Uitls;
