/**
 * Created by maoli on 16/10/8.
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
var Xzsxcgssz = require('./新增筛选成功受试者/MLXzsxcgssz')
var Xzsxssssz = require('./新增筛选失败受试者/MLXzsxsbssz')
var Qsjh = require('./取随机号/MLQsjh')
var Mhcx = require('./模糊查询/MLMhcx')
var Cysxlsfb = require('./查阅筛选例数分布/MLCxsxlsfb')

var PatientRM = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1' ){
            tableData.push('新增筛选成功受试者')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
            tableData.push('取随机号')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
            tableData.push('新增筛选失败受试者')
        }
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M1'){
            tableData.push('查阅筛选失败例数分布')
        }
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M1'){
            tableData.push('查阅随机例数分布')
        }
        if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M1'){
            tableData.push('查阅退出或者完成例数分布--整个研究')
        }
        if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1' ||
            Users.Users.UserFun == 'H4' || Users.Users.UserFun == 'H1'){
            tableData.push('模糊查询')
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
                <MLNavigatorBar title={'受试者随机'} isBack={true} backFunc={() => {
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
                if (rowData == '新增筛选成功受试者' ){
                    //设置数据
                    // 页面的切换
                    this.props.navigator.push({
                        component: Xzsxcgssz, // 具体路由的版块
                    });
                }else if (rowData == '新增筛选失败受试者' ){
                    //设置数据
                    // 页面的切换
                    this.props.navigator.push({
                        component: Xzsxssssz, // 具体路由的版块
                    });
                }else if (rowData == '取随机号'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Qsjh, // 具体路由的版块
                    });
                }else if (rowData == '模糊查询'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Mhcx, // 具体路由的版块
                    });
                }else if (rowData == '查阅筛选失败例数分布'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Cysxlsfb, // 具体路由的版块
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
module.exports = PatientRM;
