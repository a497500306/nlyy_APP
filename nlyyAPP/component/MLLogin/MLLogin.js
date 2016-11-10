/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Alert,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Platform,
    ActivityIndicator,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var TimerMixin = require('react-timer-mixin');//定时器

var SelectionStudy = require('../MLSelectionStudy/MLSelectionStudy');

var settings = require("../../settings");
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLService = require('../../service/MLService');
var UserData = require('../../entity/UserData');
// var ProgressHUD = require('react-native-progress-hud');

var t ;

var login = React.createClass({
    mixins: [TimerMixin],

    getInitialState() {
        return {
            zhanghao:"",
            yanzhenma:"",
            dataYZM:"3396721",//服务器传回的验证码
            isYZMBtn:false,//是否可以点击验证码
            YZMBtnTime:0,//倒数时间
            animating: false,//是否显示菊花
        }
    },
    // 复杂的操作:定时器\网络请求
    componentDidMount(){
        //计时器
        this.setInterval(
            () => {
                // 页面的切换
                if (this.state.YZMBtnTime != 0){
                    console.log(this.state.YZMBtnTime)
                    this.setState({YZMBtnColor: 'gray'});
                    this.setState({YZMBtnTime:this.state.YZMBtnTime-1})
                }else{
                    this.setState({YZMBtnColor: 'rgba(0,136,212,1.0)'});
                    this.setState({isYZMBtn:false})
                }
            },
            1000
        );
    },
    render(){
        return(
            <View style={styles.container}>
                {/*导航条*/}
                <View style={styles.daohangIOSStyle}></View>
                <View style={styles.daohangStyle}>
                    <Text style={{color:'white',fontSize: 16}}>
                        登录
                    </Text>
                </View>
                <View style={styles.zongViewStyle}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder="请输入手机号"
                               keyboardType="numeric"
                               clearButtonMode="always"
                               onChangeText={this.onZhanghao}//获取输入
                    />
                     <View style={styles.yanzhenmaViewStyle}>
                        <TextInput style={styles.yanzhengmaStyle}
                                   placeholder="请输入验证码"
                                   keyboardType="numeric"
                                   clearButtonMode="always"
                                   onChangeText={this.onYanzhenma}//获取输入
                        />
                         <TouchableOpacity style={styles.yanzhengmaBtnStyle} onPress={this.getIDCode} disabled={this.state.isYZMBtn}>
                            <Text style={{color:'white',fontSize: 14}}>
                                {this.state.YZMBtnTime===0 ? '发送验证码':this.state.YZMBtnTime + 's后重发'}
                            </Text>
                         </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                        <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                            登 录
                        </Text>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={[styles.centering, {height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
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
        )
    },
    //输入账号时
    onZhanghao(text){
        this.setState({zhanghao: text});
    },

    //输入验证码时
    onYanzhenma(text){
        this.setState({yanzhenma: text});
    },

    //获取验证码
    getIDCode(){
        //开启定时器倒数
        this.setState({YZMBtnTime:30,isYZMBtn:true})
        //判断手机号是否输入11位
        if (this.state.zhanghao.length == 11){
            //发送验证码网络请求
            // MLService.mlPost("/app/getIDCode",{
            //     phone: this.state.zhanghao
            // },function (responseJson, error, type) {
            //     console.log(responseJson,error,type)
            //     if (type == 1){
            //         if (error == null){//正确
            //             if (responseJson.isSucceed == 200){
            //                 //错误
            //                 Alert.alert(
            //                     responseJson.msg,
            //                     null,
            //                     [
            //                         {text: '确定'}
            //                     ]
            //                 )
            //             }else {
            //                 //接收到了数据
            //                 this.setState({dataYZM: responseJson.IDCode});
            //             }
            //         }else{//错误
            //             Alert.alert(
            //                 '网络连接失败',
            //                 null,
            //                 [
            //                     {text: '确定'}
            //                 ]
            //             )
            //         }
            //     }
            // })

            //网络请求
            fetch(settings.fwqUrl + "/app/getIDCode", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: this.state.zhanghao
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.isSucceed == 200){
                        //错误
                        Alert.alert(
                            responseJson.msg,
                            null,
                            [
                                {text: '确定'}
                            ]
                        )
                    }else {
                        //接收到了数据
                        this.setState({dataYZM: responseJson.IDCode});
                    }
                })
                .catch((error) => {
                    Alert.alert(
                        '网络连接失败',
                        null,
                        [
                            {text: '确定'}
                        ]
                    )
                });
        }else {//提示错误
            Alert.alert(
                '您输入的手机号有误',
                null,
                [
                    {text: '确定'}
                ]
            )
        }
    },

    //登录
    getLogin(){
        // this.showProgressHUD();
        if (this.state.zhanghao.length != 11){
            Alert.alert(
                '您输入的手机号有误',
                null,
                [
                    {text: '确定'}
                ]
            );
            return;
        }
        if (this.state.yanzhenma.length == 0){
            Alert.alert(
                '请输入验证码',
                null,
                [
                    {text: '确定'}
                ]
            );
            return;
        }
        if (this.state.dataYZM != this.state.yanzhenma){
            Alert.alert(
                '验证码输入错误',
                null,
                [
                    {text: '确定'}
                ]
            );
            return;
        }
        this.setState({animating:true});
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getLogin", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: this.state.zhanghao
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({animating:false});
                if (responseJson.isSucceed == 200){
                    //错误
                    Alert.alert(
                        responseJson.msg,
                        null,
                        [
                            {text: '确定'}
                        ]
                    )
                }else {
                    UserData.phone = this.state.zhanghao;
                    UserData.data = responseJson.data;
                    this.setState({animating:false});
                    // 页面的切换
                    this.props.navigator.replace({
                        name:'选择研究',
                        component: SelectionStudy, // 具体路由的版块
                        params: {
                            phone: '321321'
                        }
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
    }
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    daohangIOSStyle:{
        width:width,
        height:Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'rgba(0,136,212,1.0)',
    },
    daohangStyle:{
        alignItems: 'center',
        justifyContent:'center',
        width:width,
        height:44,
        backgroundColor:'rgba(0,136,212,1.0)',
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
    yanzhenmaViewStyle: {
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'space-around'
    },
    yanzhengmaStyle: {
        width:width - 100,
        height: 40,
        backgroundColor:'white',
        marginTop:1,
        paddingLeft:10,
        fontSize: 14
    },
    yanzhengmaBtnStyle:{
        alignItems: 'center',
        justifyContent:'center',
        marginTop:1,
        width:100,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
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

//输出
module.exports = login