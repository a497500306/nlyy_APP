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
    TouchableOpacity,
    Navigator
} from 'react-native';

var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');

var Qdfp = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'区段分配'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
            </View>
        );
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = Qdfp;

