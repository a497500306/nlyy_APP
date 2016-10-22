/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    Navigator
} from 'react-native';

var Main = require('./component/MLMain/MLMain');
var lll = require('./component/安卓启动页/MLLaunchImage');

class nlyyAPP extends Component {
  render() {
    return (
        <Navigator
            initialRoute={{name:'启动页',component:lll}}
            configureScene={()=>{
              return Navigator.SceneConfigs.PushFromRight;
            }}
            renderScene={(route,navigator)=>{
              let Component = route.component;
              return <Component {...route.passProps} navigator={navigator}/>;
            }}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('nlyyAPP', () => nlyyAPP);
