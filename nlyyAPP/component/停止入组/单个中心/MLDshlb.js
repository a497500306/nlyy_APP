

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ListView,
    Alert
} from 'react-native';

//时间操作
var moment = require('moment');
moment().format();

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var study = require('../../../entity/study');
var Changku = require('../../../entity/Changku');
var settings = require('../../../settings');
var FPZhongxin = require('../../药物管理/仓库/保存数据/FPZhongxin');
var FPChangku = require('../../药物管理/仓库/保存数据/FPChangku');
var DgzxSq = require('./MLDgzxSq');
var DgzxCkjd = require('./MLDgzxCkjd')

var Dshlb = React.createClass({

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
            dataType : null
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
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getZXStopItWaitForAudit", {
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
                console.log(responseJson)
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:true});
                }else{
                    //ListView设置
                    console.log(responseJson)
                    var tableData = responseJson.data;

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({
                        dataSource: ds.cloneWithRows(tableData),
                        dataType : responseJson.dataType
                    });
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:false});
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
    // getInitialState() {


    // },

    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'审核列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.cuowu == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'审核列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'审核列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
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
    renderRow(rowData, sectionID, rowID, highlightRow){
        console.log("返回具体的cell")
        console.log(rowData)
        var sss = rowData.isStopIt == 1?'是' : '否';
        //判断改用户是不是随机化专员
        var isSJHZY = false;
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'C1') {
                isSJHZY = true
            }
        }
        if (isSJHZY == false){
            return(
                <TouchableOpacity onPress={()=>{
                    //错误
                    Alert.alert(
                        '提示',
                        '您可选择您的操作',
                        [
                            {text: '审批', onPress: () => {
                                Alert.alert(
                                    '提示',
                                    '您可选择您的操作',
                                    [
                                        {text: '通过', onPress: () => {
                                            //发送网络请求
                                            fetch(settings.fwqUrl + "/app/getZXToExamine", {
                                                method: 'POST',
                                                headers: {
                                                    'Accept': 'application/json; charset=utf-8',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    id : rowData.id,
                                                    StudyID : Users.Users[0].StudyID,
                                                    ToExamineUserData : Users.Users[0],
                                                    ToExamineType : 1,
                                                    ToExamineUsers:Users.Users[0].UserNam,
                                                    ToExaminePhone:Users.Users[0].UserMP,
                                                })
                                            })
                                                .then((response) => response.json())
                                                .then((responseJson) => {
                                                    Alert.alert(
                                                        '提示:',
                                                        responseJson.msg,
                                                        [
                                                            {text: '确定',onPress: () => {this.props.navigator.pop()}}
                                                        ]
                                                    )
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
                                        }},
                                        /*{text: '拒绝', onPress: () => {
                                            //发送网络请求
                                            fetch(settings.fwqUrl + "/app/getZXToExamine", {
                                                method: 'POST',
                                                headers: {
                                                    'Accept': 'application/json; charset=utf-8',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    id : rowData.id,
                                                    ToExamineType : 0,
                                                    StudyID : Users.Users[0].StudyID,
                                                    ToExamineUserData : Users.Users[0],
                                                    ToExamineUsers:Users.Users[0].UserNam,
                                                    ToExaminePhone:Users.Users[0].UserMP,
                                                })
                                            })
                                                .then((response) => response.json())
                                                .then((responseJson) => {
                                                    Alert.alert(
                                                        '提示:',
                                                        responseJson.msg,
                                                        [
                                                            {text: '确定',onPress: () => {this.props.navigator.pop()}}
                                                        ]
                                                    )
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
                                        }},
                                        */
                                        {text: '取消'}
                                    ]
                                )
                            }},
                            {text: '查看进度', onPress: () => {
                                // 页面的切换
                                this.props.navigator.push({
                                    component: DgzxCkjd, // 具体路由的版块
                                    //传递参数
                                    passProps:{
                                        datas : rowData,
                                    },
                                });
                            }},
                            {text: '取消'}
                        ]
                    )
                }}>
                    <View style={{marginTop: 10 , backgroundColor: 'white',borderBottomColor: '#dddddd', borderBottomWidth: 1,borderTopColor: '#dddddd', borderTopWidth: 1, }}>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'研究编号:' + rowData.StudyID}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心名称:' + rowData.SiteID}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'受试者入组是否中心之间竞争:' + (study.study.AccrualCmpYN == 1 ? '是' : '否')}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心平均入组例数:' + this.state.dataType[rowID].PJRZLS}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心目前已随机例数:' + this.state.dataType[rowID].YSJLS}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心停止入组原因:' + rowData.Reason}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心已停止受试者入组:' + sss}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'是否推送短信给全国PI:' + rowData.isMessage}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'是否推送邮件给全国PI:' + rowData.isMail}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'申请人:' + rowData.UserNam}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'申请人手机号:' + rowData.UserMP}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'申请人电子邮箱:' + rowData.UserEmail}</Text>
                        <Text style={{marginBottom: 5,marginTop: 5,marginLeft:10}}>{'申请日期:' + moment(rowData.Date).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity onPress={()=>{
                    //错误
                    Alert.alert(
                        '提示',
                        '您可选择您的操作',
                        [
                            {text: '停止中心入组', onPress: () => {
                                Alert.alert(
                                    '提示',
                                    '您可选择您的操作',
                                    [
                                        {text: '确定停止', onPress: () => {
                                            //发送网络请求
                                            fetch(settings.fwqUrl + "/app/getDetermineZXStopIt", {
                                                method: 'POST',
                                                headers: {
                                                    'Accept': 'application/json; charset=utf-8',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    id : rowData.id,
                                                    StudyID : Users.Users[0].StudyID,
                                                    isStopIt : 1,
                                                    StopItUsers:Users.Users[0].UserNam,
                                                    StopItPhone:Users.Users[0].UserMP,
                                                })
                                            })
                                                .then((response) => response.json())
                                                .then((responseJson) => {
                                                    Alert.alert(
                                                        '提示:',
                                                        responseJson.msg,
                                                        [
                                                            {text: '确定',onPress: () => {this.props.navigator.pop()}}
                                                        ]
                                                    )
                                                })
                                                .catch((error) => {//错误
                                                    //移除等待,弹出错误
                                                    this.setState({animating:false});
                                                    //错误
                                                    Alert.alert(
                                                        '提示',
                                                        '请检测网络',
                                                        [
                                                            {text: '确定'}
                                                        ]
                                                    )

                                                });
                                        }},
                                        {text: '拒绝停止', onPress: () => {
                                            //发送网络请求
                                            fetch(settings.fwqUrl + "/app/getDetermineZXStopIt", {
                                                method: 'POST',
                                                headers: {
                                                    'Accept': 'application/json; charset=utf-8',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    id : rowData.id,
                                                    StudyID : Users.Users[0].StudyID,
                                                    isStopIt : 2,
                                                    StopItUsers:Users.Users[0].UserNam,
                                                    StopItPhone:Users.Users[0].UserMP,
                                                })
                                            })
                                                .then((response) => response.json())
                                                .then((responseJson) => {
                                                    Alert.alert(
                                                        '提示:',
                                                        responseJson.msg,
                                                        [
                                                            {text: '确定',onPress: () => {this.props.navigator.pop()}}
                                                        ]
                                                    )
                                                })
                                                .catch((error) => {//错误
                                                    //移除等待,弹出错误
                                                    this.setState({animating:false});
                                                    //错误
                                                    Alert.alert(
                                                        '提示',
                                                        '请检测网络',
                                                        [
                                                            {text: '确定'}
                                                        ]
                                                    )

                                                });
                                        }},
                                        {text: '取消'}
                                    ]
                                )
                            }},
                            {text: '查看进度', onPress: () => {
                                // 页面的切换
                                this.props.navigator.push({
                                    component: DgzxCkjd, // 具体路由的版块
                                    //传递参数
                                    passProps:{
                                       datas : rowData
                                    },
                                });
                            }},
                            {text: '取消'}
                        ]
                    )
                }}>
                    <View style={{marginTop: 10 , backgroundColor: 'white',borderBottomColor: '#dddddd', borderBottomWidth: 1,borderTopColor: '#dddddd', borderTopWidth: 1, }}>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'研究编号:' + rowData.StudyID}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心名称:' + rowData.SiteID}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'受试者入组是否中心之间竞争:' + (study.study.AccrualCmpYN == 1 ? '是' : '否')}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心平均入组例数:' + this.state.dataType[rowID].PJRZLS}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心目前已随机例数:' + this.state.dataType[rowID].YSJLS}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心停止入组原因:' + rowData.Reason}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'中心已停止受试者入组:' + sss}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'是否推送短信给全国PI:' + rowData.isMessage}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'是否推送邮件给全国PI:' + rowData.isMail}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'申请人:' + rowData.UserNam}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'申请人手机号:' + rowData.UserMP}</Text>
                        <Text style={{marginTop: 5,marginLeft:10}}>{'申请人电子邮箱:' + rowData.UserEmail}</Text>
                        <Text style={{marginBottom: 5,marginTop: 5,marginLeft:10}}>{'申请日期:' + moment(rowData.Date).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    },
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
    }
});

// 输出组件类
module.exports = Dshlb;



