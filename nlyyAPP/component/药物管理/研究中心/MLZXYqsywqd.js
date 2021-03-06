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
    ListView,
    Alert
} from 'react-native';

//时间操作
var moment = require('moment');
moment().format();

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var Users = require('../../../entity/Users');
var settings = require('../../../settings');
var Changku = require('../../../entity/Changku');
var NewYwqd = require('../仓库/MLNewYwqd');
var ZXNewYwqd = require('./MLZXNewYwqd');
var FPQDData = require('../仓库/保存数据/FPQDData');


var ZXYqsywqd = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
        }
    },
    //耗时操作,网络请求
    componentDidMount(){
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'H4'){
                if (Users.Users[i].UserSite != null) {
                    UserSite = Users.Users[i].UserSite
                }
            }
        }
        var UserSiteYN = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'H4') {
                if (Users.Users[i].UserSiteYN != null) {
                    UserSiteYN = Users.Users[i].UserSiteYN
                }
            }
        }
        //网络请求
        fetch(settings.fwqUrl + "/app/getZXYqsywqd", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                UserSiteYN : UserSiteYN,
                UserSite : UserSite,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                    //错误
                    Alert.alert(
                        '提示:',
                        responseJson.msg,
                        [
                            {text: '确定'}
                        ]
                    )
                }else{
                    //ListView设置

                    var tableData = [];
                    for (var i = 0 ; i < responseJson.data.length ; i++){
                        var changku = responseJson.data[i];
                        tableData.push(changku)
                    }

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(tableData)});
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

                    <MLNavigatorBar title={'已签收药物清单'} isBack={true} backFunc={() => {
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

                    <MLNavigatorBar title={'已签收药物清单'} isBack={true} backFunc={() => {
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
    renderRow(rowData){
        console.log('22222211111')
        console.log(rowData)
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        return(
            <TouchableOpacity onPress={()=>{
                FPQDData.FPQDData = rowData
                //错误
                Alert.alert(
                    '提示:',
                    '请选择功能',
                    [
                        {text: '操作该批次药物号', onPress: () => {
                            //设置数据
                            // 页面的切换
                            this.props.navigator.push({
                                name:'sdfljsdf',
                                component: ZXNewYwqd, // 具体路由的版块
                                //传递参数
                                passProps:{
                                    DrugId : rowData.id,
                                    UsedAddressId : rowData.Address.id,
                                    SiteID : rowData.Address.SiteID
                                },
                            });
                        }},


                        {text: '全部激活', onPress: () => {
                            this.setState({animating:true});
                            //网络请求
                            fetch(settings.fwqUrl + "/app/getZXAllOnActivation", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    DrugId : rowData.id,
                                    UsedCoreId : rowData.Address.SiteID
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    console.log(responseJson)
                                    if (responseJson.isSucceed != 400){
                                        //移除等待
                                        this.setState({animating:false});
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                    }else{
                                        //ListView设置
                                        this.setState({animating:false});
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
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
                <MLTableCell title={moment(rowData.Date).format('YYYY-MM-DD HH:mm:ss')}/>
            </TouchableOpacity>
        )
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
module.exports = ZXYqsywqd;
