/**
 * Created by maoli on 16/9/25.
 */
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
    Image,
    TouchableOpacity,
    Platform,
    Switch
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

var MLTableCell = React.createClass({

    getDefaultProps(){
        return{
            iconTitl:'',//左侧图标
            iconColor:null,//左侧图标
            title: '',  // 主标题
            subTitle:'',//副标题
            subTitleColor:'red',//副标题文字颜色
            rightTitle: '',//右侧文字
            rightTitleColor: 'red',//右侧文字颜色
            isArrow:true,//是否显示箭头
            cellHeight : 54,
            data:null, //数据
        }
    },

    render() {
        return (
                <View style={[styles.container,{minHeight:this.props.cellHeight}]}>
                    <View>
                        {/*左边图标*/}
                        {this.renderLeftIcon()}
                        {/*左边文字*/}
                        {this.renderLeftText()}
                    </View>
                    <View style={{marginLeft:20, flexDirection : "row"}}>
                        {/*设置右边文字*/}
                        {this.renderRightText()}
                        {/*设置箭头*/}
                        {this.renderRightView()}
                    </View>
                </View>
        );
    },

    //设置左边图标
    renderLeftIcon(){
        if (this.props.iconTitl != ''){
            return(
                <Icon name={this.props.iconTitl} size={20} color={this.props.iconColor} style={{position:'absolute', left:10, bottom:17}}/>
            )
        }
    },

    //设置左边两行文字
    renderLeftText(){
        if (this.props.iconTitl != ''){
            if (this.props.subTitle != ''){
                return(
                    <View style={{marginLeft:40,marginTop:10,marginBottom:10}}>
                        <Text  numberOfLines={10} style={{color:"black"}}>
                            {this.props.title}
                        </Text>
                        <Text numberOfLines={10} style={[{marginTop:Platform.OS == 'ios' ? 5: 0},{color:this.props.subTitleColor}]}>
                            {this.props.subTitle}
                        </Text>
                    </View>
                )
            }else {
                return(
                    <View style={{marginLeft:40,marginTop:10,marginBottom:10}}>
                        <Text numberOfLines={10} style={{color:"black"}}>
                            {this.props.title}
                        </Text>
                    </View>
                )
            }
        }else{
            if (this.props.subTitle != ''){
                return(
                    <View style={{marginLeft:10,marginTop:10,marginBottom:10}}>
                        <Text  numberOfLines={10} style={{color:"black"}}>
                            {this.props.title}
                        </Text>
                        <Text  numberOfLines={10} style={[{marginTop:Platform.OS == 'ios' ? 5: 0},{color:this.props.subTitleColor}]}>
                            {this.props.subTitle}
                        </Text>
                    </View>
                )
            }else {
                return(
                    <View style={{marginLeft:10,marginTop:10,marginBottom:10}}>
                        <Text  numberOfLines={10} style={{color:"black"}}>
                            {this.props.title}
                        </Text>
                    </View>
                )
            }
        }
    },

    //设置右边文字
    renderRightText(){
        return(
            <View style={{justifyContent:'center', right:15 ,maxWidth:width/2.0}}>
                <Text 
                numberOfLines={10}
                style={{color:this.props.rightTitleColor,textAlign:'right',fontSize:13,backgroundColor:'rgba(0,0,0,0)'}}>
                    {this.props.rightTitle}
                </Text>
            </View>
        )
    },

    //设置右边箭头
    renderRightView(){
        if (this.props.isArrow == true){
            return(
                <Icon name="angle-right" size={30} color='rgba(191,191,191,1.0)' style={{justifyContent:'center', right:10}}/>
            )
        }
    }
});

const styles = StyleSheet.create({
    container:{
        
        backgroundColor:'white',
        borderBottomColor:'#dddddd',
        borderBottomWidth:0.5,

        flexDirection:'row',
        // 主轴的对齐方式
        justifyContent:'space-between',
        // 垂直居中
        alignItems:'center',
        width:width
    }
});

// 输出组件类
module.exports = MLTableCell;
