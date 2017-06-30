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
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var FPQDData = require('./保存数据/FPQDData');
var FPChangku = require('./保存数据/FPChangku');
var FPZhongxin = require('./保存数据/FPZhongxin');
var Changku = require('../../../entity/Changku')

var Ywqd = React.createClass({
    //耗时操作,网络请求
    componentDidMount(){
        if (FPQDData.FPQDData.Type == 2){
            //发送登录网络请求
            fetch(settings.fwqUrl + "/app/getZXCGYData", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserSite : FPQDData.FPQDData.Address.SiteID,
                    StudyID : Users.Users[0].StudyID
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.isSucceed != 400){
                        //错误
                        Alert.alert(
                            '提示',
                            responseJson.msg,
                            [
                                {text: '确定'}
                            ]
                        )
                    }else{
                        this.setState({
                            zxUser:responseJson.data,
                            animating : false
                        });
                    }
                })
                .catch((error) => {//错误
                    //错误
                    Alert.alert(
                        '提示',
                        '请检查您的网络',
                        [
                            {text: '确定'}
                        ]
                    )

                });
        }else{
            this.setState({
                animating : false
            })
        }
    },
    getInitialState() {
        return {
            animating: true,//是否显示菊花
            quxiaoanimating: false,//是否显示菊花
            zxUser : null
        }
    },
    getDefaultProps(){
        return {
            isBtn : true,
        }
    },
    render() {
        console.log(FPQDData.FPQDData)
        var yaowuhao = '';
        var lie = width / 75;
        for(var i = 0 ; i < FPQDData.FPQDData.drugs.length ; i++){
            if ((i + 1 )%lie == 0){
                yaowuhao = yaowuhao + FPQDData.FPQDData.drugs[i].DrugNum + '；\n'
            }else if (i == FPQDData.FPQDData.drugs.length - 1){
                yaowuhao = yaowuhao + FPQDData.FPQDData.drugs[i].DrugNum + '     '
            }else{
                yaowuhao = yaowuhao + FPQDData.FPQDData.drugs[i].DrugNum + '；     '
            }
        }
        console.log(yaowuhao)
        if (this.state.animating == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.animating == false) {
            if (FPQDData.FPQDData.Type == 1) {//有仓库数据
                if (this.props.isBtn == true) {
                    console.log("有仓库数据1")
                    return (
                        <View style={styles.container}>
                            <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                                this.props.navigator.pop()
                            }}/>
                            <ScrollView>
                                <View style={{backgroundColor: 'white'}}>
                                    <Text style={styles.textStyles}>
                                        {'研究编号:' + Users.Users[0].StudyID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究简称:' + Users.Users[0].StudNameS}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究全称:' + Users.Users[0].StudNameF}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'发出仓库编号:' + Changku.Changku.DepotID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库名称:' + Changku.Changku.DepotName}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库地址:' + Changku.Changku.DepotCity + " " + Changku.Changku.DepotAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员姓名:' + Changku.Changku.DepotKper}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员手机号:' + Changku.Changku.DepotMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'接收仓库编号:' + FPQDData.FPQDData.Address.DepotID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓库名称:' + FPQDData.FPQDData.Address.DepotName}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓库地址:' + FPQDData.FPQDData.Address.DepotCity + " " + FPQDData.FPQDData.Address.DepotAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓管员姓名:' + FPQDData.FPQDData.Address.DepotKper}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓管员手机号:' + FPQDData.FPQDData.Address.DepotMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'药物号个数:' + FPQDData.FPQDData.drugs.length}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物号清单:'}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {yaowuhao}
                                    </Text>
                                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                                        <Text style={{color: 'white', fontSize: 14, marginLeft: 15}}>
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
                                        <Text style={{color: 'white', fontSize: 14, marginLeft: 15}}>
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
                } else {
                    console.log("有仓库数据2")
                    return (
                        <View style={styles.container}>
                            <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                                this.props.navigator.pop()
                            }}/>
                            <ScrollView>
                                <View style={{backgroundColor: 'white'}}>
                                    <Text style={styles.textStyles}>
                                        {'研究编号:' + Users.Users[0].StudyID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究简称:' + Users.Users[0].StudNameS}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究全称:' + Users.Users[0].StudNameF}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'发出仓库编号:' + FPQDData.FPQDData.UsedAddress.DepotID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库名称:' + FPQDData.FPQDData.UsedAddress.DepotName}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库地址:' + FPQDData.FPQDData.UsedAddress.DepotCity + " " + FPQDData.FPQDData.UsedAddress.DepotAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员姓名:' + FPQDData.FPQDData.UsedAddress.DepotKper}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员手机号:' + FPQDData.FPQDData.UsedAddress.DepotMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'接收仓库编号:' + FPQDData.FPQDData.Address.DepotID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓库名称:' + FPQDData.FPQDData.Address.DepotName}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓库地址:' + FPQDData.FPQDData.Address.DepotCity + " " + FPQDData.FPQDData.Address.DepotAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓管员姓名:' + FPQDData.FPQDData.Address.DepotKper}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'接收仓管员手机号:' + FPQDData.FPQDData.Address.DepotMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'药物号个数:' + FPQDData.FPQDData.drugs.length}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物号清单:'}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {yaowuhao}
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    );
                }
            } else {//有中心数据
                if (this.props.isBtn == true) {
                    console.log("有中心数据1")
                    return (
                        <View style={styles.container}>
                            <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                                this.props.navigator.pop()
                            }}/>
                            <ScrollView>
                                <View style={{backgroundColor: 'white'}}>
                                    <Text style={styles.textStyles}>
                                        {'研究编号:' + Users.Users[0].StudyID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究简称:' + Users.Users[0].StudNameS}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究全称:' + Users.Users[0].StudNameF}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'发出仓库编号:' + Changku.Changku.DepotID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库名称:' + Changku.Changku.DepotName}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库地址:' + Changku.Changku.DepotCity + " " + Changku.Changku.DepotAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员姓名:' + Changku.Changku.DepotKper}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员手机号:' + Changku.Changku.DepotMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'中心编号:' + FPQDData.FPQDData.Address.SiteID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'中心名称:' + FPQDData.FPQDData.Address.SiteNam}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'中心地址:' + FPQDData.FPQDData.Address.SiteCity + " " + FPQDData.FPQDData.Address.SiteAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物管理员名字:' + this.state.zxUser.UserNam}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物管理员手机:' + this.state.zxUser.UserMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'药物号个数:' + FPQDData.FPQDData.drugs.length}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物号清单:'}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {yaowuhao}
                                    </Text>
                                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                                        <Text style={{color: 'white', fontSize: 14, marginLeft: 15}}>
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
                                        <Text style={{color: 'white', fontSize: 14, marginLeft: 15}}>
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
                } else {
                    console.log("有中心数据2")
                    console.log(FPQDData.FPQDData)
                    console.log(Changku.Changku)
                    console.log(FPQDData.FPQDData.Address)
                    console.log(this.state.zxUser)
                    return (
                        <View style={styles.container}>
                            <MLNavigatorBar title={'分配清单'} isBack={true} backFunc={() => {
                                this.props.navigator.pop()
                            }}/>
                            <ScrollView>
                                <View style={{backgroundColor: 'white'}}>
                                    <Text style={styles.textStyles}>
                                        {'研究编号:' + Users.Users[0].StudyID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究简称:' + Users.Users[0].StudNameS}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'研究全称:' + Users.Users[0].StudNameF}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'发出仓库编号:' + FPQDData.FPQDData.UsedAddress.DepotID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库名称:' + FPQDData.FPQDData.UsedAddress.DepotName}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓库地址:' + FPQDData.FPQDData.UsedAddress.DepotCity + " " + FPQDData.FPQDData.UsedAddress.DepotAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员姓名:' + FPQDData.FPQDData.UsedAddress.DepotKper}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'发出仓管员手机号:' + FPQDData.FPQDData.UsedAddress.DepotMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'中心编号:' + FPQDData.FPQDData.Address.SiteID}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'中心名称:' + FPQDData.FPQDData.Address.SiteNam}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'中心地址:' + FPQDData.FPQDData.Address.SiteCity + " " + FPQDData.FPQDData.Address.SiteAdd}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物管理员名字:' + this.state.zxUser.UserNam}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物管理员手机:' + this.state.zxUser.UserMP}
                                    </Text>
                                    <Text style={{
                                        marginTop:15,
                                        marginLeft:5
                                    }}>
                                        {'药物号个数:' + FPQDData.FPQDData.drugs.length}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {'药物号清单:'}
                                    </Text>
                                    <Text style={styles.textStyles}>
                                        {yaowuhao}
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    );
                }
            }
        }
    },
    //点击确定
    getLogin(){
        console.log('11111');
        console.log(Changku.Changku);
        this.setState({animating:true});
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getAssignYwhgsfp", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : FPQDData.FPQDData.id,
                //选择的仓库
                UsedAddress : Changku.Changku,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.isSucceed == 400){
                    //移除等待
                    this.setState({quxiaoanimating:false});
                    Alert.alert(
                        '药物清单已发送到邮箱，请打印并交给快递员\n提交快递员后请在待运送药物清单中点击运送',
                        null,
                        [
                            {text: '确定', onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[4])}
                        ]
                    )

                }else{
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:false});
                    //错误
                    Alert.alert(
                        responseJson.msg,
                        null,
                        [
                            {text: '确定', onPress: () => this.props.navigator.pop()}
                        ]
                    )
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '请检查您的网络',
                    null,
                    [
                        {text: '确定'}
                    ]
                )
            });
    },
    //点击取消
    getQuxiao(){
        this.setState({quxiaoanimating:true});
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getCancelYwhgsfp", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : FPQDData.FPQDData.id,
                DepotGNYN : Changku.Changku == null ? 0 : Changku.Changku.DepotGNYN,//是否为主仓库:1是,0不是
                DepotBrYN : Changku.Changku == null ? 0 : Changku.Changku.DepotBrYN,//是否为分仓库:1是,0不是
                DepotId : Changku.Changku == null ? 0 : Changku.Changku.id,

            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.isSucceed == 400){
                    //移除等待
                    this.setState({quxiaoanimating:false});
                    Alert.alert(
                        '操作完成',
                        null,
                        [
                            {text: '确定', onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[7])}
                        ]
                    )

                }else{
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:false});
                    //错误
                    Alert.alert(
                        responseJson.msg,
                        null,
                        [
                            {text: '确定', onPress: () => this.props.navigator.pop()}
                        ]
                    )
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({quxiaoanimating:false});
                //错误
                Alert.alert(
                    '请检查您的网络',
                    null,
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


