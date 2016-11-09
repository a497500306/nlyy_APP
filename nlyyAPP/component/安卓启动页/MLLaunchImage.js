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
    Image
} from 'react-native';

/**----导入外部的组件----**/
var Main = require('../../component/MLMain/MLMain');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var Launch = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.biaoshiStyle}>
                    <Text style={{color:'gray',fontSize: 14}}>上海诺兰医药科技有限公司</Text>
                    <Text style={{color:'gray',fontSize: 18,marginTop:10,}}>随着走研究管理和随机平台</Text>
                    <Image
                        style={{width:44, height:44,marginTop:10}}
                        source={require('../../logo1025.png')}
                    />
                    <View style={{marginTop:10,marginBottom:80,
                        // 设置主轴的方向
                        flexDirection:'row',
                        // 垂直居中 ---> 设置侧轴的对齐方式
                        alignItems:'center',
                        // 设置主轴的对齐方式
                        justifyContent:'space-around'}}>
                        <Text style={{color:'gray',fontSize: 14}}>Copyright® </Text>
                        <Text style={{color:'blue',fontSize: 14}}>www.knowlands.net</Text>
                    </View>
                </View>
            </View>
        );
    },

    // 复杂的操作:定时器\网络请求
    componentDidMount(){
        // 定时: 隔2s切换到Main
        setTimeout(()=>{
            // 页面的切换
            this.props.navigator.replace({
                component: Main, // 具体路由的版块
            });
        }, 1500);
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    biaoshiStyle:{
        position:'absolute',
        bottom:10,
        alignItems: 'center',
        justifyContent:'center',
        width:width,
        height: 60,
    }
});

// 输出组件类
module.exports = Launch;
