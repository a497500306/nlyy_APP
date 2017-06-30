/**
 * Created by maoli on 16/9/25.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    BackAndroid,
    ToastAndroid,
    Image
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLNavigatorBar = React.createClass({
    //组件挂载的时候调用
    componentDidMount(){
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
    },
    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack)
    },

    handleBack(){
        var navigator = this.navigator;
        if (this.props.backFunc == undefined) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {

                //最近2秒内按过back键，可以退出应用。

                return false;

            }

            this.lastBackPressed = Date.now();

            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);

            return true;
        }else{
            this.props.backFunc();
            this.props.newFunc();
            return true;
        }
    },
    getDefaultProps(){
        return {
            title:"",
            isBack:true,
            backText:"返回",
            newText:"",
            newImage:null,
            backFunc: Component.func,
            newFunc: Component.func
        }
    },
    render() {
        if (this.props.isBack == true){
            return (
                <View style={{
                    borderColor: '#D1D1D1',
                    borderRadius: 0,
                    borderBottomWidth:0.5,
                }}>
                    <View style={styles.daohangIOSStyle}/>
                    <View style={styles.daohangStyle}>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',position:'absolute', left:0, bottom:0, height:44}} onPress={this.props.backFunc}>
                            <Image resizeMode={'cover'} source={require('./返回.png')} style={{marginLeft:5,marginRight:10,marginTop:5,marginBottom:5,width:30,height:30}}/>
                            <Text style={{fontSize:16,color:'white',marginLeft:-15,marginTop:5,paddingBottom:5}}>{this.props.backText}</Text>
                        </TouchableOpacity>
                        <Text style={{color:'white',fontSize: 17,fontWeight: 'bold'}}>
                            {this.props.title}
                        </Text>
                    </View>
                </View>
            );
        }else if (this.props.newText !== ''){
            return (
                <View style={{
                    borderColor: '#D1D1D1',
                    borderRadius: 0,
                    borderBottomWidth:0.5,
                }}>
                    <View style={styles.daohangIOSStyle}/>
                    <View style={styles.daohangStyle}>
                        <View style={styles.daohangStyle}>
                            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',position:'absolute', left:0, bottom:0, height:44}} onPress={this.props.backFunc}>
                                <Image resizeMode={'cover'} source={require('./返回.png')} style={{marginLeft:5,marginRight:10,marginTop:5,marginBottom:5,width:30,height:30}}/>
                                <Text style={{fontSize:16,color:'white',marginLeft:-15,marginTop:5,paddingBottom:5}}>{this.props.backText}</Text>
                            </TouchableOpacity>
                            <Text style={{color:'white',fontSize: 17,fontWeight: 'bold'}}>
                                {this.props.title}
                            </Text>
                        </View>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',position:'absolute', left:0, bottom:0, height:44}} onPress={this.props.newFunc}>
                            {this.props.newImage === null ?  <View/> : <Image resizeMode={'cover'} source={this.props.newImage} style={{marginLeft:5,marginRight:10,marginTop:5,marginBottom:5,width:30,height:30}}/>}
                            <Text style={{fontSize:16,color:'#white',marginLeft:-15,marginTop:5,paddingBottom:5}}>{this.props.backText}</Text>
                        </TouchableOpacity>
                        <Text style={{color:'#white',fontSize: 17,fontWeight: 'bold'}}>
                            {this.props.newText}
                        </Text>
                    </View>
                </View>
            );
        }else{
            return (
                <View style={{
                    borderColor: '#D1D1D1',
                    borderRadius: 0,
                    borderBottomWidth:0.5,
                }}>
                    <View style={styles.daohangIOSStyle}/>
                    <View style={styles.daohangStyle}>
                       <Text style={{color:'#666666',fontSize: 17,fontWeight: 'bold'}}>
                            {this.props.title}
                        </Text>
                    </View>
                </View>
            );
        }
    },
});

const styles = StyleSheet.create({
    daohangStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'space-around',

        width:width,
        height:44,
        backgroundColor:'rgba(0,136,212,1.0)',
    },
    daohangIOSStyle:{
        width:width,
        height:Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'rgba(0,136,212,1.0)',
    },
});

// 输出组件类
module.exports = MLNavigatorBar;