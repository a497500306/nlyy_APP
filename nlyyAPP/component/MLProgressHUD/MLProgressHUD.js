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
var MLProgressHUD = React.createClass({
    getDefaultProps(){
        return {
            //输入框提示文字数组
            text:'',
            isVisible:true,
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
                    animationType='none'
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
                            <ActivityIndicator
                                animating={true}
                                style={[{height: 40}]}
                                size="small"
                                color="white"
                            />
                            <Text style={{color:'white',marginTop:10}}>
                                {this.props.text}
                            </Text>
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
});


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent:'center',
        flex:1,
        right:0,
        bottom:0,
        backgroundColor:'rgba(1,1,1,0)'
    },
    fudongViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width:130,
        height:130,
        backgroundColor:'rgba(0,0,0,0.8)',
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
module.exports = MLProgressHUD;
