

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

var Ywhgsfp = require('./分配方案/MLYwhgsfp');
var Zgfp = require('./分配方案/MLZgfp');
var Qdfp = require('./分配方案/MLQdfp');
var Zgjhqdfp = require('./分配方案/MLZgjhqdfp');

var FenpeiCK = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        tableData.push('按药物号个数分配')
        tableData.push('逐个分配')
        tableData.push('区段分配')
        tableData.push('逐个结合区段分配')

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
                <MLNavigatorBar title={'分配到仓库'} isBack={true} backFunc={() => {
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
                // 页面的切换
                if (rowData == '按药物号个数分配'){
                    this.props.navigator.push({
                        component: Ywhgsfp, // 具体路由的版块
                    });
                }else if (rowData == '逐个分配'){
                    this.props.navigator.push({
                        component: Zgfp, // 具体路由的版块
                    });
                }else if (rowData == '区段分配'){
                    this.props.navigator.push({
                        component: Qdfp, // 具体路由的版块
                    });
                }else if (rowData == '逐个结合区段分配'){
                    this.props.navigator.push({
                        component: Zgjhqdfp, // 具体路由的版块
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
module.exports = FenpeiCK;


