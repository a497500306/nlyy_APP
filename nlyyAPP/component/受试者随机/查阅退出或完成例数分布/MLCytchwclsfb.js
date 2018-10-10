
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
    ScrollView,
    Alert

} from 'react-native';

import Echarts from 'native-echarts';
import Chart from 'react-native-chart';

var Users = require('../../../entity/Users');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var option = {
    title: {
        text: 'ECharts demo'
    },
    tooltip: {},
    legend: {
        data:['中心人数']
    },
    xAxis: {
        data: ['01','02','03']
    },
    yAxis: {},
    series: [{
        name: '中心人数',
        type: 'bar',
        data: [1, 0, 10]
    }]
};
const data = [
    [0, 3],
    [1, 5],
    [3, 10],
];
var Cytchwclsfb = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            animating: true,//是否显示菊花
            data:[],
            width:0,
            option:null
        }
    },
    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getCytchwclsfb", {
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
                console.log(responseJson.data)
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{

                    var xAxis = [];
                    var series = [];
                    for (var i = 0 ; i < responseJson.data.length ; i++){
                        xAxis.push(responseJson.data[i][0]);
                        series.push(responseJson.data[i][1])
                    }
                    option = {
                        title: {
                            text: '退出或完成例数分布'
                        },
                        tooltip: {},
                        legend: {
                            data:['中心人数']
                        },
                        xAxis: {
                            data: xAxis
                        },
                        yAxis: {},
                        series: [{
                            name: '人数',
                            type: 'bar',
                            data: series
                        }]
                    }

                    if (((width - 20)/responseJson.data.length) < 40){

                        this.setState({animating:false,data:responseJson.data, width: 40});
                    }else{
                        this.setState({animating:false, data:responseJson.data, width: ((width - 20 )/responseJson.data.length)});
                    }
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '提示:',
                    '请检查您的网络',
                    [
                        {text: '确定'}
                    ]
                )

            });
    },

    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'退出或完成例数分布'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else {
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'退出或完成例数分布'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    <ScrollView showsHorizontalScrollIndicator = {true} horizontal={true} style={{height: 300}}>
                        <View style={{height: 300,width:option.series[0].data.length < 10 ? width : option.series[0].data.length * 40}}>
                            <Echarts option={option} height={300} width={option.series[0].data.length < 10 ? width : option.series[0].data.length * 40}/>
                        </View>
                        {/*<Chart*/}
                        {/*showYAxisLabels={false}*/}
                        {/*showGrid={false}*/}
                        {/*yAxisShortLabel = {true}*/}
                        {/*style={{*/}
                        {/*width: this.state.data.length * this.state.width,*/}
                        {/*height: 200,*/}
                        {/*marginTop:80*/}
                        {/*}}*/}
                        {/*data={this.state.data}*/}
                        {/*type="bar"*/}
                        {/*showDataPoint={false}*/}
                        {/*/>*/}
                    </ScrollView>
                </View>
            );
        }
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
    },
});

// 输出组件类
module.exports = Cytchwclsfb;

