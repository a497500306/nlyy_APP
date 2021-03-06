

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

var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Changku = require('../../../entity/Changku');
var settings = require('../../../settings');
var WarehouseHandleList = require('./MLWarehouseHandleList');
var FPChangku = require('./保存数据/FPChangku');
var FPZhongxin = require('./保存数据/FPZhongxin');
var FengpeiCK = require('./MLFenpeiCK');

var CKTable = React.createClass({

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
            UserDepot : null
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        var UserDepot = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserDepot != null) {
                UserDepot = Users.Users[i].UserDepot
            }
        }
        this.setState({
            UserDepot : UserDepot
        })
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getFengWarehouse", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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

                    <MLNavigatorBar title={'选择仓库'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.cuowu == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择仓库'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择仓库'} isBack={true} backFunc={() => {
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
        if (rowData.DepotID == Changku.Changku.DepotID){
            return(
                <TouchableOpacity onPress={()=>{
                    //错误
                    Alert.alert(
                        '提示',
                        '这是你自己的仓库',
                        [
                            {text: '确定'}
                        ]
                    )
                }}>
                    <MLTableCell title={rowData.DepotName}/>
                </TouchableOpacity>
            )
        }else if  (rowData.DepotID != this.state.UserDepot){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    FPChangku.FPChangku = rowData;
                    FPZhongxin.FPZhongxin = null;
                    // 页面的切换
                    this.props.navigator.push({
                        component: FengpeiCK, // 具体路由的版块
                    });
                }}>
                    <MLTableCell title={rowData.DepotName}/>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity onPress={()=>{
                    //错误
                    Alert.alert(
                        '提示',
                        '这是你自己的仓库',
                        [
                            {text: '确定'}
                        ]
                    )
                }}>
                    <MLTableCell title={rowData.DepotName}/>
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
module.exports = CKTable;



