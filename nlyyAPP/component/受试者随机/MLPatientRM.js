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


var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
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
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1' ){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '新增筛选成功受试者'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'新增筛选成功受试者',imageTitle:"user-plus",iconColor:'rgba(0,136,212,1.0)'})
                }
                // if (tableData.indexOf({title:'受试者随机',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'}) == -1){
                //     tableData.push({title:'受试者随机',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'})
                // }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '取随机号'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'取随机号',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'})
                }
                // if (tableData.indexOf({title:'药物管理',imageTitle:"medkit",iconColor:'rgba(0,136,212,1.0)'}) == -1){
                //     tableData.push({title:'药物管理',imageTitle:"medkit",iconColor:'rgba(0,136,212,1.0)'})
                // }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '新增筛选失败受试者'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'新增筛选失败受试者',imageTitle:"user-times",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H1' || data.UserFun == 'M1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '查阅筛选失败例数分布'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'查阅筛选失败例数分布',imageTitle:"bar-chart",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H1' || data.UserFun == 'M1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '查阅随机例数分布'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'查阅随机例数分布',imageTitle:"bar-chart",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H1' || data.UserFun == 'M1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '查阅退出或者完成例数分布'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'查阅退出或者完成例数分布',imageTitle:"bar-chart",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1' ||
                data.UserFun == 'H4' || data.UserFun == 'H1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '模糊查询'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'模糊查询',imageTitle:"search",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
        }
        // var tableData = [];
        //
        // //判断用户类别
        // if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1' ){
        //     tableData.push({title:'新增筛选成功受试者',imageTitle:"user-plus",iconColor:'rgba(0,136,212,1.0)'})
        // }
        // if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
        //     tableData.push({title:'取随机号',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'})
        // }
        // if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1'){
        //     tableData.push({title:'新增筛选失败受试者',imageTitle:"user-times",iconColor:'rgba(0,136,212,1.0)'})
        // }
        // if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M1'){
        //     tableData.push({title:'查阅筛选失败例数分布',imageTitle:"bar-chart",iconColor:'rgba(0,136,212,1.0)'})
        // }
        // if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M1'){
        //     tableData.push({title:'查阅随机例数分布',imageTitle:"bar-chart",iconColor:'rgba(0,136,212,1.0)'})
        // }
        // if (Users.Users.UserFun == 'H1' || Users.Users.UserFun == 'M1'){
        //     tableData.push({title:'查阅退出或者完成例数分布',imageTitle:"bar-chart",iconColor:'rgba(0,136,212,1.0)'})
        // }
        // if (Users.Users.UserFun == 'H2' || Users.Users.UserFun == 'H3' || Users.Users.UserFun == 'S1' ||
        //     Users.Users.UserFun == 'H4' || Users.Users.UserFun == 'H1'){
        //     tableData.push({title:'模糊查询',imageTitle:"search",iconColor:'rgba(0,136,212,1.0)'})
        // }

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData : tableData,
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
                    pageSize={this.state.tableData.length}
                    contentContainerStyle={styles.list}
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                    showsVerticalScrollIndicator={false}
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
                if (rowData.title == '新增筛选成功受试者' ){
                    //设置数据
                    // 页面的切换
                    this.props.navigator.push({
                        component: Xzsxcgssz, // 具体路由的版块
                    });
                }else if (rowData.title == '新增筛选失败受试者' ){
                    //设置数据
                    // 页面的切换
                    this.props.navigator.push({
                        component: Xzsxssssz, // 具体路由的版块
                    });
                }else if (rowData.title == '取随机号'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Qsjh, // 具体路由的版块
                    });
                }else if (rowData.title == '模糊查询'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Mhcx, // 具体路由的版块
                    });
                }else if (rowData.title == '查阅筛选失败例数分布'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Cysxlsfb, // 具体路由的版块
                    });
                }
            }}>
                <View>
                    <View style={styles.row}>
                        <Icon name={rowData.imageTitle} size={60} color={rowData.iconColor} style={styles.thumb}/>
                        <Text style={styles.text}>
                            {rowData.title}
                        </Text>
                    </View>
                </View>
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
    thumb: {
        width: 70,
        height: 65
    },
    text: {
        flex: 1,
        marginTop: 15,
        fontWeight: 'bold',
        marginBottom:15,
    },
    row: {
        justifyContent: 'center',
        padding: 5,
        width: width/2,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC'
    },
    list: {
        alignItems:'flex-start',
        width:width,
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
});

// 输出组件类
module.exports = PatientRM;
