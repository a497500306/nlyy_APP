

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
var ZXDqsywqd = require('./MLZXDqsywqd');
var ZXYqsywqd = require('./MLZXYqsywqd');
var Ywhgl = require('./MLYwhgl')

var ResearchCore = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        tableData.push('待签收药物清单')
        tableData.push('已签收药物清单')
        tableData.push('药物号管理')

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
                <MLNavigatorBar title={'研究中心'} isBack={true} backFunc={() => {
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

        if (rowData == '待签收药物清单'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: ZXDqsywqd, // 具体路由的版块
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else if(rowData == '已签收药物清单'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: ZXYqsywqd, // 具体路由的版块
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }else if (rowData == '药物号管理'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Ywhgl, // 具体路由的版块
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
module.exports = ResearchCore;

