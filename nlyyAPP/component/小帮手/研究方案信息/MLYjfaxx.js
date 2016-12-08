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


var Yjfaxx = React.createClass({
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
                <MLNavigatorBar title={'研究方案信息'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ScrollView>
                    <Image style={{width:width , height:this.state.height}} source={[
                        {uri: settings.fwqUrl + "/" + Users.Users[0].StudyID + "YJFM.png", width: width, height: this.state.height}]}/>
                </ScrollView>
            </View>
        );
    },
    //耗时操作,网络请求
    componentDidMount(){
        Image.getSize(settings.fwqUrl + "/" + Users.Users[0].StudyID + "YJFM.png", (width1, height) => {
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
module.exports = Yjfaxx;

