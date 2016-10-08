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

var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../entity/Users');
var MLTableCell = require('../MLTableCell/MLTableCell');
var PatientRM = require('../受试者随机/MLPatientRM');

var ResearchAI = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        if (Users.Users.UserFun == 'M1' || Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M4' ||
            Users.Users.UserFun == 'M2' || Users.Users.UserFun == 'M3' || Users.Users.UserFun == 'C1'){
            tableData.push('研究下线')
        }
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'PM'){
            tableData.push('查询子研究受试者例数')
        }
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'PM'){
            tableData.push('查询延长期研究受试者例数')
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
                <MLNavigatorBar title={'研究管理'} isBack={true} backFunc={() => {
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
module.exports = ResearchAI;
