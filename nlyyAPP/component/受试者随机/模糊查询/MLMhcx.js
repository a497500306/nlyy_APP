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
import Pickers from 'react-native-picker';
var researchParameter = require('../../../entity/researchParameter');

var settings = require("../../../settings");
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Qsjh = require('../取随机号/MLQsjh')
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var NetTool = require('../../../kit/net/netTool');

var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');

var Mhcx = React.createClass({
    getInitialState() {
        return {
            shuliang:"",
            animating: false,//是否显示菊花,
            zhongxin:"",
            suiji:"",
            tupian:"",
            bianhao:"",
            yonghuID:"",
            shuju:"",
            userData:[],
            USubjIDs:[],
            selectUser : null
        }
    },
    getDefaultProps(){
        return {
            /*
            * 0.取随机号
            * 1.揭盲申请--单个受试者特定揭盲
            *
            * */
            isVC:0,
            //是否是图片上传
            isImage:0
        }
    },

    // 慢操作放在这里
    componentDidMount(){
        if (this.props.isImage == 1) {
            var UserSite = '';
            for (var i = 0 ; i < Users.Users.length ; i++) {
                if (Users.Users[i].UserSite != null) {
                    if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ||
                        Users.Users[i].UserFun == 'H4' || Users.Users[i].UserFun == 'H1' || Users.Users[i].UserFun == 'M8' || Users.Users[i].UserFun == 'H5'){
                        UserSite = Users.Users[i].UserSite
                    }
                }
            }
            for (var i = 0 ; i < Users.Users.length ; i++) {
                if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ||
                    Users.Users[i].UserFun == 'H4' || Users.Users[i].UserFun == 'H1'){
                    if (Users.Users[i].UserSiteYN == 1) {
                        UserSite = ''
                    }
                }
            }
            if (this.props.isImage == 1){
                for (var i = 0 ; i < Users.Users.length ; i++) {
                    var data = Users.Users[i]
                    if (data.UserFun == 'S1' || data.UserFun == 'H3' || data.UserFun == 'H2' ||
                        data.UserFun == 'H5' || data.UserFun == 'M7' || data.UserFun == 'M8' ||
                        data.UserFun == 'M4' || data.UserFun == 'M5' || data.UserFun == 'M1' ||
                        data.UserFun == 'C2'){
                        if (Users.Users[i].UserSiteYN == 1) {
                            UserSite = ''
                        }else{
                            UserSite = data.UserSite
                        }
                    }
                }
            }
            Toast.loading('请稍候',60);
            NetTool.post(settings.fwqUrl +"/app/getImageVagueBasicsDataUser",{
                str : "",
                SiteID : UserSite,
                bianhao : "按编号排序",
                StudyID : Users.Users[0].StudyID,
                zhongxin:"",
                suiji:"",
                tupian:"",
                shuju:"",
            })
            .then((responseJson) => {
                Toast.hide()
                let data = []
                for (var i = 0 ; i < responseJson.data.length ; i++) {
                    data.push(responseJson.data[i].USubjID)
                }
                this.setState({
                    userData : responseJson.data,
                    USubjIDs : data
                })
            })
            .catch((error)=>{
                Toast.hide()
                //错误
                Alert.alert(
                    '请检查您的网络111',
                    null,
                    [
                        {text: '确定'}
                    ]
                )
            })
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'模糊查询'} isBack={true} backFunc={() => {
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
                    {this.props.isImage == 1 ? this.screenUI() : []}
                </View>
            </View>
        );
    },

    screenUI(){
        return([
            <View style={{backgroundColor:'rgba(233,234,239,1.0)'}}>
                <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("zhongxin")}}>
                    <Text style = {[styles.selectTitleStayle]}>中心：</Text>
                    <Text style = {[styles.selectTextStayle]}>{this.state.zhongxin == "" ? "未选择" : this.state.zhongxin}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("suiji")}}>
                    <Text style = {[styles.selectTitleStayle]}>{researchParameter.researchParameter.NTrtGrp.split(",").length == 1 ? "入组状态：" :"随机状态："}</Text>
                    <Text style = {[styles.selectTextStayle]}>{this.state.suiji == "" ? "未选择" : this.state.suiji}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("tupian")}}>
                    <Text style = {[styles.selectTitleStayle]}>是否上传图片：</Text>
                    <Text style = {[styles.selectTextStayle]}>{this.state.tupian == "" ? "未选择" : this.state.tupian}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("yonghuID")}}>
                    <Text style = {[styles.selectTitleStayle]}>受试者编号：</Text>
                    <Text style = {[styles.selectTextStayle]}>{this.state.yonghuID == "" ? "未选择" : this.state.yonghuID}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("shuju")}}>
                    <Text style = {[styles.selectTitleStayle]}>页码/模块数据行状态：</Text>
                    <Text style = {[styles.selectTextStayle]}>{this.state.shuju == "" ? "未选择" : this.state.shuju}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={[styles.dengluBtnStyle,{marginTop:20}]} onPress={()=>{this.clickScreenConfirm()}}>
                    <Text style={{color:'white',fontSize: 14}}>
                        确 定
                    </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={[styles.dengluBtnStyle]} onPress={()=>{
                    Pickers.hide();
                    this.setState({
                        isScreen : false,
                        zhongxin:"",
                        suiji:"",
                        tupian:"",
                        bianhao:"",
                        shuju:""
                    })
                    }}>
                    <Text style={{color:'white',fontSize: 14}}>
                        重 置
                    </Text>
                </TouchableOpacity> */}
            </View>
        ])
    },

    //筛选条件
    clickScreen(type){

        var array = [];
        if (type == "zhongxin"){
            for (var i = 0 ; i < Users.Users.length ; i++) {
                if (Users.Users[i].UserSite != null) {
                    if (Users.Users[i].UserSite.indexOf(',') != -1 ) {
                        var sites = Users.Users[i].UserSite.split(",");
                        for (var j = 0 ; j < sites.length ; j++) {
                            array.push(sites[j]) 
                        }
                    }else{
                        array.push(Users.Users[i].UserSite) 
                    }
                }
            }
            //去重
            array = Array.from(new Set(array))
            if (array.length == 0){

                Alert.alert(
                    '提示:',
                    "无中心可选",
                    [
                        {text: '确定'}
                    ]
                )
                return
            }
         }else if (type == "suiji"){
            array = ["筛选中","已随机","筛选失败","已完成或退出"];
            if (researchParameter.researchParameter.NTrtGrp.split(",").length == 1) {
                array = ["筛选中","已入组","筛选失败","已完成或退出"];
            }
        }else if (type == "tupian"){
            array = ["是","否"];
        }else if (type == "yonghuID"){
            if (this.state.USubjIDs.length == 0){
                Alert.alert(
                    '提示:',
                    "没有受试者",
                    [
                        {text: '确定'}
                    ]
                )
                return
            }
            array = this.state.USubjIDs;
        }else if (type == "shuju"){
            array = ["点击上传图片","等待核查","正在核查","质疑处理中","冻结"];
        }

        Pickers.init({
            pickerData: array,
            onPickerConfirm: pickedValue => {
                if (type == "zhongxin"){
                    this.setState({zhongxin:pickedValue[0]})
                 }else if (type == "suiji"){
                    this.setState({suiji:pickedValue[0]})
                }else if (type == "tupian"){
                    this.setState({tupian:pickedValue[0]})
                }else if (type == "yonghuID"){
                    this.setState({yonghuID:pickedValue[0]})
                }else if (type == "shuju"){
                    this.setState({shuju:pickedValue[0]})
                }
            },
            onPickerCancel: pickedValue => {
                
            },
            onPickerSelect: pickedValue => {

            }
        });
        Pickers.show();
    },

    clickScreenConfirm(){
        Pickers.hide();
        this.setState({
            isScreen : false,
        })
        var UserSite = '';
        console.log("身份")
        console.log(Users.Users)
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ||
                    Users.Users[i].UserFun == 'H4' || Users.Users[i].UserFun == 'H1' || Users.Users[i].UserFun == 'M8' || Users.Users[i].UserFun == 'H5'){
                    UserSite = Users.Users[i].UserSite
                }
            }
        }
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ||
                Users.Users[i].UserFun == 'H4' || Users.Users[i].UserFun == 'H1'){
                if (Users.Users[i].UserSiteYN == 1) {
                    UserSite = ''
                }
            }
        }
        if (this.props.isImage == 1){
            for (var i = 0 ; i < Users.Users.length ; i++) {
                var data = Users.Users[i]
                if (data.UserFun == 'S1' || data.UserFun == 'H3' || data.UserFun == 'H2' ||
                    data.UserFun == 'H5' || data.UserFun == 'M7' || data.UserFun == 'M8' ||
                    data.UserFun == 'M4' || data.UserFun == 'M5' || data.UserFun == 'M1' ||
                    data.UserFun == 'C2'){
                    if (Users.Users[i].UserSiteYN == 1) {
                        UserSite = ''
                    }else{
                        UserSite = data.UserSite
                    }
                }
            }
        }
        Toast.loading('查询中...',60);
        NetTool.post(settings.fwqUrl +"/app/getImageVagueBasicsDataUser",{
            str : this.state.shuliang,
            SiteID : UserSite,
            StudyID : Users.Users[0].StudyID,
            zhongxin : this.state.zhongxin,
            suiji : this.state.suiji == "已入组" ? "已随机" : this.state.suiji,
            tupian : this.state.tupian,
            bianhao : this.state.bianhao,
            yonghuID : this.state.yonghuID,
            shuju : this.state.shuju,
        })
        .then((responseJson) => {
            Toast.hide()
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
                    component: Qsjh, // 具体路由的版块
                    //传递参数
                    passProps:{
                        data:responseJson.data,
                        isImage: 1,
                        msg:this.state.shuliang
                    }
                });
            }
        })
        .catch((error)=>{
            Toast.hide()
            //错误
            Alert.alert(
                '请检查您的网络111',
                null,
                [
                    {text: '确定'}
                ]
            )
        })
    },

    //输入账号时
    onZhanghao(text){
        this.setState({shuliang: text});
    },

    //点击确定
    getLogin(){
        if (this.props.isImage == 1){
            this.clickScreenConfirm()
            return
        }
        var UserSite = '';
        console.log("身份")
        console.log(Users.Users)
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ||
                    Users.Users[i].UserFun == 'H4' || Users.Users[i].UserFun == 'H1' || Users.Users[i].UserFun == 'M8' || Users.Users[i].UserFun == 'H5'){
                    UserSite = Users.Users[i].UserSite
                }
            }
        }
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ||
                Users.Users[i].UserFun == 'H4' || Users.Users[i].UserFun == 'H1'){
                if (Users.Users[i].UserSiteYN == 1) {
                    UserSite = ''
                }
            }
        }
        if (this.props.isImage == 1){
            for (var i = 0 ; i < Users.Users.length ; i++) {
                var data = Users.Users[i]
                if (data.UserFun == 'S1' || data.UserFun == 'H3' || data.UserFun == 'H2' ||
                    data.UserFun == 'H5' || data.UserFun == 'M7' || data.UserFun == 'M8' ||
                    data.UserFun == 'M4' || data.UserFun == 'M5' || data.UserFun == 'M1' ||
                    data.UserFun == 'C2'){
                    if (Users.Users[i].UserSiteYN == 1) {
                        UserSite = ''
                    }else{
                        UserSite = data.UserSite
                    }
                }
            }
        }

        this.setState({animating:true});
        //发送网络请求
        fetch(settings.fwqUrl + "/app/getVagueBasicsData", {
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
                console.log(responseJson.data)
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
                    if (this.props.isImage == 1){
                        // 页面的切换
                        this.props.navigator.push({
                            component: Qsjh, // 具体路由的版块
                            //传递参数
                            passProps:{
                                data:responseJson.data,
                                isImage: 1,
                                msg:this.state.shuliang
                            }
                        });
                    }else if (this.props.isVC == 1){
                        // 页面的切换
                        this.props.navigator.push({
                            component: Qsjh, // 具体路由的版块
                            //传递参数
                            passProps:{
                                data:responseJson.data
                            }
                        });
                    }else if (this.props.isVC == 0){
                        // 页面的切换
                        this.props.navigator.push({
                            component: Qsjh, // 具体路由的版块
                            //传递参数
                            passProps:{
                                data:responseJson.data
                            }
                        });
                    }
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
    },
    screenStayle:{
        marginLeft:20,
        height:40,
        marginRight:20,
        borderBottomWidth : 1,
        borderColor : "rgba(0,136,212,1.0)",
        // 设置主轴的方向
        flexDirection:'row',
        alignItems:'center',
    },

    selectTitleStayle:{
        fontSize: 14,
    },

    selectTextStayle:{
        fontSize: 14,
        color: 'gray'
    }
});

// 输出组件类
module.exports = Mhcx;

