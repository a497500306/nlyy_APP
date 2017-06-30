/**
 * Created by Rolle on 2017/5/25.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity
} from 'react-native';

import MLPhotoView from '../../MLPhotoView/MLPhotoView';

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var MLMoKuaiUpdate = require('../模块上传/MLMoKuaiUpdate');

var MLImagesList = React.createClass({
    getInitialState() {

        var tableData = [];

        //判断用户类别
        tableData.push('页码上传')
        tableData.push('模块上传')

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData)
        }
    },

    render() {
        // console.log('更新属性' + this.props.initialProps.weChatUser + "123")
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'图片资料管理'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData){
        if (rowData == "页码上传") {
            return (
                <TouchableOpacity onPress={()=> {
                    // 页面的切换
                    this.props.navigator.push({
                        component: MLPhotoView, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                        //传递参数
                        passProps: {
                            //出生年月
                            imageUrl: 'http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png'
                        }
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={()=> {
                    // 页面的切换
                    this.props.navigator.push({
                        component: MLMoKuaiUpdate, // 具体路由的版块
                    });
                }}>
                    <MLTableCell title={rowData}/>
                </TouchableOpacity>
            )
        }
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLImagesList;