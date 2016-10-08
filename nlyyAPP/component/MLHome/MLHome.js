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
var DrugsAI = require('../药物管理/MLDrugsAI');
var FollowUpAI = require('../随访管理/MLFollowUpAI');
var Unblinding = require('../揭盲/MLUnblinding');
var StopEntry = require('../停止入组/MLStopEntry');
var ResearchAI = require('../研究管理/MLResearchAI');
var Helper = require('../小帮手/MLHelper');

var Home = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'H2' ||
            Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1' ||
            Users.Users.UserFun == 'M1' || Users.Users.UserFun == 'M3'){
            tableData.push('受试者随机')
        }
        if (Users.Users.UserFun == 'H4' || Users.Users.UserFun == 'M6' ||
            Users.Users.UserFun == 'M1' || Users.Users.UserFun == 'M7'){
            tableData.push('药品管理')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' ||
            Users.Users.UserFun == 'S1'){
            tableData.push('随访管理')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' ||
            Users.Users.UserFun == 'S1' || Users.Users.UserFun == 'C1' ||
            Users.Users.UserFun == 'M5'){
            tableData.push('揭盲')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' ||
            Users.Users.UserFun == 'C1' || Users.Users.UserFun == 'S1' ||
            Users.Users.UserFun == 'M7'){
            tableData.push('停止入组')
        }
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M4' ||
            Users.Users.UserFun == 'M3' || Users.Users.UserFun == 'M2' ||
            Users.Users.UserFun == 'C1'){
            tableData.push('研究管理')
        }
        tableData.push('小助手')

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
                <MLNavigatorBar title={'首页'} isBack={true} backFunc={() => {
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
                console.log('点击'+rowData);
                // 页面的切换
                if (rowData == "受试者随机"){
                    this.props.navigator.push({
                        component: PatientRM, // 具体路由的版块
                    });
                }
                if (rowData == "药品管理"){
                    this.props.navigator.push({
                        component: DrugsAI, // 具体路由的版块
                    });
                }
                if (rowData == "随访管理"){
                    this.props.navigator.push({
                        component: FollowUpAI, // 具体路由的版块
                    });
                }
                if (rowData == "揭盲"){
                    this.props.navigator.push({
                        component: Unblinding, // 具体路由的版块
                    });
                }
                if (rowData == "停止入组"){
                    this.props.navigator.push({
                        component: StopEntry, // 具体路由的版块
                    });
                }
                if (rowData == "研究管理"){
                    this.props.navigator.push({
                        component: ResearchAI, // 具体路由的版块
                    });
                }
                if (rowData == "小助手"){
                    this.props.navigator.push({
                        component: Helper, // 具体路由的版块
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
module.exports = Home;
