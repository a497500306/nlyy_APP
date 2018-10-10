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
var ApplicationAndAudit = require('../../../../entity/ApplicationAndAudit');

var settings = require("../../../../settings");
var Users = require('../../../../entity/Users');
var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');
var DgssztdjmLB = require('./MLDgssztdjmLB')

var Dgssztdjm = React.createClass({
    getDefaultProps(){
        return {
            UnblindingType:0
        }
    },
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
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>

                <View style={styles.zongViewStyle}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder="请输入受试者编号或姓名缩写或性别或手机号..."
                               clearButtonMode="always"
                               underlineColorAndroid={'transparent'}
                               onChangeText={this.onZhanghao}//获取输入
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


        var dgssztdjmSH = [];
        var dgssztdjmSQ = [];
        var dgsszjjjmSH = [];
        var dgsszjjjmSQ = [];
        var dgzxjjjmSH = [];
        var dgzxjjjmSQ = [];
        var zgyjjjjmSH = [];
        var zgyjjjjmSQ = [];
        for (var y = 0 ; y < ApplicationAndAudit.ApplicationAndAudit.length ; y++) {
            if (ApplicationAndAudit.ApplicationAndAudit[y].EventApp == 1){
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 1){
                    dgssztdjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 2){
                    dgsszjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 3){
                    dgzxjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 4){
                    zgyjjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
            }
            if (ApplicationAndAudit.ApplicationAndAudit[y].EventRev == 1){
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 1){
                    dgssztdjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 2){
                    dgsszjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 3){
                    dgzxjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 4){
                    zgyjjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
            }
        }

        var UserSite = '';
        var UserSiteYN = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            var data = Users.Users[i];
            //判断用户类别
            for (var y = 0; y < dgssztdjmSQ.length; y++) {
                if (data.UserFun == dgssztdjmSQ[y]) {
                    if (this.props.UnblindingType == 1){
                        if (data.UserSiteYN == 1){
                            UserSiteYN = 1
                        }else{
                            UserSite = data.UserSite
                        }
                    }
                }
            }
            //判断用户类别
            for (var y = 0; y < dgsszjjjmSQ.length; y++) {
                if (data.UserFun == dgsszjjjmSQ[y]) {
                    if (this.props.UnblindingType == 2){
                        if (data.UserSiteYN == 1){
                            UserSiteYN = 1
                        }else{
                            UserSite = data.UserSite
                        }
                    }
                }
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
                UserDepotYN:UserSiteYN,
                str : this.state.shuliang,
                SiteID : UserSite,
                StudyID : Users.Users[0].StudyID
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({animating:false});

                if (responseJson.isSucceed == 200) {
                    Alert.alert(
                        '提示:',
                        responseJson.msg,
                        [
                            {text: '确定'}
                        ]
                    )
                    return
                }else{
                    // 页面的切换
                    this.props.navigator.push({
                        component: DgssztdjmLB, // 具体路由的版块
                        //传递参数
                        passProps:{
                            data:responseJson.data,
                            //出生年月
                            UnblindingType:this.props.UnblindingType,
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
                        '请检查您的网络',
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
module.exports = Dgssztdjm;

