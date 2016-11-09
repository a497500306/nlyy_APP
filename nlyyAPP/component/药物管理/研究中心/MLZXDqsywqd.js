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
var Ywqd = require('../仓库/MLYwqd');
var FPQDData = require('../仓库/保存数据/FPQDData');


var ZXDqsywqd = React.createClass({
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
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        var UserSiteYN = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSiteYN != null) {
                UserSiteYN = Users.Users[i].UserSiteYN
            }
        }
        //网络请求
        fetch(settings.fwqUrl + "/app/getZXDqsywqd", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                UserSiteYN : UserSiteYN,
                UserSite : UserSite
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

                    <MLNavigatorBar title={'待签收药物清单'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'待签收药物清单'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
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
                        {text: '查看清单', onPress: () => {
                            //设置数据
                            // 页面的切换
                            this.props.navigator.push({
                                name:'分配清单',
                                component: Ywqd, // 具体路由的版块
                                //传递参数
                                passProps:{
                                    isBtn : false
                                },
                            });
                        }},

                        {text: '签收', onPress: () => {
                            //网络请求
                            fetch(settings.fwqUrl + "/app/getAssignDqsywqd", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id : rowData.id,
                                    UsedCoreId : UserSite
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
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            '成功',
                                            [
                                                {text: '确定',onPress: () => {
                                                    this.props.navigator.pop()
                                                }}
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
module.exports = ZXDqsywqd;
