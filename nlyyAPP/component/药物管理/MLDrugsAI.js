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
    Image
} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../entity/Users');
var MLTableCell = require('../MLTableCell/MLTableCell');
var PatientRM = require('../受试者随机/MLPatientRM');
var ResearchCore = require('./研究中心/MLResearchCore');
var Warehouse = require('./仓库/MLWarehouse');
var users = require('../../entity/Users');
var Cxzxywqk = require('./查询中心药物情况/MLCxzxywqk');
var CxywhSR = require('./查询药物号/MLCxywhSR');
var bcywh = require('./补充药物号/MLBcywh');
var qyhls = require('./取药号历史/MLQyhls');
var xzzx = require('../停止入组/单个中心/MLTzrzZxTable');

var DrugsAI = React.createClass({
    getInitialState() {


        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            //判断用户类别
            if (data.UserFun == 'M6'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '仓库'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'仓库',imageTitle:"database",iconColor:'rgba(0,136,212,1.0)'})
                }
                // if (tableData.indexOf({title:'受试者随机',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'}) == -1){
                //     tableData.push({title:'受试者随机',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'})
                // }
            }
            if (data.UserFun == 'H4'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '研究中心'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'研究中心',imageTitle:"hospital-o",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'M1' || data.UserFun == 'H4' ||
                data.UserFun == 'M6' || data.UserFun == 'M7' ){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '查询中心药物情况'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'查询中心药物情况',imageTitle:"search",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H4' || data.UserFun == 'M6' ||
                data.UserFun == 'M7'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '查询药物号'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'查询药物号',imageTitle:"search",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '补充药物号'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'补充药物号',imageTitle:"male",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' || data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '取药物号历史'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'取药物号历史',imageTitle:"list-alt",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
        }

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData:tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData)
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'药物管理'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ListView
                    removeClippedSubviews={false}
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
        if (rowData.title == "补充药物号"){
            return (
                <TouchableOpacity onPress={()=> {
                    //设置数据
                    // 页面的切换
                    this.props.navigator.push({
                        component: bcywh, // 具体路由的版块
                    });
                }}>
                    <View>
                        <View style={styles.row}>
                            <Image
                                style={{width: 65, height: 65}}
                                source={require('../../images/drug.png')}
                            />
                            <Text style={styles.text}>
                                {rowData.title}
                            </Text>
                        </View>
                    </View>
                    {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity onPress={()=>{
                    if(rowData.title == "仓库") {
                        console.log(users);
                        //设置数据
                        // 页面的切换
                        this.props.navigator.push({
                            component: Warehouse, // 具体路由的版块
                        });
                    }
                    if(rowData.title  == "研究中心") {
                        //设置数据
                        // 页面的切换
                        this.props.navigator.push({
                            component: ResearchCore, // 具体路由的版块
                        });
                    }
                    if (rowData.title  == '查询中心药物情况'){
                        // 页面的切换
                        this.props.navigator.push({
                            component: xzzx, // 具体路由的版块
                            //传递参数
                            passProps:{
                                pushType:2
                            }
                        });

                    }
                    if (rowData.title  == '查询药物号'){
                        //设置数据
                        // 页面的切换
                        this.props.navigator.push({
                            component: CxywhSR, // 具体路由的版块
                        });
                    }
                    if (rowData.title  == '取药物号历史'){
                        //设置数据
                        // 页面的切换
                        this.props.navigator.push({
                            component: qyhls, // 具体路由的版块
                        });
                    }
                }}>
                    <View>
                        <View style={styles.row}>
                            <Icon name={rowData.imageTitle} size={60} color={rowData.iconColor} style={styles.thumb}/>
                            <Text style={styles.text}
                                  numberOfLines={1}>
                                {rowData.title}
                            </Text>
                        </View>
                    </View>
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
    thumb: {
        width: 65,
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
        // justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});

// 输出组件类
module.exports = DrugsAI;
