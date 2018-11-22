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
    Alert,
    Platform,
    DatePickerAndroid,
    DatePickerIOS,
    Modal
} from 'react-native';

import Echarts from 'native-echarts';
import Chart from 'react-native-chart';

var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
var netTool = require('../../../kit/net/netTool'); //网络请求
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
var Cysxlsfb = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            animating: true,//是否显示菊花
            data:[],
            width:0,
            option:null,
            startModalVisible:false,
            endModalVisible:false,
            startingDate: null,
            endDate: null,
        }
    },
    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getCysjlsfb", {
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
                    var labelOption = {
                        normal: {
                            show:true,
                            rotate: 90,
                            align: 'left',
                            verticalAlign: 'middle',
                            position: 'top',
                            distance: 8
                        }
                    };
                    option = {
                        title: {
                            text: '查阅随机例数分布'
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
                            barGap:0,
                            label:labelOption,
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
                    <MLNavigatorBar title={'查阅随机例数分布'} isBack={true} backFunc={() => {
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
                    <MLNavigatorBar title={'查阅随机例数分布'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ScrollView showsHorizontalScrollIndicator = {true} horizontal={true} style={{height: 300}}>
                        <View style={{height: 300,width:option.series[0].data.length < 10 ? width : option.series[0].data.length * 40}}>
                            <View style = {{
                                height : 44,
                                left : 8,
                                justifyContent : 'center'
                            }}><Text style={{
                                fontSize : 18,
                                fontWeight: 'bold'
                            }}>选择查询日期</Text></View>
                            <View style = {{flexDirection : 'row', justifyContent:'space-around' , alignItems : 'center', width : width , height : 44}}>
                                <TouchableOpacity onPress={this.getStartDate}>
                                    <Text style = {{color : 'rgba(0,136,212,1.0)' , fontSize : 15}}>{this.state.startingDate == null ? '开始时间' : this.state.startingDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                <Text style = {{color : 'gray' , fontSize : 15}}>至</Text>
                                <TouchableOpacity onPress={this.getEndDate}>
                                    <Text style = {{color : 'rgba(0,136,212,1.0)' , fontSize : 15}}>{this.state.endDate == null ? '结束时间' : this.state.endDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getQuery}>
                                <Text style={{color:'white',fontSize: 14}}>
                                    查 询
                                </Text>
                            </TouchableOpacity>
                            
                            <Echarts option={option} height={300} width={option.series[0].data.length < 10 ? width : option.series[0].data.length * 40}/>
                            <Modal visible={this.state.startModalVisible} transparent={true}>
                                <View style={[styles.container,{justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.5)'}]}>
                                    <View style={{backgroundColor:'white'}}>
                                        <DatePickerIOS
                                            date={this.state.startingDate}
                                            maximumDate={new Date()}
                                            mode={'date'}
                                            onDateChange={this.setStartDate}
                                        />
                                        <TouchableOpacity style={[styles.dengluBtnStyle]} onPress={this.getChooseOK}>
                                            <Text style={{color:'white',fontSize: 14}}>
                                                确 定
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.dengluBtnStyle]} onPress={this.getCancel}>
                                            <Text style={{color:'white',fontSize: 14}}>
                                                取 消
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal visible={this.state.endModalVisible} transparent={true}>
                                <View style={[styles.container,{justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.5)'}]}>
                                    <View style={{backgroundColor:'white'}}>
                                        <DatePickerIOS
                                            date={this.state.endDate}
                                            maximumDate={new Date()}
                                            mode={'date'}
                                            onDateChange={this.setEndDate}
                                        />
                                        <TouchableOpacity style={[styles.dengluBtnStyle]} onPress={this.getChooseOK}>
                                            <Text style={{color:'white',fontSize: 14}}>
                                                确 定
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.dengluBtnStyle]} onPress={this.getCancel}>
                                            <Text style={{color:'white',fontSize: 14}}>
                                                取 消
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    },

    //查询
    getQuery(){

        Toast.loading('请稍候...',60);
        netTool.post(settings.fwqUrl +"/app/getNewCysjlsfb",{StudyID : Users.Users[0].StudyID,startDate:this.state.startDate,endDate:this.state.endDate})
        .then((responseJson) => {
            Toast.hide()
            console.log(内容)
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
                var labelOption = {
                    normal: {
                        show:true,
                        rotate: 90,
                        align: 'left',
                        verticalAlign: 'middle',
                        position: 'top',
                        distance: 8
                    }
                };
                option = {
                    title: {
                        text: '查阅随机例数分布'
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
                        barGap:0,
                        label:labelOption,
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
        .catch((error)=>{
            Toast.hide()
        })
    },

    //开始时间
    getStartDate(){
        if (Platform.OS == "ios"){
            this.setState({
                startModalVisible : true,
                startingDate: new Date()
            })
        }else{
            
        }
    },

    //结束时间
    getEndDate(){
        if (Platform.OS == "ios"){
            this.setState({
                endModalVisible : true,
                endDate: new Date()
            })
        }else{
            
        }
    },

    //选择确定
    getChooseOK(){
        this.setState({
            startModalVisible : false,
            endModalVisible : false,
        })
    },

    //取消选择
    getCancel(){
        this.setState({
            startModalVisible : false,
            endModalVisible : false,
        })
    },

    //选中开始的时间
    setStartDate(newDate){
        this.setState({startingDate: newDate})
    },

    //选中结束的时间
    setEndDate(newDate){
        this.setState({endDate: newDate})
    }

});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginBottom:20,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
    }
});

// 输出组件类
module.exports = Cysxlsfb;

