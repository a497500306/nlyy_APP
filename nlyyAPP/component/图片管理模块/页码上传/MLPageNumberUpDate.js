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
    ListView,
    TouchableOpacity,
    Alert,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';
Conf.ACCESS_KEY = 'sA4znnDk3uTrcUyBrFMgJZqVs3eaDr95-JuybSGW';
Conf.SECRET_KEY = 'kRAUifvGnG94pF-UxA1iBFvAOSFqTKA5O4yIE8bv';
var uuid = require('uuid');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var MLQuestion = require('../质疑/MLQuestion');
import ActionSheet from 'react-native-actionsheet';
var Users = require('../../../entity/Users');
var settings = require('../../../settings');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var ImagePicker = require('react-native-image-picker');
import MLPhotoView from '../../MLPhotoView/MLPhotoView';
var researchParameter = require('../../../entity/researchParameter')

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import ImagePicker1 from 'react-native-image-crop-picker';


var buttons = ['取消', '拍照', '相册中选择'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
var friendId = 0;
var seveRowData = {};
var options = {
    title: 'Select Avatar',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    mediaType:'photo',
    quality:0.4
};
var MLPageNumberUpDate = React.createClass({
    show() {
        this.timer = setTimeout(
            () => { this.ActionSheet.show(); },
            500
        );
        return;
    },
    _handlePress(index) {
    },
    componentWillUnmount(){
        this.subscription.remove();
    },
    //接收通知更新数据
    updateMoKuai(){
        //移除等待
        this.setState({animating:true});
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getImagePageNumberList", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                Subjects : this.props.data,
                CRFModeulesName : '页码',
                Users : Users.Users[0]
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{
                    //ListView设置
                    var tableData = responseJson.data;
                    this.state.tableData = tableData;
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //移除等待
                    this.setState({animating:false});
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '提示:',
                    '请检查您的网络',
                    [
                        {text: '确定'}
                    ]
                )

            });
    },
    //耗时操作,网络请求
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('updateMoKuai',this.updateMoKuai);
        fetch(settings.fwqUrl + "/app/getImagePageNumberList", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                Subjects : this.props.data,
                CRFModeulesName : '页码',
                Users : Users.Users[0]
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{
                    //ListView设置
                    var tableData = responseJson.data;
                    this.state.tableData = tableData;
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //移除等待
                    this.setState({animating:false});
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '提示:',
                    '请检查您的网络',
                    [
                        {text: '确定'}
                    ]
                )

            });
    },
    getDefaultProps(){
        return {
            data:null
        }
    },
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[],
            modelData:null,//点击的模块
        }
    },
    render() {
        //判断是否显示加号
        var isShowJ = false;
        for (var i = 0 ; i < Users.Users.length ;i++){
            var user = Users.Users[i];
            if (user.UserFun == "S1" || user.UserFun == "H3" ||  user.UserFun == "H2" ||
                user.UserFun == "H5"){
                isShowJ = true;
            }
        }
        if (this.state.animating == true) {
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={this.props.data.USubjID + '按页码上传'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>
            )
        }else if (isShowJ == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={this.props.data.USubjID + '按页码上传'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}  leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择您的操作？"
                        options={buttons}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={(sss)=>{
                            this._handlePress(this)
                            this.upImage(sss,this)
                        }}
                    />
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={this.props.data.USubjID + "页码"} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择您的操作？"
                        options={buttons}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={(sss)=>{
                            this._handlePress(this)
                            this.upImage(sss,this)
                        }}
                    />
                </View>

            );
        }
    },
    //返回具体的cell
    renderRow(rowData, sectionID, rowID){
        //"imageType" : Number,0:没有上传图片,1:等待审核,2:正在审核,3:审核通过,4:冻结,5:作废
        var rightTitle = '';
        var TitleColor = ''
        if (rowData.imageType == 0){
            rightTitle = '点击上传图片';
            TitleColor = 'red';
        }else if (rowData.imageType == 1){
            rightTitle = '等待核查(' + rowData.imageUrls.length + ')';
            TitleColor = 'gray';
        }else if (rowData.imageType == 2){
            rightTitle = '正在核查(' + rowData.imageUrls.length + ')';
            TitleColor = 'gray';
        }else if (rowData.imageType == 3){
            rightTitle = '冻结(' + rowData.imageUrls.length + ')';
            TitleColor = 'black';
        }else if (rowData.imageType == 6){
            rightTitle = '质疑处理中';
            TitleColor = 'black';
        }else if (rowData.imageType == 4){
            return (<View/>)
        }else if (rowData.imageType == 5){
            return (<View/>)
        }
        return (
            <TouchableOpacity onPress={()=> {
                this.setState({
                    modelData:rowData
                })


                var isYijinShenhe = false;
                var shenheStr = "核查无误";
                var isShenhe = false;
                for (var i = 0 ; i < Users.Users.length ;i++){
                    if (
                        Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" ||
                        Users.Users[i].UserFun == "H2" || Users.Users[i].UserFun == "H5" ||
                        Users.Users[i].UserFun == "M1" || Users.Users[i].UserFun == "M8" ||
                        Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5" ||
                        Users.Users[i].UserFun == "M7"

                    ){
                        isShenhe = true
                    }
                }
                for (var j = 0 ; j < rowData.ReviewPhones.length ; j++){
                    if (Users.Users[0].UserMP == rowData.ReviewPhones[j]){
                        isYijinShenhe = true;
                        shenheStr = '撤销核查'
                    }
                }
                var gongneng = {
                    "查看图片" : {text: '查看图片', onPress: () => {
                        var images = [];
                        if (rowData.imageUrls.length == 0){
                            Alert.alert(
                                '提示:',
                                '未上传图片',
                                [
                                    {text: '确定'}
                                ]
                            )
                            return;
                        }
                        for (var i= 0 ; i < rowData.imageUrls.length ; i++){
                            var json = {
                                url : rowData.imageUrls[i]
                            }
                            images.push(json)
                        }
                        var isDelete = false;
                        for (var mm = 0 ; mm < Users.Users.length ; mm++){
                            if (Users.Users[mm].UserFun == "H2" || Users.Users[mm].UserFun == "H3" ||
                                Users.Users[mm].UserFun == "H5" || Users.Users[mm].UserFun == "S1"
                            ) {
                                isDelete = true;
                            }
                        }
                        //图片状态,0:没有上传图片,1:等待审核,2:正在审核,3:审核通过,4:冻结,5:作废,6:质疑中
                        if (rowData.imageType == 2 || rowData.imageType == 3 || rowData.imageType == 4){
                            isDelete = false;
                        }
                        // 页面的切换
                        this.props.navigator.push({
                            component: MLPhotoView, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                            //传递参数
                            passProps: {
                                //出生年月
                                images: images,
                                isDelete:isDelete,
                                data:rowData
                            }
                        });
                    }},
                    "查看被质疑的图片" : {text: '查看被质疑的图片', onPress: () => {
                        if (rowData.questionImageUrls.length == 0){
                            Alert.alert(
                                '提示:',
                                '未上传图片',
                                [
                                    {text: '确定'}
                                ]
                            )
                            return;
                        }
                        var images = [];
                        for (var i= 0 ; i < rowData.questionImageUrls.length ; i++){
                            var json = {
                                url : rowData.questionImageUrls[i]
                            }
                            images.push(json)
                        }
                        // 页面的切换
                        this.props.navigator.push({
                            component: MLPhotoView, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                            //传递参数
                            passProps: {
                                //出生年月
                                images: images
                            }
                        });
                    }},
                    "撤销质疑" : {text: '撤销质疑', onPress:()=>{
                        if (this.state.modelData.questionImageUrls.length == 0){
                            Alert.alert(
                                '提示:',
                                '没有任何上传内容，不能撤销质疑',
                                [
                                    {text: '确定'}
                                ]
                            )
                        }else{
                            Toast.loading('请稍后...',60);
                            fetch(settings.fwqUrl + "/app/getRevokedAddQuestion", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id : this.state.modelData.id,
                                    StudyID : Users.Users[0].StudyID
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    if (responseJson.isSucceed == 400) {
                                        Toast.success('添加成功...', 1);
                                        this.updateMoKuai()
                                    }else{
                                        Toast.fail(responseJson.msg,1);
                                    }
                                })
                                .catch((error) => {//错误
                                    Toast.fail('网络连接失败...',1);
                                });
                        }
                    }},
                    "质疑":{text: '质疑', onPress: () => {
                        if (this.state.modelData.imageUrls.length == 0){
                            Alert.alert(
                                '提示:',
                                '没有任何上传内容，不能质疑',
                                [
                                    {text: '确定'}
                                ]
                            )
                        }else {
                            // 页面的切换
                            this.props.navigator.push({
                                component: MLQuestion, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                                //传递参数
                                passProps: {
                                    //出生年月
                                    data: this.state.modelData
                                }
                            });
                        }
                    }},
                    "继续上传" : {text: '继续上传', onPress: () => {
                        this.show(this)
                    }},
                    "重新上传" : {text: '重新上传', onPress: () => {
                        this.show(this)
                    }},
                    "重新提交核查" : {text: '重新提交核查', onPress: () => {
                        Toast.loading('请稍后...',60);
                        fetch(settings.fwqUrl + "/app/getQuestionRevoked", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id : this.state.modelData.id,
                                StudyID : Users.Users[0].StudyID,
                                Subjects : this.props.data,
                                CRFModeulesName : this.props.name
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                if (responseJson.isSucceed == 400) {
                                    Toast.success('添加成功...', 1);
                                    var tableData = responseJson.data;
                                    this.state.tableData = tableData;
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                                }else{
                                    Toast.fail(responseJson.msg,1);
                                }
                            })
                            .catch((error) => {//错误
                                Toast.fail('网络连接失败...',1);
                            });
                    }},
                    "shenheStr" : {text: shenheStr, onPress: () => {
                        if (this.state.modelData.imageUrls.length == 0){
                            Alert.alert(
                                '提示:',
                                '没有任何上传内容，不能核查',
                                [
                                    {text: '确定'}
                                ]
                            )
                            return;
                        }
                        if (isYijinShenhe == false){
                            Toast.loading('请稍后...',60);
                            //审核无误
                            //发送登录网络请求
                            fetch(settings.fwqUrl + "/app/getReviewCorrect", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    StudyID : Users.Users[0].StudyID,
                                    Subjects : this.props.data,
                                    CRFModeulesName : "页码",
                                    id : rowData.id,
                                    ReviewPhones:Users.Users[0].UserMP
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    console.log(responseJson);
                                    if (responseJson.isSucceed != 400){
                                        Toast.hide()
                                        //移除等待
                                        this.setState({animating:false});
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                    }else{
                                        Toast.success('核查成功...',1);
                                        //ListView设置
                                        var tableData = responseJson.data;
                                        this.state.tableData = tableData;
                                        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                        this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                                        //移除等待
                                        this.setState({animating:false});
                                    }
                                })
                                .catch((error) => {//错误
                                    Toast.hide()
                                    //移除等待,弹出错误
                                    this.setState({animating:false});
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        '请检查您的网络',
                                        [
                                            {text: '确定'}
                                        ]
                                    )

                                });
                        }else{
                            //撤销审核无误
                            //审核无误
                            //发送登录网络请求Toast.hide()
                            Toast.loading('请稍后...',60);
                            fetch(settings.fwqUrl + "/app/getRevokedReviewCorrect", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    StudyID : Users.Users[0].StudyID,
                                    Subjects : this.props.data,
                                    CRFModeulesName : "页码",
                                    id : rowData.id,
                                    ReviewPhones:Users.Users[0].UserMP
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    console.log(responseJson);
                                    if (responseJson.isSucceed != 400){
                                        Toast.hide()
                                        //移除等待
                                        this.setState({animating:false});
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                    }else{
                                        Toast.success('撤销成功...',1);
                                        //ListView设置
                                        var tableData = responseJson.data;
                                        this.state.tableData = tableData;
                                        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                        this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                                        //移除等待
                                        this.setState({animating:false});
                                    }
                                })
                                .catch((error) => {//错误
                                    Toast.hide()
                                    //移除等待,弹出错误
                                    this.setState({animating:false});
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
                    }},
                }

                if (rowData.imageType == 0){
                    var isShow = false;
                    for (var i = 0 ; i < Users.Users.length ; i++){
                        if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                            Users.Users[i].UserFun == "H5"){
                            isShow = true;
                        }
                    }
                    if (isShow == true){
                        this.show(this)
                    }
                }else if (rowData.imageType == 1){
                    var isShenhe = false;
                    var isYijinShenhe = false;
                    var shenheStr = "核查无误";
                    var isShow = false;
                    for (var i = 0 ; i < Users.Users.length ;i++){
                        if (
                            Users.Users[i].UserFun == "M8" || Users.Users[i].UserFun == "M4" ||
                            Users.Users[i].UserFun == "M7"
                        ){
                            isShenhe = true
                        }
                        if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                            Users.Users[i].UserFun == "H5"){
                            isShow = true;
                        }
                    }
                    for (var j = 0 ; j < rowData.ReviewPhones.length ; j++){
                        if (Users.Users[0].UserMP == rowData.ReviewPhones[j]){
                            isYijinShenhe = true;
                            shenheStr = '撤销核查'
                        }
                    }
                    if (isShenhe == true){
                        var alerts = [
                            gongneng.查看图片,
                            gongneng.shenheStr,
                            {text: '取消'}
                        ]
                        if (isShow == true){
                            alerts.splice(0, 0, gongneng.继续上传)
                        }
                        //判断是否显示质疑
                        var isShowzhiyi = false;
                        for (var i = 0 ; i < Users.Users.length ; i++){
                            if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                                Users.Users[i].UserFun == "M5" || Users.Users[i].UserFun == "M4"){
                                isShowzhiyi = true;
                            }
                        }
                        if (isShowzhiyi == true){
                            alerts.splice(0, 0, gongneng.质疑);
                        }
                        //错误
                        // Alert.alert(
                        //     "提示:",
                        //     "选择功能",
                        //     alerts
                        // )

                        this.ssssxxx(alerts,rowData)
                    }else{
                        var alerts = [
                            gongneng.查看图片,
                            {text: '取消'}
                        ]
                        if (isShow == true){
                            alerts.splice(0, 0, gongneng.继续上传)
                        }
                        //判断是否显示质疑
                        var isShowzhiyi = false;
                        for (var i = 0 ; i < Users.Users.length ; i++){
                            if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                                Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                                isShowzhiyi = true;
                            }
                        }
                        if (isShowzhiyi == true){
                            alerts.splice(0, 0, gongneng.质疑);
                        }
                        //错误
                        // Alert.alert(
                        //     "提示:",
                        //     "选择功能",
                        //     alerts
                        // )

                        this.ssssxxx(alerts,rowData)
                    }
                }else if (rowData.imageType == 2){//直接查看图片
                    console.log('点击正在核查')
                    console.log(rowData.ReviewPhones)
                    var isShenhe = false;
                    var isYijinShenhe = false;
                    var shenheStr = "核查无误";
                    for (var i = 0 ; i < Users.Users.length ;i++){
                        if (Users.Users[i].UserFun == "M8" || Users.Users[i].UserFun == "M4" ||
                            Users.Users[i].UserFun == "M7"){
                            isShenhe = true
                        }
                    }
                    for (var j = 0 ; j < rowData.ReviewPhones.length ; j++){
                        if (Users.Users[0].UserMP == rowData.ReviewPhones[j]){
                            isYijinShenhe = true;
                            shenheStr = '撤销核查'
                        }
                    }
                    var alerts = [
                        gongneng.查看图片,
                        gongneng.shenheStr,
                        {text: '取消'}
                    ]
                    //判断是否显示质疑
                    var isShowzhiyi = false;
                    for (var i = 0 ; i < Users.Users.length ; i++){
                        if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                            Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                            isShowzhiyi = true;
                        }
                    }
                    if (isShowzhiyi == true){
                        alerts.splice(0, 0, gongneng.质疑);
                    }
                    if (isShenhe == true){
                        //错误
                        this.ssssxxx(alerts,rowData)
                    }else{
                        var alerts = [
                            gongneng.查看图片,
                            {text: '取消'}
                        ]
                        //判断是否显示质疑
                        var isShowzhiyi = false;
                        for (var i = 0 ; i < Users.Users.length ; i++){
                            if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                                Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                                isShowzhiyi = true;
                            }
                        }
                        if (isShowzhiyi == true){
                            alerts.splice(0, 0, gongneng.质疑);
                        }
                        //错误
                        this.ssssxxx(alerts,rowData)
                    }
                }else if (rowData.imageType == 3){//直接查看图片
                    var isShenhe = false;
                    var isShow = false;
                    var isYijinShenhe = false;
                    var shenheStr = '';
                    var alerts = [
                        gongneng.查看图片,
                        {text: '取消'}
                    ]
                    for (var i = 0 ; i < Users.Users.length ;i++){
                        if (
                            Users.Users[i].UserFun == "M8" || Users.Users[i].UserFun == "M4" ||
                            Users.Users[i].UserFun == "M7"
                        ){
                            isShenhe = true
                        }
                        if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                            Users.Users[i].UserFun == "H5"){
                            isShow = true;
                        }
                    }
                    for (var j = 0 ; j < rowData.ReviewPhones.length ; j++){
                        if (Users.Users[0].UserMP == rowData.ReviewPhones[j]){
                            isYijinShenhe = true;
                            shenheStr = '撤销核查'
                            alerts.splice(0, 0, gongneng.shenheStr)
                        }
                    }
                    //判断是否显示质疑
                    var isShowzhiyi = false;
                    for (var i = 0 ; i < Users.Users.length ; i++){
                        if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                            Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                            isShowzhiyi = true;
                        }
                    }
                    if (isShowzhiyi == true){
                        alerts.splice(0, 0, gongneng.质疑);
                    }
                    this.ssssxxx(alerts,rowData)
                }else if (rowData.imageType == 6){
                    var alerts = [
                        gongneng.查看图片,
                        // gongneng.查看被质疑的图片,
                        {text: '取消'}
                    ]
                    var isShow = false;
                    for (var i = 0 ; i < Users.Users.length ;i++){
                        if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                            Users.Users[i].UserFun == "H5"){
                            isShow = true;
                        }
                    }
                    if (isShow == true){
                        // alerts.splice(0, 0, gongneng.重新提交核查);
                        alerts.splice(0, 0, gongneng.继续上传)
                    }
                    var sssxxx = false
                    for (var i = 0 ; i < Users.Users.length ; i++){
                        if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                            Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                            sssxxx = true;
                        }
                    }
                    if (sssxxx == true){
                        alerts.splice(0, 0, gongneng.撤销质疑);
                    }
                    this.ssssxxx(alerts,rowData)
                }
            }}>
                <MLTableCell title={rowData.CRFModeulesName + (rowData.CRFModeulesNum+1)} rightTitle={rightTitle} rightTitleColor = {TitleColor}/>
            </TouchableOpacity>
        )
    },
    //图片上传
    upImage(sss,self){
        this._handlePress(this)
        if (sss == 1){//点击修改备注
            console.log('点击相机');
            if (Platform.OS != 'ios'){
                console.log('点击安卓相册');
                ImagePicker1.openCamera({
                    cropping: false,
                    multiple: false,
                }).then(image => {
                    console.log('received image', image);
                    Toast.loading('请稍后...',60);
                    /******************/
                    //要上传的空间
                    var keyStr = uuid.v4() + '.png';
                    var putPolicy = new Auth.PutPolicy2(
                        {scope: "nlyy-app:" + keyStr}
                    );
                    var uptoken = putPolicy.token();
                    let formData = new FormData();
                    let file = {uri: image.path, type: 'multipart/form-data', name: keyStr};
                    formData.append('key',keyStr);
                    formData.append('token',uptoken);
                    formData.append("file", file);
                    fetch(Conf.UP_HOST, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id : self.state.modelData.id,
                                    imageUrl: 'http://oxpati5fy.bkt.clouddn.com/' + responseJson.key,
                                    StudyID : Users.Users[0].StudyID,
                                    Subjects : this.props.data,
                                    CRFModeulesName : "页码",
                                    uploadUserPhone:Users.Users[0].UserMP,
                                    uploadName:this.state.modelData.CRFModeulesName + (this.state.modelData.CRFModeulesNum + 1),
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    Toast.success('添加成功...',1);
                                    var tableData = responseJson.data;
                                    self.state.tableData = tableData;
                                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                    self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                                })
                                .catch((error) => {//错误
                                    Toast.fail('网络连接失败...',1);
                                });
                        })
                        .catch((error) => {
                            Toast.fail('网络连接失败...',1);
                        });
                })
            }else {
                //启动相机：
                options.quality = 0.5;
                ImagePicker.launchCamera(options, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    }
                    else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    }
                    else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    }
                    else {
                        Toast.loading('请稍后...', 60);
                        let source = {uri: response.uri};
                        console.log('相册 = ', source);

                        // You can also display the image using data:
                        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                        this.setState({
                            avatarSource: source
                        });

                        /******************/
                        //要上传的空间
                        var keyStr = uuid.v4() + '.png';
                        var putPolicy = new Auth.PutPolicy2(
                            {scope: "nlyy-app:" + keyStr}
                        );
                        var uptoken = putPolicy.token();
                        let formData = new FormData();
                        let file = {uri: source.uri, type: 'multipart/form-data', name: keyStr};
                        formData.append('key',keyStr);
                        formData.append('token',uptoken);
                        formData.append("file", file);
                        fetch(Conf.UP_HOST, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json; charset=utf-8',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        id: self.state.modelData.id,
                                        imageUrl: 'http://oxpati5fy.bkt.clouddn.com/' + responseJson.key,
                                        StudyID: Users.Users[0].StudyID,
                                        Subjects: this.props.data,
                                        CRFModeulesName: "页码",
                                        uploadUserPhone:Users.Users[0].UserMP,
                                        uploadName:this.state.modelData.CRFModeulesName + (this.state.modelData.CRFModeulesNum + 1),
                                    })
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        Toast.success('添加成功...', 1);
                                        var tableData = responseJson.data;
                                        self.state.tableData = tableData;
                                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                        self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                                    })
                                    .catch((error) => {//错误
                                        Toast.fail('网络连接失败...', 1);
                                    });
                            })
                    }
                });
            }
        }else if (sss == 2){//点击查看资料
            if (Platform.OS != 'ios'){
                ImagePicker1.openPicker({
                    cropping: false,
                    multiple: false,
                }).then(image => {
                    Toast.loading('请稍后...',60);
                    /******************/
                    //要上传的空间
                    var keyStr = uuid.v4() + '.png';
                    var putPolicy = new Auth.PutPolicy2(
                        {scope: "nlyy-app:" + keyStr}
                    );
                    var uptoken = putPolicy.token();
                    let formData = new FormData();
                    let file = {uri: image.path, type: 'multipart/form-data', name: keyStr};
                    formData.append('key',keyStr);
                    formData.append('token',uptoken);
                    formData.append("file", file);
                    fetch(Conf.UP_HOST, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id: self.state.modelData.id,
                                    imageUrl: 'http://oxpati5fy.bkt.clouddn.com/' + responseJson.key,
                                    StudyID: Users.Users[0].StudyID,
                                    Subjects: this.props.data,
                                    CRFModeulesName: "页码",
                                    uploadUserPhone:Users.Users[0].UserMP,
                                    uploadName:this.state.modelData.CRFModeulesName + (this.state.modelData.CRFModeulesNum + 1),
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    Toast.success('添加成功...', 1);
                                    var tableData = responseJson.data;
                                    self.state.tableData = tableData;
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                                })
                                .catch((error) => {//错误
                                    Toast.fail('网络连接失败...', 1);
                                });
                        })
                        .catch((error) => {
                            Toast.fail('网络连接失败...',1);
                        });
                });
            }else {
                console.log('点击相册');
                // Open Image Library:
                options.quality = 0.5;
                ImagePicker.launchImageLibrary(options, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    }
                    else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    }
                    else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    }
                    else {
                        Toast.loading('请稍后...', 60);
                        let source = {uri: response.uri};
                        console.log('相册 = ', source);

                        // You can also display the image using data:
                        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                        this.setState({
                            avatarSource: source
                        });


                        //要上传的空间
                        var keyStr = uuid.v4() + '.png';
                        var putPolicy = new Auth.PutPolicy2(
                            {scope: "nlyy-app:" + keyStr}
                        );
                        var uptoken = putPolicy.token();
                        let formData = new FormData();
                        let file = {uri: source.uri, type: 'multipart/form-data', name: keyStr};
                        formData.append('key',keyStr);
                        formData.append('token',uptoken);
                        formData.append("file", file);
                        fetch(Conf.UP_HOST, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json; charset=utf-8',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        id: self.state.modelData.id,
                                        imageUrl: 'http://oxpati5fy.bkt.clouddn.com/' + responseJson.key,
                                        StudyID: Users.Users[0].StudyID,
                                        Subjects: this.props.data,
                                        CRFModeulesName: "页码",
                                        uploadUserPhone:Users.Users[0].UserMP,
                                        uploadName:this.state.modelData.CRFModeulesName + (this.state.modelData.CRFModeulesNum + 1),
                                    })
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        Toast.success('添加成功...', 1);
                                        var tableData = responseJson.data;
                                        self.state.tableData = tableData;
                                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                        self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                                    })
                                    .catch((error) => {//错误
                                        Toast.fail('网络连接失败...', 1);
                                    });
                            })
                            .catch((error) => {
                                console.log(error)
                                Toast.fail('网络连接失败', 1);
                            });
                    }
                });
            }
        }
    },
    ssssxxx(array,rowData){
        array.splice(0, 0, {text:'请选择功能'});
        Popup.show(
            <View>
                <List renderHeader={this.renderHeader}
                      className="popup-list"
                >
                    {array.map((i, index) => (
                        <List.Item key={index}
                                   style = {{
                                       textAlign:'center'
                                   }}
                                   onClick={()=>{
                                       if (index == array.length - 1 || index == 0){
                                           Popup.hide();
                                           return;
                                       }
                                       Popup.hide();

                                       Toast.loading('请稍后...', 0.5);
                                       this.timer = setTimeout(
                                           () => {
                                               i.onPress(); },
                                           500
                                       );
                                   }}
                        >
                            <View style={{
                                width:width - 30,
                                alignItems:'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{
                                    fontSize:index == 0 ? 12 : 16,
                                    color:(index == array.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                }}>{i.text}</Text>
                            </View>
                        </List.Item>
                    ))}
                </List>
            </View>,
            {maskClosable: true,animationType: 'slide-up' }
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLPageNumberUpDate;
