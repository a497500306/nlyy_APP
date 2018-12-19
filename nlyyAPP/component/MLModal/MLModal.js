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
    Modal
} from 'react-native';


var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var noop = () => {};
var MLModal = React.createClass({
    getDefaultProps(){
        return {
            //输入框提示文字数组
            placeholders:[''],
            content : null,
            isVisible:true,
            value:'',
            //点击确定返回
            onClose: noop,
            quxiao: noop,
        }
    },
    getInitialState() {
        return {
            //点击确定返回
            isVisible:this.props.isVisible,
            titles:[],
            shurudijige:0
        }
    },

    render() {
        if (this.props.isVisible == true){
            return (
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                <View style={styles.container}>
                    <View style={styles.fudongViewStyle} onPress={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}>
                        {this.initInput()}
                        <View style={{
                            flexDirection:'row',
                            // 主轴的对齐方式
                            justifyContent:'flex-start',
                            // 垂直居中
                            alignItems:'center',
                            width:width - 40
                        }}>
                            <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getquxiao}>
                                <Text style={{color:'white',fontSize: 14}}>
                                    取 消
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getqueding}>
                                <Text style={{color:'white',fontSize: 14}}>
                                    确 定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                    </Modal>
            );
        }else {
            return (
                <View>

                </View>
            )
        }
    },
    initInput(){
      var inputs = [];
        for (var i = 0 ; i < this.props.placeholders.length ; i++){
            inputs.push(
                <View key={i + 'view'} style={{ borderBottomColor: 'gray', borderBottomWidth: 1, }}>
                    <TextInput style={styles.zhanghaoStyle}
                               textalign="center"
                               placeholder={this.props.placeholders[i]}
                               clearButtonMode="always"
                               defaultValue = {this.props.content == null ? '' : this.props.content}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                   //返回出去
                                   this.setState({
                                       titles:text
                                   })

                               }}//获取输入
                               key={i}
                    />
                </View>
            )
        }
        return inputs
    },
    //输入账号时
    onShuru(text){
        console.log(text);
    },
    //点击取消
    getquxiao(){
        var {
            quxiao,
        } = this.props;
        //返回出去
        quxiao();
    },
    //点击确定
    getqueding(){
        var {
            onClose,
        } = this.props;
        if (this.state.titles.length != 0){
            //返回出去
            onClose(this.state.titles);
        }else if (this.props.content == null){
            //返回出去
            onClose(this.state.titles);
        }else{
            //返回出去
            onClose(this.props.content);
        }
        this.setState({
            isVisible:false,
            titles : ''
        })
    }
});


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent:'center',
        flex:1,
        right:0,
        bottom:0,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    fudongViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width:width - 40,
        backgroundColor:'white',
        // 设置圆角
        borderRadius:5,
    },
    zhanghaoStyle: {
        width:width - 80,
        height: 40,
        marginTop:20,
        marginLeft:20,
        backgroundColor:'white',
        paddingLeft:10,
        fontSize: 14,
        // 设置圆角
        borderRadius:5,
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:(width - 20-20-20-20-20)/2,
        marginTop:20,
        marginBottom:20,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
    },
});

// 输出组件类
module.exports = MLModal;


