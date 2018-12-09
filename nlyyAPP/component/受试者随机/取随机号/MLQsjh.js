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
    ListView,
    DeviceEventEmitter,
    Modal
} from 'react-native';

import Pickers from 'react-native-picker';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var yytx = require('../用药提醒/MLYytx');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLUpdateUser = require('../修改资料/MLUpdateUser');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter');
var ImageList = require('../../图片管理模块/入口/MLImagesList');
var Xzsxcgssz = require('../新增筛选成功受试者/MLXzsxcgssz');
var Xzsxssssz = require('../新增筛选失败受试者/MLXzsxsbssz');
var Djssz = require('../登记受试者/MLDjssz');
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var NewIcon = require('../../../node_modules/antd-mobile/lib/icon/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var NetTool = require('../../../kit/net/netTool');

var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
// var Mhcx = require('../模糊查询/MLMhcx')
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
// import { Modal } from 'antd-mobile';

const buttons = ['取消', '添加筛选成功受试者','添加筛选失败受试者','登记受试者'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 8;
var friendId = 0;
var seveRowData = {};

var moment = require('moment');
moment().format();

var Qsjh = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },
    getDefaultProps(){
        return {
            data:null,
            isImage:0,
            msg:"",//搜索关键字
        }
    },
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[],
            isScreen:false,
            zhongxin:"",
            suiji:"",
            tupian:"",
            bianhao:"",
            shuju:""
        }
    },
    componentWillUnmount(){
        this.subscription.remove();
    },
    //耗时操作,网络请求
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('updateUserSuccess',this.updateUserSuccess);
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }

        if (this.props.data == null) {
            this.setState({
                DrugId : this.props.DrugId,
                UsedAddressId : this.props.UsedAddressId,
            })
            //发送登录网络请求
            fetch(settings.fwqUrl + "/app/getLookupSuccessBasicsData", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SiteID : UserSite,
                    StudyID : Users.Users[0].StudyID
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
        }else {
            //ListView设置
            var tableData = this.props.data;
            this.state.tableData = tableData;
            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
            this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
            //移除等待
            this.setState({animating:false});
        }
    },

    //更新数据
    updateUserSuccess(){
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        //移除等待
        this.setState({animating:true});
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getLookupSuccessBasicsData", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                SiteID : UserSite,
                StudyID : Users.Users[0].StudyID
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
                    <MLNavigatorBar title={'受试者列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}  leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if (this.props.data == null){
            return (
                <View style={styles.container}>
                    {/*<MLNavigatorBar title={'受试者随机'} newTitle = {"plus-circle"} isBack={true} backFunc={() => {*/}
                        {/*this.props.navigator.pop()*/}
                    {/*}} newFunc={() => {*/}
                        {/*this.show(this)*/}
                    {/*}}/>*/}
                    <MLNavigatorBar title={'受试者列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} newTitle={"plus-circle"} newFunc={()=>{
                        this.show()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
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
                            if (sss == 1){//筛选成功
                                console.log(sss)
                                // 页面的切换
                                this.props.navigator.push({
                                    component: Xzsxcgssz, // 具体路由的版块
                                });
                            }else if (sss == 2){//筛选失败
                                // 页面的切换
                                this.props.navigator.push({
                                    component: Xzsxssssz
                                });
                            }else if (sss == 3) {//登记受试者
                                // 页面的切换
                                this.props.navigator.push({
                                    component: Djssz, // 具体路由的版块
                                });
                            }
                        }}
                    />
                    {this.screenUI()}
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    {/*<MLNavigatorBar title={'受试者随机'} newTitle = {"plus-circle"} isBack={true} backFunc={() => {*/}
                    {/*this.props.navigator.pop()*/}
                    {/*}} newFunc={() => {*/}
                    {/*this.show(this)*/}
                    {/*}}/>*/}
                    <MLNavigatorBar title={'受试者列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}  leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}  
                    // rightTitle={this.props.isImage == 1 ? "筛选" : ""} newFunc = {()=>{
                    //     if (this.props.isImage != 1) {
                    //         return
                    //     }
                    //     this.screen()
                        
                    // }}
                    />
                    <ListView
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
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
                            if (sss == 1){//筛选成功
                                console.log(sss)
                                // 页面的切换
                                this.props.navigator.push({
                                    component: Xzsxcgssz, // 具体路由的版块
                                });
                            }else if (sss == 2){//筛选失败
                                // 页面的切换
                                this.props.navigator.push({
                                    component: Xzsxssssz
                                });
                            }else if (sss == 3) {//登记受试者
                                // 页面的切换
                                this.props.navigator.push({
                                    component: Djssz, // 具体路由的版块
                                });
                            }
                        }}
                    />
                    {this.screenUI()}
                </View>
            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
            if (rowData.isOut == 1) {
                return(
                    <TouchableOpacity onPress={()=> {
                        if (this.props.isImage == 1){
                            // 页面的切换
                            this.props.navigator.push({
                                component: ImageList, // 具体路由的版块
                                //传递参数
                                passProps:{
                                    data:rowData
                                }
                            });
                            return
                        }
                    }}>
                        <MLTableCell 
                        isArrow = {false} 
                        title={'受试者编号:' + rowData.USubjID} 
                        subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('分组:' + rowData.Arm) : "分组:无")) : "")} 
                        subTitleColor = {'black'} 
                        rightTitle={'已经完成或退出'} 
                        rightTitleColor = {'gray'}/>
                    </TouchableOpacity>
                )
            }else {
                if (rowData.isSuccess == 1){
                    if (rowData.Random == -1){
                        if (rowData.persons.isBasicData == 1){
                            return (
                                <TouchableOpacity onPress={() => {
                                    if (this.props.isImage == 1) {
                                        // 页面的切换
                                        this.props.navigator.push({
                                            component: ImageList, // 具体路由的版块
                                            //传递参数
                                            passProps: {
                                                data: rowData
                                            }
                                        });
                                        return
                                    }

                                    var isAlert = false;
                                    var user = null;
                                    for (var i = 0; i < Users.Users.length; i++) {
                                        if (Users.Users[i].UserFun == 'H2') {
                                            user = Users.Users[i]
                                            break;
                                        }
                                        if (Users.Users[i].UserFun == 'H3') {
                                            user = Users.Users[i]
                                            break;
                                        }
                                        if (Users.Users[i].UserFun == 'S1') {
                                            user = Users.Users[i]
                                            break;
                                        }
                                    }
                                    if (user == null) {
                                        return;
                                    }
                                    if (user.UserSite.indexOf(',') != -1) {
                                        var sites = user.UserSite.split(",");
                                        var xxx = false;
                                        for (var j = 0; j < sites.length; j++) {
                                            if (sites[j] == rowData.persons.SiteID) {
                                                xxx = true;
                                                break;
                                            }
                                        }
                                        if (xxx = false) {
                                            return;
                                        }
                                    } else if (user.UserSite != rowData.persons.SiteID) {
                                        return;
                                    }
                                    //错误
                                    Alert.alert(
                                        "提示:",
                                        "请选择你要操作的功能",
                                        [
                                            {text: '添加为成功受试者', onPress: () => {

                                                // 页面的切换
                                                this.props.navigator.push({
                                                    component: Xzsxcgssz,
                                                    //传递参数
                                                    passProps:{
                                                        data:rowData.persons
                                                    }
                                                });
                                            }},
                                            {text: '添加为失败受试者', onPress: () => {

                                                // 页面的切换
                                                this.props.navigator.push({
                                                    component: Xzsxssssz,
                                                    //传递参数
                                                    passProps:{
                                                        data:rowData.persons
                                                    }
                                                });
                                            }},
                                            {text: '修改基本信息', onPress: () => this.xiugaizhiliao(this, rowData)},
                                            {text: '取消'}
                                        ]
                                    )
                                }}>
                                    <MLTableCell title={'受试者编号:' + rowData.USubjID}
                                                 subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                                 subTitleColor={'black'} rightTitle={'筛选中受试者'} rightTitleColor = {'gray'}/>
                                </TouchableOpacity>
                            )
                        }else {
                            var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                            return (
                                <TouchableOpacity onPress={() => {
                                    if (this.props.isImage == 1) {
                                        // 页面的切换
                                        this.props.navigator.push({
                                            component: ImageList, // 具体路由的版块
                                            //传递参数
                                            passProps: {
                                                data: rowData
                                            }
                                        });
                                        return
                                    }

                                    var isAlert = false;
                                    var user = null;
                                    for (var i = 0; i < Users.Users.length; i++) {
                                        if (Users.Users[i].UserFun == 'H2') {
                                            user = Users.Users[i]
                                            break;
                                        }
                                        if (Users.Users[i].UserFun == 'H3') {
                                            user = Users.Users[i]
                                            break;
                                        }
                                        if (Users.Users[i].UserFun == 'S1') {
                                            user = Users.Users[i]
                                            break;
                                        }
                                    }
                                    if (user == null) {
                                        return;
                                    }
                                    if (user.UserSite.indexOf(',') != -1) {
                                        var sites = user.UserSite.split(",");
                                        var xxx = false;
                                        for (var j = 0; j < sites.length; j++) {
                                            if (sites[j] == rowData.persons.SiteID) {
                                                xxx = true;
                                                break;
                                            }
                                        }
                                        if (xxx = false) {
                                            return;
                                        }
                                    } else if (user.UserSite != rowData.persons.SiteID) {
                                        return;
                                    }

                                    var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                                    //错误
                                    Alert.alert(
                                        "提示:",
                                        "请选择你要操作的功能",
                                        [
                                            {
                                                text: grps.length > 1 ? '取随机号' : "同意给予", onPress: () => {
                                                        if (typeof(researchParameter.researchParameter.StudyDCross) != "undefined" && researchParameter.researchParameter.StudyDCross != '') {
                                                            var studyDCross = researchParameter.researchParameter.StudyDCross.split(",");
                                                            studyDCross.push('取消')
                                                            studyDCross.splice(0, 0, '请选择交叉设计');
                                                            Popup.show(
                                                                <View>
                                                                    <List renderHeader={this.renderHeader}
                                                                          className="popup-list"
                                                                    >
                                                                        {studyDCross.map((i, index) => (
                                                                            <List.Item key={index}
                                                                                       style={{
                                                                                           textAlign: 'center'
                                                                                       }}
                                                                                       onClick={() => {
                                                                                           if (index == studyDCross.length - 1 || index == 0) {
                                                                                               Popup.hide();
                                                                                               return;
                                                                                           }
                                                                                           this.jiachaQusuijihao(studyDCross[index], rowData)
                                                                                           Popup.hide();
                                                                                       }}
                                                                            >
                                                                                <View style={{
                                                                                    width: width - 30,
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                }}>
                                                                                    <Text style={{
                                                                                        fontSize: index == 0 ? 12 : 16,
                                                                                        color: (index == studyDCross.length - 1 ? 'red' : (index == 0 ? 'gray' : 'black'))
                                                                                    }}>{i}</Text>
                                                                                </View>
                                                                            </List.Item>
                                                                        ))}
                                                                    </List>
                                                                </View>,
                                                                {maskClosable: true, animationType: 'slide-up'}
                                                            )
                                                        } else if (typeof(researchParameter.researchParameter.DrugDose) != "undefined" && researchParameter.researchParameter.DrugDose != '') {
                                                            var studyDCross = researchParameter.researchParameter.DrugDose.split(",");
                                                            studyDCross.push('取消')
                                                            studyDCross.splice(0, 0, '请选择药物规格');
                                                            Popup.show(
                                                                <View>
                                                                    <List renderHeader={this.renderHeader}
                                                                          className="popup-list"
                                                                    >
                                                                        {studyDCross.map((i, index) => (
                                                                            <List.Item key={index}
                                                                                       style={{
                                                                                           textAlign: 'center'
                                                                                       }}
                                                                                       onClick={() => {
                                                                                           if (index == studyDCross.length - 1 || index == 0) {
                                                                                               Popup.hide();
                                                                                               return;
                                                                                           }
                                                                                           this.yaowujiliangQusuijihao(studyDCross[index], rowData)
                                                                                           Popup.hide();
                                                                                       }}
                                                                            >
                                                                                <View style={{
                                                                                    width: width - 30,
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                }}>
                                                                                    <Text style={{
                                                                                        fontSize: index == 0 ? 12 : 16,
                                                                                        color: (index == studyDCross.length - 1 ? 'red' : (index == 0 ? 'gray' : 'black'))
                                                                                    }}>{i}</Text>
                                                                                </View>
                                                                            </List.Item>
                                                                        ))}
                                                                    </List>
                                                                </View>,
                                                                {maskClosable: true, animationType: 'slide-up'}
                                                            )
                                                        } else {
                                                            //移除等待
                                                            this.setState({animating: true})
                                                            //获取中心数据网络请求
                                                            fetch(settings.fwqUrl + "/app/getRandomNumber", {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Accept': 'application/json; charset=utf-8',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({
                                                                    StudyID: Users.Users[0].StudyID,
                                                                    SubjFa: rowData.persons.SubjFa == null ? '' : rowData.persons.SubjFa,
                                                                    SubjFb: rowData.persons.SubjFb == null ? '' : rowData.persons.SubjFb,
                                                                    SubjFc: rowData.persons.SubjFc == null ? '' : rowData.persons.SubjFc,
                                                                    SubjFd: rowData.persons.SubjFd == null ? '' : rowData.persons.SubjFd,
                                                                    SubjFe: rowData.persons.SubjFe == null ? '' : rowData.persons.SubjFe,
                                                                    SubjFf: rowData.persons.SubjFf == null ? '' : rowData.persons.SubjFf,
                                                                    SubjFg: rowData.persons.SubjFg == null ? '' : rowData.persons.SubjFg,
                                                                    SubjFh: rowData.persons.SubjFh == null ? '' : rowData.persons.SubjFh,
                                                                    SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? (rowData.persons.SubjFi == null ? '' : rowData.persons.SubjFi ) : '',
                                                                    SiteID: rowData.persons.SiteID,
                                                                    user: Users.Users[0],
                                                                    userId: rowData.persons.id,
                                                                    czzUser: Users.Users[0],
                                                                    sjzUser: rowData.persons
                                                                })
                                                            })
                                                                .then((response) => response.json())
                                                                .then((responseJson) => {
                                                                    this.setState({
                                                                        animating: false
                                                                    })
                                                                    if (responseJson.isSucceed == 200) {
                                                                        //错误
                                                                        Alert.alert(
                                                                            "提示",
                                                                            responseJson.msg,
                                                                            [
                                                                                {text: '确定'}
                                                                            ]
                                                                        )
                                                                    } else {
                                                                        //错误
                                                                        Alert.alert(
                                                                            "提示",
                                                                            responseJson.msg,
                                                                            [
                                                                                {
                                                                                    text: '确定', onPress: () => {
                                                                                    this.props.navigator.pop()
                                                                                }
                                                                                }
                                                                            ]
                                                                        )
                                                                    }
                                                                })
                                                                .catch((error) => {//错误
                                                                    this.setState({
                                                                        animating: false
                                                                    })
                                                                    this.setState({animating: false});
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
                                            }
                                            },
                                            {text: '修改基本信息', onPress: () => this.xiugaizhiliao(this, rowData)},
                                            {text: '取消'}
                                        ]
                                    )
                                }}>
                                    <MLTableCell title={'受试者编号:' + rowData.USubjID}
                                                 subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                                 subTitleColor={'black'} rightTitle={grps.length == 1 ? "未给予研究治疗" : '随机号:未取'} />
                                </TouchableOpacity>
                            )
                        }
                    }else {

                        var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                        var randomStr = ""
                        if (grps.length != 1 && rowData.persons.RandomDate != null && rowData.persons.RandomUserPhone != null){
                            randomStr = "\n随机时间:" + moment(rowData.persons.RandomDate).format('YYYY/MM/DD HH:mm:ss') + "\n操作用户:" + rowData.persons.RandomUserPhone.substr(rowData.persons.RandomUserPhone.length - 4)
                        } else if (grps.length == 1 && rowData.persons.RandomDate != null && rowData.persons.RandomUserPhone != null){
                            randomStr = "\n入组时间:" + moment(rowData.persons.RandomDate).format('YYYY/MM/DD HH:mm:ss') + "\n操作用户:" + rowData.persons.RandomUserPhone.substr(rowData.persons.RandomUserPhone.length - 4)
                        }
                        var userDataStr = ("姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + (rowData.Arm == null ? "无" : rowData.Arm)) : ""))
                        return(
                            <TouchableOpacity onPress={()=>{
                                if (this.props.isImage == 1){
                                    // 页面的切换
                                    this.props.navigator.push({
                                        component: ImageList, // 具体路由的版块
                                        //传递参数
                                        passProps:{
                                            data:rowData
                                        }
                                    });
                                    return
                                }
                                var isAlert = false;
                                var user = null;
                                for (var i= 0 ; i < Users.Users.length ; i++){
                                    if (Users.Users[i].UserFun == 'H2'){
                                        user = Users.Users[i]
                                        break;
                                    }
                                    if (Users.Users[i].UserFun == 'H3'){
                                        user = Users.Users[i]
                                        break;
                                    }
                                    if (Users.Users[i].UserFun == 'S1'){
                                        user = Users.Users[i]
                                        break;
                                    }
                                }
                                if (user == null){
                                    return;
                                }
                                if (user.UserSite.indexOf(',') != -1 ) {
                                    var sites = user.UserSite.split(",");
                                    var  xxx = false;
                                    for (var j = 0 ; j < sites.length ; j++){
                                        if (sites[j] == rowData.persons.SiteID){
                                            xxx = true;
                                            break;
                                        }
                                    }
                                    if (xxx = false){
                                        return;
                                    }
                                }else if (user.UserSite != rowData.persons.SiteID){
                                    return;
                                }
                                //错误
                                Alert.alert(
                                    "提示:",
                                    "请选择你要操作的功能",
                                    [
                                        {text: '发送用药提醒短信', onPress: () => {
                                            //判断该研究是否提供药物号
                                            if (researchParameter.researchParameter.BlindSta == 1){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.id,
                                                        phone : rowData.persons == null ? rowData.phone :rowData.persons.SubjMP,
                                                        patient : rowData.persons
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }else if (researchParameter.researchParameter.BlindSta == 2){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.id,
                                                        phone : rowData.persons == null ? rowData.phone :rowData.persons.SubjMP,
                                                        patient : rowData.persons
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }else {
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.id,
                                                        phone : rowData.persons == null ? rowData.phone :rowData.persons.SubjMP,
                                                        patient : rowData.persons
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }
                                        }},
                                      //  {text: '添加为筛选成功'},
                                        //{text: '添加为筛选失败'},
                                        {text: '修改基本信息' , onPress:()=>this.xiugaizhiliao(this,rowData)},
                                        {text: '取消'}
                                    ]
                                )
                            }}>
                                <MLTableCell 
                                title={'受试者编号:' + rowData.USubjID} 
                                // subTitle={("姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + (rowData.Arm == null ? "无" : rowData.Arm)) : "") + randomStr)} 
                                subTitle={([
                                <Text>{userDataStr}</Text>,
                                <Text style={{
                                    fontSize:12,
                                    color:'gray'
                                }}>{randomStr}</Text>
                                ])} 
                                subTitleColor = {'black'} 
                                rightTitle={grps.length == 1 ? "给予研究治疗":'随机号:' + rowData.Random} 
                                rightTitleColor = {'black'}/>
                            </TouchableOpacity>
                        )
                    }
                }else {
                    return(
                        <TouchableOpacity onPress={()=> {
                            if (this.props.isImage == 1){
                                // 页面的切换
                                this.props.navigator.push({
                                    component: ImageList, // 具体路由的版块
                                    //传递参数
                                    passProps:{
                                        data:rowData
                                    }
                                });
                                return
                            }
                        }}>
                            <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:不适用")) : "")} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
                        </TouchableOpacity>
                    )
                }
            }
    },

    //交叉设计取随机号
    jiachaQusuijihao(text,rowData){
        // alert('交叉设计' + text)
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //移除等待
                        this.setState({animating: true})
                        //获取中心数据网络请求
                        fetch(settings.fwqUrl + "/app/getRandomNumber", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                StudyID: Users.Users[0].StudyID,
                                SubjFa: rowData.persons.SubjFa == null ? '' : rowData.persons.SubjFa,
                                SubjFb: rowData.persons.SubjFb == null ? '' : rowData.persons.SubjFb,
                                SubjFc: rowData.persons.SubjFc == null ? '' : rowData.persons.SubjFc,
                                SubjFd: rowData.persons.SubjFd == null ? '' : rowData.persons.SubjFd,
                                SubjFe: rowData.persons.SubjFe == null ? '' : rowData.persons.SubjFe,
                                SubjFf: rowData.persons.SubjFf == null ? '' : rowData.persons.SubjFf,
                                SubjFg: rowData.persons.SubjFg == null ? '' : rowData.persons.SubjFg,
                                SubjFh: rowData.persons.SubjFh == null ? '' : rowData.persons.SubjFh,
                                SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? (rowData.persons.SubjFi == null ? '' : rowData.persons.SubjFi ) : '',
                                SiteID: rowData.persons.SiteID,
                                user: Users.Users[0],
                                userId: rowData.persons.id,
                                czzUser: Users.Users[0],
                                sjzUser: rowData.persons,
                                StudyDCross: text
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({
                                    animating: false
                                })
                                if (responseJson.isSucceed == 200) {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                } else {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {
                                                text: '确定', onPress: () => {
                                                this.props.navigator.pop()
                                            }
                                            }
                                        ]
                                    )
                                }
                            })
                            .catch((error) => {//错误
                                this.setState({
                                    animating: false
                                })
                                this.setState({animating: false});
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
                    }}])
    },

    //药物剂量取随机号
    yaowujiliangQusuijihao(text,rowData){
      // alert('药物剂量' + text)
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //移除等待
                        this.setState({animating: true})
                        //获取中心数据网络请求
                        fetch(settings.fwqUrl + "/app/getRandomNumber", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                StudyID: Users.Users[0].StudyID,
                                SubjFa: rowData.persons.SubjFa == null ? '' : rowData.persons.SubjFa,
                                SubjFb: rowData.persons.SubjFb == null ? '' : rowData.persons.SubjFb,
                                SubjFc: rowData.persons.SubjFc == null ? '' : rowData.persons.SubjFc,
                                SubjFd: rowData.persons.SubjFd == null ? '' : rowData.persons.SubjFd,
                                SubjFe: rowData.persons.SubjFe == null ? '' : rowData.persons.SubjFe,
                                SubjFf: rowData.persons.SubjFf == null ? '' : rowData.persons.SubjFf,
                                SubjFg: rowData.persons.SubjFg == null ? '' : rowData.persons.SubjFg,
                                SubjFh: rowData.persons.SubjFh == null ? '' : rowData.persons.SubjFh,
                                SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? (rowData.persons.SubjFi == null ? '' : rowData.persons.SubjFi ) : '',
                                SiteID: rowData.persons.SiteID,
                                user: Users.Users[0],
                                userId: rowData.persons.id,
                                czzUser: Users.Users[0],
                                sjzUser: rowData.persons,
                                DrugDose: text
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({
                                    animating: false
                                })
                                if (responseJson.isSucceed == 200) {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                } else {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {
                                                text: '确定', onPress: () => {
                                                this.props.navigator.pop()
                                            }
                                            }
                                        ]
                                    )
                                }
                            })
                            .catch((error) => {//错误
                                this.setState({
                                    animating: false
                                })
                                this.setState({animating: false});
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
                    }}])
    },

    //修改资料
    xiugaizhiliao(self,data){
        // 页面的切换
        self.props.navigator.push({
            //传递参数
            passProps:{
                userData : data,
                isMohu: (self.props.data != null ? true : false)
            },
            component: MLUpdateUser, // 具体路由的版块
        });
    },

    //筛选
    screen(){
        this.setState({
            isScreen : true
        })
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
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("suiji")}}>
                            <Text style = {[styles.selectTitleStayle]}>随机状态：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.suiji == "" ? "未选择" : this.state.suiji}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("tupian")}}>
                            <Text style = {[styles.selectTitleStayle]}>是否上传图片：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.tupian == "" ? "未选择" : this.state.tupian}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("bianhao")}}>
                            <Text style = {[styles.selectTitleStayle]}>受试者编号：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.bianhao == "" ? "未选择" : this.state.bianhao}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[styles.screenStayle]} onPress={()=>{this.clickScreen("shuju")}}>
                            <Text style = {[styles.selectTitleStayle]}>页码/模块数据行状态：</Text>
                            <Text style = {[styles.selectTextStayle]}>{this.state.shuju == "" ? "未选择" : this.state.shuju}</Text>
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
                                shuju:""
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
         }else if (type == "suiji"){
            array = ["筛选中","已随机","筛选失败","已完成或退出"];
        }else if (type == "tupian"){
            array = ["是","否"];
        }else if (type == "bianhao"){
            array = ["按编号排序"];
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
                }else if (type == "bianhao"){
                    this.setState({bianhao:pickedValue[0]})
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
            suiji : this.state.suiji,
            tupian : this.state.tupian,
            bianhao : this.state.bianhao,
            shuju : this.state.shuju,
        })
        .then((responseJson) => {
            Toast.hide()
            //ListView设置
            var tableData = responseJson.data;
            this.state.tableData = tableData;
            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
            this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});

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
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
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
module.exports = Qsjh;

