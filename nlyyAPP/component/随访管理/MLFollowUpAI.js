/**
 * Created by maoli on 16/10/9.
 */
/**
 * Created by maoli on 16/10/9.
 */
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
    ListView
} from 'react-native';

var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../entity/Users');
var MLTableCell = require('../MLTableCell/MLTableCell');
var PatientRM = require('../受试者随机/MLPatientRM');
var Sszjxfsrq = require('../随访管理/受试者基线访视日期/MLSszjxfsrq');
var CyxjdnsfsszSR = require('../随访管理/查阅下降段内随访受试者/MLCyxjdnsfsszSR');
var Djssztchwc = require('../随访管理/登记受试者退出或完成/MLDjssztchwc');
var Fsywtxdx = require('../随访管理/发送药物提醒短信/MLFsywtxdx');

var FollowUpAI = React.createClass({
    getInitialState() {
        //判断用户类别
        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            //判断用户类别
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '受试者基线访视日期'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('受试者基线访视日期')
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '查阅下阶段内随访受试者'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('查阅下阶段内随访受试者')
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '登记受试者退出或完成'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('登记受试者退出或完成')
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '发送药物提醒短信'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('发送药物提醒短信')
                }
            }
        }

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData)
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'随访管理'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                if (rowData == '受试者基线访视日期'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: Sszjxfsrq, // 具体路由的版块
                    });
                }else if (rowData == '查阅下阶段内随访受试者'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: CyxjdnsfsszSR, // 具体路由的版块
                    });
                }else if (rowData == '登记受试者退出或完成'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: Djssztchwc, // 具体路由的版块
                    });
                }else if (rowData == '发送药物提醒短信'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: Fsywtxdx, // 具体路由的版块
                    });
                }
            }}>
                <MLTableCell title={rowData}/>
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
module.exports = FollowUpAI;
