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
var PatientRM = require('../../受试者随机/MLPatientRM');
var YjxxSq = require('./MLYjxxSq')
var YjxxSh = require('./MLYjxxSh')

var Yjxx = React.createClass({
    getInitialState() {
        var shengqing = [];
        var shenghe = [];
        for (var y = 0 ; y < ApplicationAndAudit.ApplicationAndAudit.length ; y++) {
            if (ApplicationAndAudit.ApplicationAndAudit[y].EventApp == 4){
                shengqing = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");
            }
            if (ApplicationAndAudit.ApplicationAndAudit[y].EventRev == 4){
                shenghe = ApplicationAndAudit.ApplicationAndAudit[y].EventRevUsers.split(",");
            }
        }
        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            for (var y = 0 ; y < shengqing.length ; y++) {
                if (data.UserFun == shengqing[y]){
                    var isY = false
                    for (var j = 0 ; j < tableData.length ; j++){
                        if (tableData[j] == '申请'){
                            isY = true;
                        }
                    }
                    if (isY == false){
                        tableData.push('申请')
                    }
                }
            }
            //判断用户类别
            for (var y = 0 ; y < shenghe.length ; y++) {
                if (data.UserFun == shenghe[y]){
                    var isY = false
                    for (var j = 0 ; j < tableData.length ; j++){
                        if (tableData[j] == '审核'){
                            isY = true;
                        }
                    }
                    if (isY == false){
                        tableData.push('审核')
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
                <MLNavigatorBar title={'研究下线'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
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
        return(
            <TouchableOpacity onPress={()=>{
                if (rowData == '申请'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: YjxxSq, // 具体路由的版块
                    });

                }
                if (rowData == '审核'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: YjxxSh, // 具体路由的版块
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
module.exports = Yjxx;
