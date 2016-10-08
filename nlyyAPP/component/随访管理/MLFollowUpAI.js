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

var FollowUpAI = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
            tableData.push('受试者基线访视日期')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
            tableData.push('查阅下阶段内随访受试者')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
            tableData.push('登记受试者退出或完成')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
            tableData.push('发送药物提醒短信')
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
                //设置数据
                console.log(Users.Users)
                // 页面的切换
                this.props.navigator.push({
                    component: PatientRM, // 具体路由的版块
                });
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
