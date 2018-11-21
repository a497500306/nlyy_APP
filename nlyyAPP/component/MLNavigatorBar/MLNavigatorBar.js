/**
 * Created by maoli on 16/9/25.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    BackAndroid,
    ToastAndroid,
    DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var settings = require("../../settings");
var Users = require('../../entity/Users');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLNavigatorBar = React.createClass({
    //组件挂载的时候调用
    componentDidMount(){
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
        if (this.timer == null) {
            this.timer = setInterval(function () {
                //网络请求
                if (Users.Users != null) {
                    fetch(settings.fwqUrl + "/app/getHeartbeat", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            StudyID: Users.Users[0].StudyID
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.isSucceed == 222) {
                                Users.Users = null
                                console.log('发送通知')
                                //发送通知
                                DeviceEventEmitter.emit('subscriptionStudOff', '');
                            }
                        })
                        .catch((error) => {

                        });
                }
            }, 10000);
        }
    },

    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack)
        this.timer && clearTimeout(this.timer);
    },

    handleBack(){
        var navigator = this.navigator;
        if (this.props.backFunc == undefined) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {

                //最近2秒内按过back键，可以退出应用。

                return false;

            }

            this.lastBackPressed = Date.now();

            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);

            return true;
        }else{
            this.props.backFunc();
            return true;
        }
    },
    getDefaultProps(){
        return {
            title:"",
            newTitle:"",
            rightTitle:"",
            leftTitle:"",
            isBack:true,
            backFunc: Component.func,
            newFunc: Component.func,
            leftFunc: Component.func
        }
    },
    render() {
        if (this.props.isBack == true){
            if (this.props.newTitle === '' && this.props.rightTitle === ''){
                return (
                    <View>
                        <View style={styles.daohangIOSStyle}/>
                        <View style={styles.daohangStyle}>
                            <TouchableOpacity style={{position:'absolute', left:0, bottom:7}} onPress={this.props.backFunc}>
                                <Icon style={{marginLeft:15,marginRight:15}} name="angle-left" size={25} color="white" />
                            </TouchableOpacity>
                            {this.props.leftTitle == '' ? [] : (this.props.leftTitle == "首页" ? [
                                <TouchableOpacity style={{position:'absolute', left:25 + 15, bottom:7}} onPress={this.props.leftFunc}>
                                    <Icon style={{marginLeft:15,marginRight:15}} name="home" size={25} color="white" />
                                </TouchableOpacity>
                            ] : [
                                <TouchableOpacity style={{position:'absolute', left:25 + 15, bottom:7}} onPress={this.props.leftFunc}>
                                    <Text style={{marginLeft:15,marginRight:15,color:'white',fontSize:15,height:20}}>{this.props.leftTitle}</Text>
                                </TouchableOpacity>
                            ])}

                            <Text style={{color:'white',fontSize: 16}}>
                                {this.props.title}
                            </Text>
                        </View>
                    </View>
                );
            }else {
                return (
                    <View>
                        <View style={styles.daohangIOSStyle}/>
                        <View style={styles.daohangStyle}>
                            <TouchableOpacity style={{position:'absolute', left:0, bottom:7}} onPress={this.props.backFunc}>
                                <Icon style={{marginLeft:15,marginRight:15}} name="angle-left" size={30} color="white" />
                            </TouchableOpacity>
                            {this.props.leftTitle == '' ? [] : (this.props.leftTitle == "首页" ? [
                                <TouchableOpacity style={{position:'absolute', left:25 + 15, bottom:7}} onPress={this.props.leftFunc}>
                                    <Icon style={{marginLeft:15,marginRight:15}} name="home" size={25} color="white" />
                                </TouchableOpacity>
                            ] : [
                                <TouchableOpacity style={{position:'absolute', left:25 + 15, bottom:7}} onPress={this.props.leftFunc}>
                                    <Text style={{marginLeft:15,marginRight:15,color:'white',fontSize:15,height:20}}>{this.props.leftTitle}</Text>
                                </TouchableOpacity>
                            ])}
                            <Text style={{color:'white',fontSize: 16}}>
                                {this.props.title}
                            </Text>
                            <TouchableOpacity style={{position:'absolute', right:0, bottom:11}} onPress={this.props.newFunc}>
                                {this.props.newTitle != '' ? [
                                    <Icon style={{marginLeft:15,marginRight:15}} name={this.props.newTitle} size={25} color="white" />
                                ] : [
                                    <Text style={{
                                        marginLeft:15,marginRight:10,
                                        width:40,
                                        color:'white',
                                        fontSize:15
                                    }}>{this.props.rightTitle}</Text>
                                ]}
                                </TouchableOpacity>
                        </View>
                    </View>
                );
            }
        }else{
            return (
                <View>
                    <View style={styles.daohangIOSStyle}/>
                    <View style={styles.daohangStyle}>
                        <Text style={{color:'white',fontSize: 16}}>
                            {this.props.title}
                        </Text>
                    </View>
                </View>
            );
        }
    },
});

const styles = StyleSheet.create({
    daohangStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'space-around',

        width:width,
        height:44,
        backgroundColor:'rgba(0,136,212,1.0)',
    },
    daohangIOSStyle:{
        width:width,
        height:Platform.OS == 'ios' ? (height == 812 ? 24 + 20 : 20) : 0,
        backgroundColor:'rgba(0,136,212,1.0)',
    },
});

// 输出组件类
module.exports = MLNavigatorBar;