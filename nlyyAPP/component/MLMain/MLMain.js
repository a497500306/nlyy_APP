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
    Navigator,
    DeviceEventEmitter,
    Alert,
    NativeModules
} from 'react-native';

// var Login = require('../MLLogin/MLLogin')
import Login from '../MLLogin/MLLogin'

var Main = React.createClass({
    componentDidMount(){
        this.subscriptionStudOff = DeviceEventEmitter.addListener('subscriptionStudOff', this.subscriptionStudOff.bind(this));
    },
    subscriptionStudOff(){
        Alert.alert(
            '提示',
            '研究被下线。',
            [
                {text: '确定'}
            ]
        );
        this.props.navigator.resetTo({
            name:'登陆',
            component: Login, // 具体路由的版块
        })
    },
    render(){
        return(
            <Navigator
                initialRoute={{name:'登陆',component:Login}}
                configureScene={()=>{
                    return Navigator.SceneConfigs.PushFromRight;
                }}
                renderScene={(route,navigator)=>{
                    let Component = route.component;
                    return <Component {...route.passProps} navigator={navigator}/>;
                }}
            />
        )
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

//输出
module.exports = Main;