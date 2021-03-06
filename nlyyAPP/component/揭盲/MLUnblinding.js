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

var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../entity/Users');
var MLTableCell = require('../MLTableCell/MLTableCell');
var PatientRM = require('../受试者随机/MLPatientRM');
var jmsq = require('./揭盲申请/MLJmsq');
var Djm = require('./待揭盲/MLDjm');

var Unblinding = React.createClass({
    getInitialState() {

        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            //判断用户类别
            if (data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1' || data.UserFun == 'M5' ||
                data.UserFun == 'M4' || data.UserFun == 'M2' ){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '揭盲申请'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('揭盲申请')
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1' || data.UserFun == 'C1' ||
                data.UserFun == 'M5' || data.UserFun == 'M4' ||
                data.UserFun == 'M2' || data.UserFun == 'M3' ||
                data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1' || data.UserFun == 'C1' || data.UserFun == 'H1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '待揭盲'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('待揭盲')
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
                <MLNavigatorBar title={'揭盲'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                {/*<ScrollView>*/}
                {/*{this.tableCell()}*/}
                {/*</ScrollView>*/}
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData){
        if (rowData == '揭盲申请'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: jmsq, // 具体路由的版块
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else if (rowData == '待揭盲'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Djm, // 具体路由的版块
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
module.exports = Unblinding;
