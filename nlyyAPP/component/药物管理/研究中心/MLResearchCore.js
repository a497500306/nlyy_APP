

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
var ZXDqsywqd = require('./MLZXDqsywqd');
var ZXYqsywqd = require('./MLZXYqsywqd');
var Ywhgl = require('./MLYwhgl')

var ResearchCore = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别

        tableData.push({title:'待签收药物清单',imageTitle:"pencil",iconColor:'rgba(0,136,212,1.0)'})
        tableData.push({title:'已签收药物清单',imageTitle:"heart",iconColor:'rgba(0,136,212,1.0)'})
        tableData.push({title:'药物号管理',imageTitle:"th",iconColor:'rgba(0,136,212,1.0)'})

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
                <MLNavigatorBar title={'研究中心'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
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

        if (rowData.title == '待签收药物清单'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: ZXDqsywqd, // 具体路由的版块
                    });
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
        }else if(rowData.title == '已签收药物清单'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: ZXYqsywqd, // 具体路由的版块
                    });
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
        }else if (rowData.title == '药物号管理'){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    console.log(Users.Users)
                    // 页面的切换
                    this.props.navigator.push({
                        component: Ywhgl, // 具体路由的版块
                    });
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
});

// 输出组件类
module.exports = ResearchCore;

