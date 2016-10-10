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
    Alert,
    ScrollView
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var settings = require("../../../settings");
var Users = require('=../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var FPQDData = require('./保存数据/FPQDData');
var FPChangku = require('./保存数据/FPChangku');
var FPZhongxin = require('./保存数据/FPZhongxin');

var Ywqd = React.createClass({
    getInitialState() {
        return {
            animating: false,//是否显示菊花
            quxiaoanimating: false,//是否显示菊花
        }
    },
    render() {
        console.log(FPQDData.FPQDData)
        var yaowuhao = '';
        for(var i = 0 ; i < FPQDData.FPQDData.drugs.length ; i++){
            if ((i + 1 )%3 == 0){
                yaowuhao = yaowuhao + FPQDData.FPQDData.drugs[i].DrugNum + '；\n'
            }else{
                yaowuhao = yaowuhao + FPQDData.FPQDData.drugs[i].DrugNum + '；     '
            }
        }
        if (FPQDData.FPQDData.Type == 1){//有仓库数据
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ScrollView>
                    <View style={{backgroundColor: 'white'}}>
                        <Text style={[styles.textStyles, {color:'red'}]}>
                            {'清单仅会保留5分钟,请尽快操作'}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'研究简称:' +  FPQDData.FPQDData.Users.StudNameS}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'仓库编号:' + FPQDData.FPQDData.Address.DepotID}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'仓库名称:' + FPQDData.FPQDData.Address.DepotName}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'仓库地址:' + FPQDData.FPQDData.Address.DepotCity + " " + FPQDData.FPQDData.Address.DepotAdd}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'仓管员姓名:' + FPQDData.FPQDData.Address.DepotKper}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'仓管员手机号:' + FPQDData.FPQDData.Address.DepotMP}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'药物号:'}
                        </Text>
                        <Text style={styles.textStyles}>
                            {yaowuhao}
                        </Text>
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
                        <TouchableOpacity style={styles.quxiaoBtnStyle} onPress={this.getQuxiao}>
                            <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                                取 消
                            </Text>
                            <ActivityIndicator
                                animating={this.state.quxiaoanimating}
                                style={[styles.centering, {height: 30}]}
                                size="small"
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </View>
            );
        }else{//有中心数据
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ScrollView>
                    <View style={{backgroundColor: 'white'}}>
                        <Text style={[styles.textStyles, {color:'red'}]}>
                            {'清单仅会保留5分钟,请尽快操作'}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'研究简称:' + FPQDData.FPQDData.Users.StudNameS}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'中心编号:' + FPQDData.FPQDData.Address.SiteID}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'中心名称:' + FPQDData.FPQDData.Address.SiteNam}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'中心地址:' + FPQDData.FPQDData.Address.SiteCity + " " + FPQDData.FPQDData.Address.SiteAdd}
                        </Text>
                        <Text style={styles.textStyles}>
                            {'药物号:'}
                        </Text>
                        <Text style={styles.textStyles}>
                            {yaowuhao}
                        </Text>
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
                        <TouchableOpacity style={styles.quxiaoBtnStyle} onPress={this.getQuxiao}>
                            <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                                取 消
                            </Text>
                            <ActivityIndicator
                                animating={this.state.quxiaoanimating}
                                style={[styles.centering, {height: 30}]}
                                size="small"
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </View>
            );
        }
    },
    //点击确定
    getLogin(){

    },
    //点击取消
    getQuxiao(){

    }


});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
    },
    textStyles: {
        marginTop:5,
        marginLeft:5
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
    quxiaoBtnStyle:{
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
        backgroundColor:'red',
        // 设置圆角
        borderRadius:5,
        marginBottom:20
    }
});

// 输出组件类
module.exports = Ywqd;


