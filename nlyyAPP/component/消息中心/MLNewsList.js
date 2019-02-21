import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ScrollView,
    ListView,
    Alert,
    DeviceEventEmitter,
    Modal
} from 'react-native';

import Pickers from 'react-native-picker';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var List = require('../../node_modules/antd-mobile/lib/list/index');
var MLActivityIndicatorView = require('../MLActivityIndicatorView/MLActivityIndicatorView');
const Item = List.Item;
const Brief = Item.Brief;
var Users = require('../../entity/Users');
var researchParameter = require('../../entity/researchParameter');
var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var MLLookNews = require('./查看消息/MLLookNews');
var MLAddNews = require('./发送消息/MLAddNews')
var settings = require("../../settings");
var Popup = require('../../node_modules/antd-mobile/lib/popup/index');

var netTool = require('../../kit/net/netTool'); //网络请求

var Toast = require('../../node_modules/antd-mobile/lib/toast/index');
//时间操作
var moment = require('moment');
moment().format();

var NewsList = React.createClass({
    getInitialState() {
        return {
            animating: true,//是否显示菊花
            //ListView设置
            dataSource: null,
            tableData:[],
            isScreen:false,
            zhongxin:"",
            suiji:"",
            tupian:"",
            bianhao:"",
            shuju:"",
            yonghuID:"",
            yuedu:"",
            biaoji:"",
            yemamokuai:"",
            userData:[],
            USubjIDs:[],
            selectUser : null,
            // 全部中心号
            sites:[]
        }
    },
    getDefaultProps(){
        return {

        }
    },
    componentWillUnmount(){
        this.subscription.remove();
    },
    //更新数据
    updateNews(){
        if (this.state.zhongxin == "" && this.state.yonghuID == "" && this.state.suiji == "" && this.state.yuedu == "" && this.state.biaoji == ""){
            this.httpData()
        }else{
            this.clickScreenConfirm()
        }
    },
    //耗时操作,网络请求
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('updateNews',this.updateNews);
        this.subscription = DeviceEventEmitter.addListener('updateMoKuai',this.updateNews);
        this.httpData()
        this.getUserData()
        //判断用户是否为全部中心权限
        var isUserSiteYN = false
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSiteYN == 1) {
                isUserSiteYN = true
                break
            }
        }
        if (isUserSiteYN == true){
            this.getSite()
        }
    },

    // 获取全部中心
    getSite(){
        netTool.post(settings.fwqUrl +"/app/getSite",{
            StudyID : Users.Users[0].StudyID,
        })
        .then((responseJson) => {
            var siteIDs = []
            for (var i = 0 ; i < responseJson.data.length ; i++) {
                siteIDs.push(responseJson.data[i].SiteID)
            }
            this.setState({
                sites : siteIDs
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
    },

    // 搜索选项用户
    getUserData(){
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
            netTool.post(settings.fwqUrl +"/app/getImageVagueBasicsDataUser",{
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
    },

    httpData(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getNewsList", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                UserMP :  Users.Users[0].UserMP
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
    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={"消息中心"} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} newTitle={"plus-circle"} newFunc={()=>{
                        // 页面的切换
                        this.props.navigator.push({
                            component: MLAddNews,
                        });
                    }} right2Title={"筛选"} right2Func={()=>{
                        this.setState({
                            isScreen : true
                        })
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return(
                <View style={styles.container}>
                    <MLNavigatorBar title={'消息中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} newTitle={"plus-circle"} newFunc={()=>{
                        // 页面的切换
                        this.props.navigator.push({
                            component: MLAddNews,
                        });
                    }} right2Title={"筛选"} right2Func={()=>{
                        this.setState({
                            isScreen : true
                        })
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    {this.screenUI()}
                </View>
            )
        }
    },
    //返回具体的cell
    renderRow(rowData){
        var markTypeStr = ""
        //标记状态,0:未解决,1:已解决,2:不需要解决,3:取消标记
        if (rowData.markType == 0){
            markTypeStr = "未解决"
        }else if (rowData.markType == 1){
            markTypeStr = "已解决"
        }else if (rowData.markType == 2){
            markTypeStr = "不需要解决"
        }else if (rowData.markType == 3){
            markTypeStr = ""
        }
        return(
            <TouchableOpacity 
            onLongPress={()=>{
                //错误
                this.cellOnLongPress(rowData)
            }}
            onPress={()=> {

                // 页面的切换
                this.props.navigator.push({
                    component: MLLookNews, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                    //传递参数
                    passProps: {
                        //出生年月
                        data: rowData
                    }
                });
            }}>
                <View style={{
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                    backgroundColor:'white',
                    width:width
                }}>
                    <View style={{
                        flexDirection:'row',
                        width:width,
                        height:32,
                        justifyContent:'space-between'
                    }}>
                    <Text style={{
                        left:15,
                        top:6
                    }}>{rowData.CRFModeule != null ? ((typeof(rowData.CRFModeule.Subjects.persons.USubjID) == "undefined" ? rowData.CRFModeule.Subjects.persons.USubjectID : rowData.CRFModeule.Subjects.persons.USubjID) + "_" + rowData.CRFModeule.CRFModeulesName + (rowData.CRFModeule.CRFModeulesNum + 1)) : rowData.addUsers.UserNam + '发送的消息'}</Text>
                        <Text style={{
                            right:15,
                            top:6,
                            color:rowData.voiceType == 0 ? 'red' : 'gray'
                        }}>{rowData.voiceType == 0 ? '未读' : '已读'}</Text>
                    </View>
                    <View style={{
                        flexDirection:'row',
                        width:width,
                        height:22,
                        justifyContent:'space-between'
                    }}>
                        <Text style={{
                            left:15,
                        }}>{moment(rowData.Date).format("YYYY/MM/DD H:mm:ss")}</Text>
                        <Text style={{
                            right:15,
                            // color:rowData.voiceType == 0 ? 'red' : 'gray'
                        }}>{markTypeStr}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    },

    // 长按回调
    cellOnLongPress(rowData){
        var array = ["请选择你想做的","已解决","不需要解决","取消标记","取消"];
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
                                       
                                       var url = "/app/getMarkType"
                                       Toast.loading('请稍候...',60);
                                    netTool.post(settings.fwqUrl + url,{messageIDNum : rowData.messageIDNum , markType : index})
                                    .then((responseJson) => {
                                        Toast.hide()
                                        this.updateNews()
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ],
                                            {cancelable : false}
                                        )
                                    })
                                    .catch((error)=>{
                                        Toast.hide()
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            '请检查您的网络111',
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                    })
                                    Popup.hide();
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
                                }}>{i}</Text>
                            </View>
                        </List.Item>
                    ))}
                </List>
            </View>,
            {maskClosable: true,animationType: 'slide-up' }
        )
    },

    screenUI(){
        return([
            <Modal visible={this.state.isScreen} transparent={true}>
                <View style={[styles.container,{justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.5)'}]}>
                    <View style={{backgroundColor:'white'}}>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("zhongxin")}}>
                            <Text style = {[styles.selectTitleStayle]}>中心：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.zhongxin == "" ? "未选择" : this.state.zhongxin}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("yonghuID")}}>
                            <Text style = {[styles.selectTitleStayle]}>受试者编号：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.yonghuID == "" ? "未选择" : this.state.yonghuID}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("shuju")}}>
                            <Text style = {[styles.selectTitleStayle]}>页码/模块数据行状态：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.shuju == "" ? "未选择" : this.state.shuju}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("yuedu")}}>
                            <Text style = {[styles.selectTitleStayle]}>已读/未读：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.yuedu == "" ? "未选择" : this.state.yuedu}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("biaoji")}}>
                            <Text style = {[styles.selectTitleStayle]}>解决的标记状态：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.biaoji == "" ? "未选择" : this.state.biaoji}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dengluBtnStyle,{marginTop:20}]} onPress={()=>{this.clickScreenConfirm()}}>
                            <Text style={{color:'white',fontSize: 14}}>
                                确 定
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dengluBtnStyle]} onPress={()=>{
                            Pickers.hide();
                            this.setState({
                                isScreen : false,
                                zhongxin:"",
                                suiji:"",
                                tupian:"",
                                bianhao:"",
                                shuju:"",
                                yonghuID:"",
                                biaoji:"",
                                yuedu:""
                            })
                            }}>
                            <Text style={{color:'white',fontSize: 14}}>
                                取 消
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        ])
    },
//筛选条件
    clickScreen(type){

        var array = [];
        if (type == "zhongxin"){
            if (this.state.sites.length != 0){
                array = this.state.sites
            }else{
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
            }
            //去重
            array = Array.from(new Set(array))
            if (array.length == 0){
                Alert.alert(
                    '提示:',
                    '无中心可选',
                    [
                        {text: '确定'}
                    ]
                )
                return
            }
         }else if (type == "suiji"){
            array = ["筛选中","已随机","筛选失败","已完成或退出"];
        }else if (type == "tupian"){
            array = ["是","否"];
        }else if (type == "yonghuID"){
            if (this.state.USubjIDs.length == 0){
                Alert.alert(
                    '提示:',
                    '没有受试者',
                    [
                        {text: '确定'}
                    ]
                )
                return
            }
            array = this.state.USubjIDs;
        }else if (type == "shuju"){
            array = ["点击上传图片","等待核查","正在核查","质疑处理中","冻结"];
        }else if (type == "yuedu"){
            array = ["已读","未读"];
        }else if (type == "biaoji"){
            array = ["未解决","已解决","不需要解决"];
        }else if (type == "yemamokuai") {
            array = ["页码","模块"];
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
                }else if (type == "yuedu"){
                    this.setState({yuedu:pickedValue[0]})
                }else if (type == "biaoji"){
                    this.setState({biaoji:pickedValue[0]})
                }
            },
            onPickerCancel: pickedValue => {
                if (type == "zhongxin"){
                    this.setState({zhongxin:""})
                 }else if (type == "suiji"){
                    this.setState({suiji:""})
                }else if (type == "tupian"){
                    this.setState({tupian:""})
                }else if (type == "yonghuID"){
                    this.setState({yonghuID:""})
                }else if (type == "shuju"){
                    this.setState({shuju:""})
                }else if (type == "yuedu"){
                    this.setState({yuedu:""})
                }else if (type == "biaoji"){
                    this.setState({biaoji:""})
                }
            },
            onPickerSelect: pickedValue => {

            }
        });
        Pickers.show();
    },

    clickScreenConfirm(){
        if (this.state.zhongxin == "" && this.state.shuju == "" && this.state.yonghuID == "" && this.state.suiji == "" && this.state.yuedu == "" && this.state.biaoji == ""){
            this.httpData()
            Pickers.hide();
            this.setState({
                isScreen : false,
            })
            return
        }
        Pickers.hide();
        this.setState({
            isScreen : false,
        })
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
        Toast.loading('查询中...',60);
        netTool.post(settings.fwqUrl +"/app/getImageVagueBasicsDataUser",{
            str : "",
            SiteID : UserSite,
            StudyID : Users.Users[0].StudyID,
            zhongxin : this.state.zhongxin,
            suiji : this.state.suiji,
            tupian : this.state.tupian,
            yonghuID : this.state.yonghuID,
            shuju : this.state.shuju,
        })
        .then((responseJson) => {
            this.getUserNewsList(responseJson)
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

    //获取消息数据
    getUserNewsList(data){
        netTool.post(settings.fwqUrl +"/app/getUserNewsList",{
            StudyID : Users.Users[0].StudyID,
                UserMP :  Users.Users[0].UserMP,
                users : data.data,
                yuedu: this.state.yuedu,
                biaoji : this.state.biaoji
        })
        .then((responseJson) => {
            Toast.hide()
            //ListView设置
            var tableData = responseJson.data;
            this.state.tableData = tableData;
            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
            this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
            //移除等待
            this.setState({animating:false});
        })
        .catch((error)=>{
            Toast.hide()
            //错误
            Alert.alert(
                '请检查您的网络222',
                null,
                [
                    {text: '确定'}
                ]
            )
        })
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },


    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginBottom:20,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
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
module.exports = NewsList;