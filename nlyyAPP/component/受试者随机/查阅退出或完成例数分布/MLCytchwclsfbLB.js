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
    ListView,
    Alert
} from 'react-native';

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var researchParameter = require('../../../entity/researchParameter');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var Cytchwclsfb = require('./MLCytchwclsfb');
var xzzx = require('../../停止入组/单个中心/MLTzrzZxTable');

var CytchwclsfbLB = React.createClass({
    getInitialState() {
        //判断用户类别
        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            //判断用户类别
            if (data.UserFun == 'H1' || data.UserFun == 'M1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '整个研究'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('整个研究')
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'M1' || data.UserFun == 'M7' ){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j] == '单个中心'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push('单个中心')
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
                <MLNavigatorBar title={'选择功能'} isBack={true} backFunc={() => {
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
        return(
            <TouchableOpacity onPress={()=>{
                if (rowData == '单个中心'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: xzzx, // 具体路由的版块
                        //传递参数
                        passProps:{
                            pushType:1
                        }
                    });
                }else if (rowData == '整个研究'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: Cytchwclsfb, // 具体路由的版块
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
module.exports = CytchwclsfbLB;
