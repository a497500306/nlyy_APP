/**
 * Created by maoli on 16/10/9.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Switch,
    ActivityIndicator
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLActivityIndicatorView = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    style={[styles.centering, {height: 30}]}
                    size="small"
                    color="rgba(150,150,150,1.0)"
                />
                <Text
                    style={[{color:"rgba(150,150,150,1.0)"}]}
                >正在加载中...</Text>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});

// 输出组件类
module.exports = MLActivityIndicatorView;