
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ScrollView,
    Alert
} from 'react-native';
//时间操作
var moment = require('moment');
moment().format();

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');

var Djmckjd = React.createClass({
    getInitialState() {
        return {
            //ListView设置
            animating: true
        }
    },
    getDefaultProps(){
        return {
            datas : null,
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'查看进度'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ScrollView>
                    {/*设置箭头*/}
                    {this.tableCell()}
                </ScrollView>
            </View>

        );
    },
    tableCell(){
        var cells = []
        for (var i = this.props.datas.UnblindingProcess.length ; i >= 0 ; i--){
            var str =  this.props.datas.UnblindingProcess[i]
            if (i != this.props.datas.UnblindingProcess.length){
                cells.push(
                    <View key={i + '.' + 5} style={styles.zongView}>
                        <View key={i + '.' + 1} style={styles.xiantiaoViewStyle}>
                            <View key={i + '.' + 2} style={{flex: 1,marginLeft:20,width: 2, height: 50,backgroundColor: 'rgba(183,183,183,1.0)'}}/>
                            <View key={i + '.' + 3} style={{position:'absolute', left:18, top:12,width: 6,borderRadius:2.5, height: 6,backgroundColor: 'rgba(183,183,183,1.0)'}} />
                            {/*<View key={key + j + '.' + 4} style={{marginLeft:20,width: 2, height: 150,backgroundColor: 'steelblue'}}/>*/}
                        </View>
                        <View key={i + '.' + 8} style={{backgroundColor: 'white',width: width - 42}}>
                            <Text key={i + '.' + 6} style={{marginTop:10,fontSize: 16,}}>{str}</Text>
                            <Text key={i + '.' + 7} style={{color: 'rgba(183,183,183,1.0)',marginTop:6,fontSize: 12,}}>
                                {moment(this.props.datas.UnblindingProcessDates[i]).format('YYYY-MM-DD HH:mm:ss')}</Text>
                            <View key={i + '.' + 9} style={{backgroundColor: 'rgba(244,244,244,1.0)',marginTop:10,width: width - 42,height: 1}}/>
                        </View>
                    </View>
                )
            }
        }
        return cells;
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
    },
    xiantiaoViewStyle:{
        width: 42,
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    zongView: {
        backgroundColor: 'white',
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center'
    }
});

// 输出组件类
module.exports = Djmckjd;
