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

var settings = require("../../../../settings");
var Users = require('../../../../entity/Users');
var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');
var Ywqd = require('../MLYwqd');
var FPChangku = require('../保存数据/FPChangku');
var FPZhongxin = require('../保存数据/FPZhongxin');
var FPQDData = require('../保存数据/FPQDData');

var Ywhgsfp = React.createClass({
    getInitialState() {
        return {
            shuliang:"",
            animating: false,//是否显示菊花
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'按药物号个数分配'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>

                <View style={styles.zongViewStyle}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder="请输入药物号个数"
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
        if (check(this.state.shuliang) == 1){
            this.setState({animating:true});
            //发送网络请求
            fetch(settings.fwqUrl + "/app/getYwhgsfp", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    StudyID: Users.Users.StudyID,
                    Number : this.state.shuliang,
                    Users : Users.Users,
                    Address : FPChangku.FPChangku == null ? FPZhongxin.FPZhongxin : FPChangku.FPChangku,
                    Type : FPChangku.FPChangku == null ? 2 : 1
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({animating:false});
                    if (responseJson.isSucceed != 400){
                        //错误
                        Alert.alert(
                            responseJson.msg,
                            null,
                            [
                                {text: '确定'}
                            ]
                        )
                    }else {
                        this.setState({animating:false});
                        FPQDData.FPQDData = responseJson.data
                        // 页面的切换
                        this.props.navigator.push({
                            name:'分配清单',
                            component: Ywqd, // 具体路由的版块
                        });
                    }
                })
                .catch((error) => {//错误
                    this.setState({animating:false});
                    console.log(error),
                        //错误
                        Alert.alert(
                            '请检查您的网络111',
                            null,
                            [
                                {text: '确定'}
                            ]
                        )
                });
        }else{
            //错误
            Alert.alert(
                '请输入正确的正整数',
                null,
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
module.exports = Ywhgsfp;

