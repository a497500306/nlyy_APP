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
var DjssztchwcLB = require('./MLDjssztchwcLB');

var Djssztchwc = React.createClass({

    getInitialState() {
        return {
            shuliang:"",
            animating: false,//是否显示菊花
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'查询受试者'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>

                <View style={styles.zongViewStyle}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder="请输入受试者编号或姓名缩写或性别或手机号..."
                               clearButtonMode="always"
                               onChangeText={this.onZhanghao}//获取输入
                               underlineColorAndroid={'transparent'}
                    />
                    <Text style={{marginTop:10,}}>（‘001’，‘ZLY’，‘男’，‘13945678900’）</Text>
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
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        this.setState({animating:true});
        //发送网络请求
        fetch(settings.fwqUrl + "/app/getVagueBasicsDataUser", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                str : this.state.shuliang,
                SiteID : UserSite,
                StudyID : Users.Users[0].StudyID
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({animating:false});
                if (responseJson.data.length == 0) {
                    Alert.alert(
                        '提示:',
                        '未查到相关数据',
                        [
                            {text: '确定'}
                        ]
                    )
                }else{
                    // 页面的切换
                    this.props.navigator.push({
                        component: DjssztchwcLB, // 具体路由的版块
                        //传递参数
                        passProps:{
                            data:responseJson.data
                        }
                    });
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
module.exports = Djssztchwc;

