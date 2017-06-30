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
    Modal,
    ListView
} from 'react-native';


var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../MLTableCell/MLTableCell');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var noop = () => {};
var selectionMLModal = React.createClass({
    getDefaultProps(){
        return {
            tableData: [],
            //输入框提示文字数组
            placeholders:[''],
            isVisible:true,
            //点击确定返回
            onClose: noop,
            quxiao: noop,
        }
    },
    getInitialState() {
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //点击确定返回
            isVisible:this.props.isVisible,
            tableData:this.props.tableData,
            dataSource: ds.cloneWithRows(this.props.tableData),
            titles:[],
            shurudijige:0
        }
    },

    render() {
        if (this.props.isVisible == true){
            return (
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <MLNavigatorBar title={'选择提醒'} isBack={true} backFunc={() => {
                        var {
                            quxiao,
                        } = this.props;
                        //返回出去
                        quxiao();
                    }}/>
                    <View style={styles.container}>
                        <ListView
                            dataSource={this.state.dataSource}//数据源
                            renderRow={this.renderRow}
                        />
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
    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                var {
                    onClose,
                } = this.props;
                //返回出去
                onClose(rowData);
            }}>
                <View style={styles.container1}>
                    <Text style={{margin:10}}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        )
    },
});


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent:'center',
        flex:1,
        right:0,
        bottom:0,
        backgroundColor:'white',
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
    container1:{
        backgroundColor:'white',
        borderBottomColor:'#dddddd',
        borderBottomWidth:0.5,
    }
});

// 输出组件类
module.exports = selectionMLModal;


