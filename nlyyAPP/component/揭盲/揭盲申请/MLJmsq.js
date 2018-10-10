/**
 * Created by maoli on 16/10/9.
 */
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

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var ApplicationAndAudit = require('../../../entity/ApplicationAndAudit');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var Dgssztdjm = require('./单个受试者特定揭盲/MLDgssztdjm')
var Dgzxjjjm = require('./单个中心紧急揭盲/MLDgzxjjjm')
var Zgyjjjjm = require('./整个研究紧急揭盲/MLZgyjjjjm')

var Jmsq = React.createClass({
    getInitialState() {
        var dgssztdjmSH = [];
        var dgssztdjmSQ = [];
        var dgsszjjjmSH = [];
        var dgsszjjjmSQ = [];
        var dgzxjjjmSH = [];
        var dgzxjjjmSQ = [];
        var zgyjjjjmSH = [];
        var zgyjjjjmSQ = [];
        for (var y = 0 ; y < ApplicationAndAudit.ApplicationAndAudit.length ; y++) {
            if (ApplicationAndAudit.ApplicationAndAudit[y].EventApp == 1){
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 1){
                    dgssztdjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 2){
                    dgsszjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 3){
                    dgzxjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 4){
                    zgyjjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
            }
            if (ApplicationAndAudit.ApplicationAndAudit[y].EventRev == 1){
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 1){
                    dgssztdjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 2){
                    dgsszjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 3){
                    dgzxjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
                if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 4){
                    zgyjjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                }
            }
        }
        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            for (var y = 0 ; y < dgssztdjmSQ.length ; y++) {
                if (data.UserFun == dgssztdjmSQ[y]){
                    var isY = false
                    for (var j = 0 ; j < tableData.length ; j++){
                        if (tableData[j] == '单个受试者特定揭盲'){
                            isY = true;
                        }
                    }
                    if (isY == false){
                        tableData.push('单个受试者特定揭盲')
                    }
                }
            }
            //判断用户类别
            for (var y = 0 ; y < dgsszjjjmSQ.length ; y++) {
                if (data.UserFun == dgsszjjjmSQ[y]){
                    var isY = false
                    for (var j = 0 ; j < tableData.length ; j++){
                        if (tableData[j] == '单个受试者紧急揭盲'){
                            isY = true;
                        }
                    }
                    if (isY == false){
                        tableData.push('单个受试者紧急揭盲')
                    }
                }
            }
            //判断用户类别
            for (var y = 0 ; y < dgzxjjjmSQ.length ; y++) {
                if (data.UserFun == dgzxjjjmSQ[y]){
                    var isY = false
                    for (var j = 0 ; j < tableData.length ; j++){
                        if (tableData[j] == '单个中心紧急揭盲'){
                            isY = true;
                        }
                    }
                    if (isY == false){
                        tableData.push('单个中心紧急揭盲')
                    }
                }
            }
            //判断用户类别
            for (var y = 0 ; y < zgyjjjjmSQ.length ; y++) {
                if (data.UserFun == zgyjjjjmSQ[y]){
                    var isY = false
                    for (var j = 0 ; j < tableData.length ; j++){
                        if (tableData[j] == '整个研究紧急揭盲'){
                            isY = true;
                        }
                    }
                    if (isY == false){
                        tableData.push('整个研究紧急揭盲')
                    }
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
                <MLNavigatorBar title={'选择揭盲'} isBack={true} backFunc={() => {
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
    },

    //返回具体的cell
    renderRow(rowData){
        if (rowData == '单个受试者特定揭盲'){
            return(
                <TouchableOpacity onPress={()=>{
                    // 页面的切换
                    this.props.navigator.push({
                        component: Dgssztdjm, // 具体路由的版块
                        //传递参数
                        passProps: {
                            //出生年月
                            UnblindingType:1,
                        }
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else if (rowData == '单个受试者紧急揭盲'){
            return(
                <TouchableOpacity onPress={()=>{
                    // 页面的切换
                    this.props.navigator.push({
                        component: Dgssztdjm, // 具体路由的版块
                        //传递参数
                        passProps: {
                            //出生年月
                            UnblindingType:2,
                        }
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else if (rowData == '单个中心紧急揭盲'){
            return(
                <TouchableOpacity onPress={()=>{
                    // 页面的切换
                    this.props.navigator.push({
                        component: Dgzxjjjm, // 具体路由的版块
                        //传递参数
                        passProps: {
                            //出生年月
                            UnblindingType:3,
                        }
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else if (rowData == '整个研究紧急揭盲'){
            return(
                <TouchableOpacity onPress={()=>{
                    // 页面的切换
                    this.props.navigator.push({
                        component: Zgyjjjjm, // 具体路由的版块
                        //传递参数
                        passProps: {
                            //出生年月
                            UnblindingType:4,
                        }
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else {
            return(
                <TouchableOpacity onPress={()=>{
                    // 页面的切换
                    this.props.navigator.push({
                        component: Dgssztdjm, // 具体路由的版块
                        //传递参数
                        passProps: {
                            //出生年月
                            UnblindingType:2,
                        }
                    });
                }}>
                    <MLTableCell title={rowData}/>
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
module.exports = Jmsq;
