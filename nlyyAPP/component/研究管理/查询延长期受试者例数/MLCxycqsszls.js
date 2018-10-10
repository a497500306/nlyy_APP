
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


var Users = require('../../../entity/Users');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var study = require('../../../entity/study');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');

var Cxycqsszls = React.createClass({
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
        fetch(settings.fwqUrl + "/app/getYcqyjsszls", {
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
                this.setState({animating:false,text:responseJson.data});
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
                    <MLNavigatorBar title={'查询延长期受试者例数'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else {
            if (study.study.ExtStudYN == 0) {
                return (
                    <View style={styles.container}>
                        <MLNavigatorBar title={'查询延长期受试者例数'} isBack={true} backFunc={() => {
                            this.props.navigator.pop()
                        }} leftTitle={'首页'} leftFunc={()=>{
                            this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                        }}/>
                        <MLTableCell title={'无延长期研究'}/>
                    </View>
                );
            }else{
                return (
                    <View style={styles.container}>
                        <MLNavigatorBar title={'查询延长期受试者例数'} isBack={true} backFunc={() => {
                            this.props.navigator.pop()
                        }}/>
                        <MLTableCell title={this.state.text}/>
                    </View>
                );
            }
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
module.exports = Cxycqsszls;

