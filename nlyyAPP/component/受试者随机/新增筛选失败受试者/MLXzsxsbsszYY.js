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
    TextInput,
    ActivityIndicator,
    Alert,
    ListView,
} from 'react-native';


import  {DeviceEventEmitter} from 'react-native';//通知

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var ExcludeStandard = require('../../../entity/ExcludeStandard');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
import Icon from 'react-native-vector-icons/FontAwesome';

var XzsxsbsszYY = React.createClass({
    //初始化设置
    getInitialState() {

        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        var tableData = ExcludeStandard.ExcludeStandard
        return {
            tableData:tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            animating: false,//是否显示菊花
            title:'确 定',
            xuanzhongData:[]
        }
    },


    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'选择入排标准'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                    <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                        {this.state.title}
                    </Text>
                    <ActivityIndicator
                        animating={this.state.animating}
                        style={[styles.centering, {height: 30}]}
                        size="small"
                        color="white"
                    />
                </TouchableOpacity>
            </View>

        );
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        if (this.state.tableData[rowID].isSelected == true){
            return(
                <TouchableOpacity onPress={()=>{
                    this.state.tableData[rowID].isSelected = !this.state.tableData[rowID].isSelected
                    console.log('取消添加' + this.state.tableData[rowID].isSelected)

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //把id从数组中拿出来
                    console.log(this.state.tableData[rowID].id)
                    var jj = 0;
                    for(var i = 0 ; i < this.state.xuanzhongData.length ; i++){
                        if (this.state.xuanzhongData[i].id == this.state.tableData[rowID].id){
                            this.state.xuanzhongData.splice(i,1);
                        }
                    }
                    if (this.state.xuanzhongData.length == 0){
                        this.state.title = '确 定'
                    }else{
                        this.state.title = '确 定( ' + this.state.xuanzhongData.length + ' )'
                    }

                    console.log(this.state.xuanzhongData)
                }}>
                    <View style={{
                        backgroundColor : 'white',
                        flexDirection:'row',
                        // 主轴的对齐方式
                        justifyContent:'flex-start',
                        // 垂直居中
                        alignItems:'center',
                        width:width,
                    }}>
                        <Icon name={'check'} size={20} color={'rgba(0,136,212,1.0)'} style={{marginLeft:10}}/>
                        <Text style={{marginLeft:10,marginBottom:10,marginTop:10,marginRight:10,
                            width:width-40,}}>{rowData.IETest}</Text>
                    </View>
                </TouchableOpacity>
            )
        }else{
            this.state.tableData[rowID].isSelected = false;
            return(
                <TouchableOpacity onPress={()=>{
                    this.state.tableData[rowID].isSelected = !this.state.tableData[rowID].isSelected
                    console.log('添加进去' + this.state.tableData[rowID].isSelected)

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //把id添加到数组中
                    this.state.xuanzhongData.push(this.state.tableData[rowID])
                    console.log(this.state.xuanzhongData)
                    this.state.title = '确 定( ' + this.state.xuanzhongData.length + ' )'
                }}>

                    <View style={{backgroundColor : 'white'}}>
                        <Text style={{margin:10}}>{rowData.IETest}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    },

    //点击确定
    getLogin(){
        //发送通知
        DeviceEventEmitter.emit('changeAvatar',this.state.xuanzhongData);
        this.props.navigator.pop()
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginTop:10,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
        marginBottom:10
    },
});

// 输出组件类
module.exports = XzsxsbsszYY;

