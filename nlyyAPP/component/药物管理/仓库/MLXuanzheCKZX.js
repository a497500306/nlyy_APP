

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
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
//分仓库列表
var CKTable = require('./MLCKTable');
//中心列表
var ZXTable = require('./MLZXTable');

var XuanzheCKZX = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        tableData.push('到分仓库')
        tableData.push('到中心')

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
                <MLNavigatorBar title={'选择分配到'} isBack={true} backFunc={() => {
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
        return(
            <TouchableOpacity onPress={()=>{
                //设置数据
                if (rowData == '到分仓库'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: CKTable, // 具体路由的版块
                    });
                }else if(rowData == '到中心'){
                    // 页面的切换
                    this.props.navigator.push({
                        component: ZXTable, // 具体路由的版块
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
module.exports = XuanzheCKZX;

