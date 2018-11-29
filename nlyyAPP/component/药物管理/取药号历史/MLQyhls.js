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
} from 'react-native';


import  {DeviceEventEmitter} from 'react-native';//通知
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var yytx = require('../../受试者随机/用药提醒/MLYytx')
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
var QywhlsLB = require('./MLQyhlsLB');
var Thywh = require('./MLThywh')
import Icon from 'react-native-vector-icons/FontAwesome';

var Quhls = React.createClass({
    getDefaultProps(){
        return {
            data:null
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

    //耗时操作,网络请求
    componentDidMount(){
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
                    console.log("-------------");
                    console.log(responseJson);
                    console.log("-------------");
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


    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'取药物号历史'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}  leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'取药物号历史'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}  leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        console.log(rowData)
        if (rowData.isOut == 1) {
            return(
                <TouchableOpacity onPress={()=> {
                    if (researchParameter.researchParameter.DrugNOpen == 1){
                        //错误
                        Alert.alert(
                            "提示:",
                            "请选择你要操作的功能",
                            [
                                {text: '取药号历史', onPress: () => {
                                    //判断该研究是否提供药物号
                                    if (researchParameter.researchParameter.BlindSta == 1){
                                        // 页面的切换
                                        this.props.navigator.push({
                                            //传递参数
                                            passProps:{
                                                userData : rowData
                                            },
                                            component: QywhlsLB, // 具体路由的版块
                                        });
                                    }else if (researchParameter.researchParameter.BlindSta == 2){
                                        if (researchParameter.researchParameter.DrugNOpen == 1){
                                            // 页面的切换
                                            this.props.navigator.push({
                                                //传递参数
                                                passProps:{
                                                    userData : rowData
                                                },
                                                component: QywhlsLB, // 具体路由的版块
                                            });
                                        }else{
                                            //错误
                                            Alert.alert(
                                                '提示',
                                                '该研究不提供药物号',
                                                [
                                                    {text: '确定'}
                                                ]
                                            )
                                        }
                                    }else {
                                        if (researchParameter.researchParameter.DrugNOpen == 1){
                                            /// 页面的切换
                                            this.props.navigator.push({
                                                //传递参数
                                                passProps:{
                                                    userData : rowData
                                                },
                                                component: QywhlsLB, // 具体路由的版块
                                            });
                                        }else{
                                            Alert.alert(
                                                '提示',
                                                '该研究不提供药物号',
                                                [
                                                    {text: '确定'}
                                                ]
                                            )
                                        }
                                    }
                                }},
                                {text: '取消'}
                            ]
                        )
                    }else{
                        Alert.alert(
                            '提示',
                            '该研究不提供药物号',
                            [
                                {text: '确定'}
                            ]
                        )
                    }
                }}>
                    <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ('分组:' + rowData.Arm) : "") } subTitleColor = {'black'} rightTitle={'已经完成或退出'} rightTitleColor = {'gray'}/>
                </TouchableOpacity>
            )
        }else {
            if (rowData.isSuccess == 1){
                if (rowData.Random == -1){
                    var grps = researchParameter.researchParameter.NTrtGrp.split(",");

                    return (
                        <TouchableOpacity onPress={()=> {
                            //错误
                            Alert.alert(
                                '提示:',
                                grps.length == 1 ? '未给予研究治疗':'未取随机号',
                                [
                                    {text: '确定'}
                                ]
                            )
                        }}>
                            <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                         subTitleColor={'black'} rightTitle={grps.length == 1 ? "未给予研究治疗" : '随机号:未取'}/>
                        </TouchableOpacity>
                    )
                }else {

                    var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                    return(
                        <TouchableOpacity onPress={()=>{
                            if (researchParameter.researchParameter.DrugNOpen == 1){
                                //错误
                                Alert.alert(
                                    "提示:",
                                    "请选择你要操作的功能",
                                    [
                                        {text: '取药号历史', onPress: () => {
                                            //判断该研究是否提供药物号
                                            if (researchParameter.researchParameter.BlindSta == 1){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userData : rowData
                                                    },
                                                    component: QywhlsLB, // 具体路由的版块
                                                });
                                            }else if (researchParameter.researchParameter.BlindSta == 2){
                                                if (researchParameter.researchParameter.DrugNOpen == 1){
                                                    // 页面的切换
                                                    this.props.navigator.push({
                                                        //传递参数
                                                        passProps:{
                                                            userData : rowData
                                                        },
                                                        component: QywhlsLB, // 具体路由的版块
                                                    });
                                                }else{
                                                    //错误
                                                    Alert.alert(
                                                        '提示',
                                                        '该研究不提供药物号',
                                                        [
                                                            {text: '确定'}
                                                        ]
                                                    )
                                                }
                                            }else {
                                                if (researchParameter.researchParameter.DrugNOpen == 1){
                                                    /// 页面的切换
                                                    this.props.navigator.push({
                                                        //传递参数
                                                        passProps:{
                                                            userData : rowData
                                                        },
                                                        component: QywhlsLB, // 具体路由的版块
                                                    });
                                                }else{
                                                    Alert.alert(
                                                        '提示',
                                                        '该研究不提供药物号',
                                                        [
                                                            {text: '确定'}
                                                        ]
                                                    )
                                                }
                                            }
                                        }},
                                        {text: '替换药物号', onPress: () => {
                                            var yaowuhao = ''
                                            var Cts = rowData.Drug[rowData.Drug.length - 1];

                                            console.log(Cts)
                                            if(Cts.indexOf("替换药物号为")){
                                                yaowuhao = Cts
                                                console.log('没替换')
                                                console.log(yaowuhao)
                                            }else {
                                                isTihuan = 1;
                                                yaowuhao = Cts.substring(6)
                                                console.log('替换')
                                                console.log(yaowuhao)
                                            }
                                            // 页面的切换
                                            this.props.navigator.push({
                                                //传递参数
                                                passProps:{
                                                    userData : rowData,
                                                    isTihuan : true
                                                },
                                                component: QywhlsLB,
                                            });
                                        }},
                                        {text: '取消'}
                                    ]
                                )
                            }else{
                                Alert.alert(
                                    '提示',
                                    '该研究不提供药物号',
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }
                        }}>
                            <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + rowData.Arm) : "") } subTitleColor = {'black'} rightTitle={grps.length == 1 ? "给予研究治疗":('随机号:' + rowData.Random)} rightTitleColor = {'black'}/>
                        </TouchableOpacity>
                    )
                }
            }else {
                return(
                    <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:不适用")) : "")} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
                )
            }
        }
        /*
        return(
            <TouchableOpacity onPress={()=>{
                if (rowData.isSuccess != 1){
                    //错误
                    Alert.alert(
                        '提示',
                        '筛选失败患者无操作',
                        [
                            {text: '确定'}
                        ]
                    )
                    return
                }
                //错误
                Alert.alert(
                    "提示:",
                    "请选择你要操作的功能",
                    [
                        {text: '取药号历史', onPress: () => {
                            //判断该研究是否提供药物号
                            if (researchParameter.researchParameter.BlindSta == 1){
                                // 页面的切换
                                this.props.navigator.push({
                                    //传递参数
                                    passProps:{
                                        userData : rowData
                                    },
                                    component: QywhlsLB, // 具体路由的版块
                                });
                            }else if (researchParameter.researchParameter.BlindSta == 2){
                                if (researchParameter.researchParameter.DrugNSBlind == 1){
                                    // 页面的切换
                                    this.props.navigator.push({
                                        //传递参数
                                        passProps:{
                                            userData : rowData
                                        },
                                        component: QywhlsLB, // 具体路由的版块
                                    });
                                }else{
                                    //错误
                                    Alert.alert(
                                        '提示',
                                        '该研究不提供药物号',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }
                            }else {
                                if (researchParameter.researchParameter.DrugNOpen == 1){
                                    /// 页面的切换
                                    this.props.navigator.push({
                                        //传递参数
                                        passProps:{
                                            userData : rowData
                                        },
                                        component: QywhlsLB, // 具体路由的版块
                                    });
                                }else{
                                    Alert.alert(
                                        '提示',
                                        '该研究不提供药物号',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }
                            }
                        }},
                        {text: '替换药物号', onPress: () => {
                            //移除等待
                            this.setState({animating:true});
                            var UserSite = '';
                            for (var i = 0 ; i < Users.Users.length ; i++) {
                                if (Users.Users[i].UserSite != null) {
                                    UserSite = Users.Users[i].UserSite
                                }
                            }
                            //判断是否为替换的药物号
                            var isTihuan = 0
                            var yaowuhao = ''
                            var Cts = rowData.Drug[rowData.Drug.length - 1];

                            console.log(Cts)
                            if(Cts.indexOf("替换药物号为")){
                                yaowuhao = Cts
                                console.log('没替换')
                                console.log(yaowuhao)
                            }else {
                                isTihuan = 1;
                                yaowuhao = Cts.substring(6)
                                console.log('替换')
                                console.log(yaowuhao)
                            }
                            //发送登录网络请求
                            fetch(settings.fwqUrl + "/app/getThywh", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId : rowData.id,
                                    SiteID : UserSite,
                                    StudyID : Users.Users[0].StudyID,
                                    DrugNum : yaowuhao
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    console.log(responseJson);
                                    if (responseJson.isSucceed != 400){
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                        //移除等待
                                        this.setState({animating:false});
                                    }else{
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定', onPress: () => {
                                                    this.props.navigator.pop()
                                                }}
                                            ]
                                        )
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
                        }},
                        {text: '取消'}
                    ]
                )
            }}>
                <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={rowData.isSuccess == 1 ? '随机号:' + rowData.Random : "筛选失败受试者"} rightTitleColor = {rowData.isSuccess == 1 ? 'black': "gray"}/>
            </TouchableOpacity>
        )
        */
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
module.exports = Quhls;

