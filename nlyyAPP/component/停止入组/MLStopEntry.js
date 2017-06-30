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
var Dgzx = require('./单个中心/MLDgzx')
var Zgyj = require('./整个研究/MLZgyj')

var StopEntry = React.createClass({
    getInitialState() {

        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            if (data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1' || data.UserFun == 'M7' ||
                data.UserFun == 'M1' || data.UserFun == 'C1' || data.UserFun == 'H1'){
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
            //判断用户类别
            if (data.UserFun == 'M1' || data.UserFun == 'H1' ||
                data.UserFun == 'M4' || data.UserFun == 'M2' ||
                data.UserFun == 'M3' || data.UserFun == 'C1'){
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
                <MLNavigatorBar title={'停止入组'} isBack={true} backFunc={() => {
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
                if (rowData == '单个中心'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Dgzx, // 具体路由的版块
                    });
                }
                if (rowData == '整个研究'){
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Zgyj, // 具体路由的版块
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
module.exports = StopEntry;
