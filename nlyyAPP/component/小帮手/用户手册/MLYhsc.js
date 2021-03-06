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
    Image
} from 'react-native';


var Users = require('../../../entity/Users');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');


var Yhsc = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            animating: true,//是否显示菊花
            data:[],
            width:0,
            height:0
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'用户手册'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ScrollView>
                    <Image style={{width:width , height:this.state.height}} source={[
                        {uri: settings.fwqUrl + "/" + Users.Users[0].StudyID + "YHSC.png", width: width, height: this.state.height}]}/>
                </ScrollView>
            </View>
        );
    },
    //耗时操作,网络请求
    componentDidMount(){
        Image.getSize(settings.fwqUrl + "/" + Users.Users[0].StudyID + "YHSC.png", (width1, height) => {
            var i = 0 ;
            i = width1/width;
            this.setState({height:height/i})
        });
    }
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
module.exports = Yhsc;

