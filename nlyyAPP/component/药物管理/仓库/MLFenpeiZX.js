

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ListView,
    Alert
} from 'react-native';

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');

var settings = require('./../../../settings');
var Ywhgsfp = require('./分配方案/MLYwhgsfp');
var Zgfp = require('./分配方案/MLZgfp');
var Qdfp = require('./分配方案/MLQdfp');
var Zgjhqdfp = require('./分配方案/MLZgjhqdfp');
var Znfp = require('./分配方案/MLZnfp');


var Ywqd = require('./MLYwqd');
var FPChangku = require('./保存数据/FPChangku');
var FPZhongxin = require('./保存数据/FPZhongxin');
var FPQDData = require('./保存数据/FPQDData');
var Changku = require('./../../../entity/Changku');

var FenpeiZX = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        tableData.push('智能分配')
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
                <MLNavigatorBar title={'分配到中心'} isBack={true} backFunc={() => {
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
                }else if (rowData == '智能分配'){
                    //发送网络请求
                    fetch(settings.fwqUrl + "/app/getZnfp", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            StudyID: Users.Users[0].StudyID,
                            Users : Users.Users[0],
                            Address : FPChangku.FPChangku == null ? FPZhongxin.FPZhongxin : FPChangku.FPChangku,
                            Type : FPChangku.FPChangku == null ? 2 : 1,
                            DepotGNYN : Changku.Changku == null ? 0 : Changku.Changku.DepotGNYN,//是否为主仓库:1是,0不是
                            DepotBrYN : Changku.Changku == null ? 0 : Changku.Changku.DepotBrYN,//是否为分仓库:1是,0不是
                            DepotId : Changku.Changku == null ? 0 : Changku.Changku.id,
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            this.setState({animating:false});
                            if (responseJson.isSucceed != 400){
                                //错误
                                Alert.alert(
                                    '提示:',
                                    responseJson.msg,
                                    null,
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }else {
                                this.setState({animating:false});
                                if (responseJson.data.length == 0){
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        '该中心没有随机成功的受试者',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }else{
                                    console.log(responseJson.data)
                                    FPQDData.FPQDData = responseJson.data
                                    // 页面的切换
                                    this.props.navigator.push({
                                        name:'分配清单',
                                        component: Ywqd, // 具体路由的版块
                                    });
                                }
                            }
                        })
                        .catch((error) => {//错误
                            this.setState({animating:false});
                            console.log(error),
                                //错误
                                Alert.alert(
                                    '提示:',
                                    '请检查您的网络111',
                                    [
                                        {text: '确定'}
                                    ]
                                )
                        });
                    {/*this.props.navigator.push({*/}
                        {/*component: Znfp, // 具体路由的版块*/}
                    {/*});*/}
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
module.exports = FenpeiZX;


