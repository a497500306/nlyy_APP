/**
 * Created by maoli on 16/9/25.
 */
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

var SelectionStudy = require('./MLSelectionStudy');

var SelectionNav = React.createClass({
    render() {
        return (
            <Navigator
                initialRoute={{name:'选择研究',component:SelectionStudy}}
                configureScene={()=>{
                    return Navigator.SceneConfigs.PushFromRight;
                }}
                renderScene={(route,navigator)=>{
                    let Component = route.component;
                    return <Component {...route.passProps} navigator={navigator}/>;
                }}
            />
        );
    },
});


// 输出组件类
module.exports = SelectionNav;
