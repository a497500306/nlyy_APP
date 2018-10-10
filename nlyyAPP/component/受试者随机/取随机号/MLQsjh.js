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
    DeviceEventEmitter
} from 'react-native';

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
// var Mhcx = require('../模糊查询/MLMhcx')
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';

const buttons = ['取消', '添加筛选成功受试者','添加筛选失败受试者','登记受试者'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 8;
var friendId = 0;
var seveRowData = {};

var Qsjh = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },
    getDefaultProps(){
        return {
            data:null,
            isImage:0
        }
    },
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[],
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
                        <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('分组:' + rowData.Arm) : "分组:无")) : "")} subTitleColor = {'black'} rightTitle={'已经完成或退出'} rightTitleColor = {'gray'}/>
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
                                <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + (rowData.Arm == null ? "无" : rowData.Arm)) : "") } subTitleColor = {'black'} rightTitle={grps.length == 1 ? "给予研究治疗":'随机号:' + rowData.Random} rightTitleColor = {'black'}/>
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
module.exports = Qsjh;

