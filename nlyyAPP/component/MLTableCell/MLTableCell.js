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
            title: '',  // 主标题
            subTitle:'',//副标题
            rightTitle: '',//右侧文字
            isArrow:true,//是否显示箭头
            cellHeight : 40,
            data:null, //数据
        }
    },

    render() {
        return (
                <View style={styles.container}>
                    {/*左边图标*/}
                    {this.renderLeftIcon()}
                    {/*左边文字*/}
                    {this.renderLeftText()}
                    {/*设置右边文字*/}
                    {this.renderRightText()}
                    {/*设置箭头*/}
                    {this.renderRightView()}
                </View>
        );
    },

    //设置左边图标
    renderLeftIcon(){
        if (this.props.iconTitl != ''){
            return(
                <Icon name="angle-left" size={30} color="#900" style={{position:'absolute', left:10, bottom:7}}/>
            )
        }
    },

    //设置左边两行文字
    renderLeftText(){
        if (this.props.subTitle != ''){
            return(
                <View style={{marginLeft:30}}>
                    <Text >
                        {this.props.title}
                    </Text>
                    <Text style={{marginTop:Platform.OS == 'ios' ? 5: 0}}>
                        {this.props.subTitle}
                    </Text>
                </View>
            )
        }else {
            return(
                <View style={{marginLeft:30}}>
                    <Text>
                        {this.props.title}
                    </Text>
                </View>
            )
        }
    },

    //设置右边文字
    renderRightText(){
        return(
            <View style={{position:'absolute', right:30, top:16}}>
                <Text>
                    {this.props.rightTitle}
                </Text>
            </View>
        )
    },

    //设置右边箭头
    renderRightView(){
        if (this.props.isArrow == true){
            return(
                <Icon name="angle-right" size={30} color='rgba(191,191,191,1.0)' style={{position:'absolute', right:10, bottom:7}}/>
            )
        }
    }
});

const styles = StyleSheet.create({
    container:{
        height:44,
        backgroundColor:'white',
        borderBottomColor:'#dddddd',
        borderBottomWidth:0.5,

        flexDirection:'row',
        // 主轴的对齐方式
        justifyContent:'flex-start',
        // 垂直居中
        alignItems:'center'
    }
});

// 输出组件类
module.exports = MLTableCell;
