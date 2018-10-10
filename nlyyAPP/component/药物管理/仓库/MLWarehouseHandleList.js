/**
 * Created by maoli on 16/10/9.
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
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var Changku = require('../../../entity/Changku');
//分配药物号
var XuanzheCKZX = require('./MLXuanzheCKZX');
var Dysywqd = require('./物流模块/MLDysywqd');
var Yszywqd = require('./物流模块/MLYszywqd');
var Ysdywqd = require('./物流模块/MLYsdywqd');
var Dqsywqd = require('./物流模块/MLDqsywqd');
var Yqsywqd = require('./物流模块/MLYqsywqd');
var WarehouseHandleList = React.createClass({
    getInitialState() {

        console.log(Changku.Changku)
        var tableData = [];

        //判断用户类别
        if (Changku.Changku.DepotGNYN == 1){
            tableData.push({title:'分配药物号',imageTitle:"th",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'待运送药物清单',imageTitle:"upload",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'运送中药物清单',imageTitle:"truck",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'已送达药物清单',imageTitle:"download",iconColor:'rgba(0,136,212,1.0)'})
        }else{
            tableData.push({title:'分配药物号',imageTitle:"th",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'待运送药物清单',imageTitle:"upload",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'运送中药物清单',imageTitle:"truck",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'已送达药物清单',imageTitle:"download",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'待签收药物清单',imageTitle:"pencil",iconColor:'rgba(0,136,212,1.0)'})
            tableData.push({title:'已签收药物清单',imageTitle:"heart",iconColor:'rgba(0,136,212,1.0)'})
        }

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
                <MLNavigatorBar title={Changku.Changku.DepotCity + '仓库'} isBack={true} backFunc={() => {
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
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                // 页面的切换
                console.log(rowData);
                if (rowData.title == "分配药物号"){
                    this.props.navigator.push({
                        component: XuanzheCKZX, // 具体路由的版块
                    });
                }else if (rowData.title == "待运送药物清单"){
                    this.props.navigator.push({
                        component: Dysywqd, // 具体路由的版块
                    });
                }else if (rowData.title == "运送中药物清单"){
                    this.props.navigator.push({
                        component: Yszywqd, // 具体路由的版块
                    });
                }else if (rowData.title == "已送达药物清单"){
                    this.props.navigator.push({
                        component: Ysdywqd, // 具体路由的版块
                    });
                }else if (rowData.title == "待签收药物清单"){
                    this.props.navigator.push({
                        component: Dqsywqd, // 具体路由的版块
                    });
                }else if (rowData.title == "已签收药物清单"){
                    this.props.navigator.push({
                        component: Yqsywqd, // 具体路由的版块
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

});

// 输出组件类
module.exports = WarehouseHandleList;
