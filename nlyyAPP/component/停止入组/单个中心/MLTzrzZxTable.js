

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
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Changku = require('../../../entity/Changku');
var settings = require('../../../settings');
var FPZhongxin = require('../../药物管理/仓库/保存数据/FPZhongxin');
var FPChangku = require('../../药物管理/仓库/保存数据/FPChangku');
var CytchwclsfbZX = require('../../受试者随机/查阅退出或完成例数分布/MLCytchwclsfbZX');
var DgzxSq = require('./MLDgzxSq');
var Cxzxywqk = require('../../药物管理/查询中心药物情况/MLCxzxywqk');

var TzrzZxTable = React.createClass({
    getDefaultProps(){
        return {
            pushType : null
        }
    },

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getTzrzSite", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserMP : Users.Users[0].UserMP,
                StudyID : Users.Users[0].StudyID
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:true});
                }else{
                    //ListView设置

                    var tableData = [];
                    for (var i = 0 ; i < responseJson.data.length ; i++){
                        var changku = responseJson.data[i];
                        tableData.push(changku)
                    }

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(tableData)});
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:false});
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '请检查您的网络',
                    null,
                    [
                        {text: '确定'}
                    ]
                )

            });
    },
    // getInitialState() {


    // },

    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.cuowu == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                if (this.props.pushType == null){
                    if (rowData.isStopIt == 1){
                        //错误
                        Alert.alert(
                            '提示',
                            '该中心已经停止入组',
                            [
                                {text: '确定'}
                            ]
                        )
                    }else{
                        //设置数据
                        FPZhongxin.FPZhongxin = rowData;
                        FPChangku.FPChangku = null;
                        // 页面的切换
                        this.props.navigator.push({
                            component: DgzxSq, // 具体路由的版块
                        });
                    }
                }else if (this.props.pushType == 1){
                    // 页面的切换
                    this.props.navigator.push({
                        component: CytchwclsfbZX, // 具体路由的版块
                        //传递参数
                        passProps:{
                            FPZhongxin:rowData
                        }
                    });
                }else if (this.props.pushType == 2){
                    //设置数据
                    // 页面的切换
                    this.props.navigator.push({
                        component: Cxzxywqk, // 具体路由的版块
                        //传递参数
                        passProps:{
                            FPZhongxin:rowData
                        }
                    });
                }
            }}>
                <MLTableCell title={rowData.SiteNam}  subTitle = {"中心编号:" + rowData.SiteID} subTitleColor = {'black'} />
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
module.exports = TzrzZxTable;



