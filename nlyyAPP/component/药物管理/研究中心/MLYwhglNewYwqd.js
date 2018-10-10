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
    ListView,
    Alert
} from 'react-native';


var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var Users = require('../../../entity/Users');
var settings = require('../../../settings');
var Changku = require('../../../entity/Changku');
var NewYwqd = require('../仓库/MLNewYwqd');
var ZXNewYwqd = require('./MLZXNewYwqd');
var FPQDData = require('../仓库/保存数据/FPQDData');


var ZXYqsywqd = React.createClass({
    //初始化设置
    getDefaultProps(){
        return {
            data : null,
        }
    },
    getInitialState() {

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(this.props.data.drugs)
        }
    },
    render() {
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'已签收药物清单'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
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
        return(
            <TouchableOpacity onPress={()=>{
                //错误
                Alert.alert(
                    '提示:',
                    '请先签收',
                    [
                        {text: '确定'}
                    ]
                )
            }}>
                <MLTableCell title={rowData.DrugNum}/>
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
module.exports = ZXYqsywqd;
