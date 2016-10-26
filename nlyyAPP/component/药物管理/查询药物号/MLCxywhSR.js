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
var Cxywh = require('./MLCxywh')

var CxywhSR = React.createClass({
    getInitialState() {
        return {
            shuliang:"",
            animating: false,//是否显示菊花
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'查询药物号'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>

                <View style={styles.zongViewStyle}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder="请输入药物号"
                               keyboardType="numeric"
                               clearButtonMode="always"
                               onChangeText={this.onZhanghao}//获取输入
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
            this.setState({animating:true});
            //发送网络请求
            fetch(settings.fwqUrl + "/app/getDrugWLData", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'StudyID' : Users.Users[0].StudyID,
                    'DrugNum' : this.state.shuliang
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({animating:false});
                    console.log(responseJson)
                    if (responseJson.isSucceed == 400) {
                        // 页面的切换
                        this.props.navigator.push({
                            name:'分配清单',
                            component: Cxywh, // 具体路由的版块
                            //传递参数
                            passProps:{
                                datas : responseJson
                            },
                        });
                    }else {
                        //错误
                        Alert.alert(
                            '提示:',
                            responseJson.msg,
                            [
                                {text: '确定'}
                            ]
                        )
                    }
                })
                .catch((error) => {//错误
                    this.setState({animating:false});
                    console.log(error),
                        //错误
                        Alert.alert(
                            '提示:',
                            '请检查您的网络111',
                            [
                                {text: '确定'}
                            ]
                        )
                });
    }
});

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
module.exports = CxywhSR;

