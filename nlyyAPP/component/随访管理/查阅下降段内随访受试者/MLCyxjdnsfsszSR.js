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
    Navigator,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var settings = require("../../../settings");
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Cyxjdnsfssz = require('./MLCyxjdnsfssz')

var MLCyxjdnsfsszSR = React.createClass({
    getInitialState() {
        return {
            shuliang:"",
            animating: false,//是否显示菊花
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'下阶段内随访受试者'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>

                <View style={styles.zongViewStyle}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder="输入天数"
                               keyboardType="numeric"
                               clearButtonMode="always"
                               onChangeText={this.onZhanghao}//获取输入
                               underlineColorAndroid={'transparent'}
                    />
                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                        <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                            确 定
                        </Text>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={[styles.centering, {height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
    //输入账号时
    onZhanghao(text){
        this.setState({shuliang: text});
    },

    //点击确定
    getLogin(){
        if (check(this.state.shuliang) == 1){
            if (this.state.shuliang > 21){
                //错误
                Alert.alert(
                    '提示:',
                    '不可大于21天',
                    [
                        {text: '确定'}
                    ]
                )
                return
            }
            // 页面的切换
            this.props.navigator.push({
                component: Cyxjdnsfssz, // 具体路由的版块
                //传递参数
                passProps:{
                    shuliang:this.state.shuliang
                }
            });
        }else{
            //错误
            Alert.alert(
                '提示:',
                '请输入正确的正整数',
                [
                    {text: '确定'}
                ]
            )
        }
    }
});


//判断是否为正整数
function check(num){
    var arr = /^[0-9]*[1-9][0-9]*$/.exec(num);
    if(arr){
        if(arr[1]){
            return 2;
        }
        else{
            return 1;
        }
    }
    else{
        return 3;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    zongViewStyle: {
        marginTop:20
    },
    zhanghaoStyle: {
        width:width,
        height: 40,
        backgroundColor:'white',
        paddingLeft:10,
        fontSize: 14,
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginTop:20,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
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
module.exports = MLCyxjdnsfsszSR;

