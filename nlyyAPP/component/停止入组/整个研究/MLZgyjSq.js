
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ListView,
    Alert,
    DatePickerAndroid,
    TouchableHighlight,
    DatePickerIOS,
    Picker,
    ActivityIndicator,

} from 'react-native';
//时间操作
var moment = require('moment');
moment().format();

import Pickers from 'react-native-picker';

// var Modal = require('react-native-modal');
var Users = require('../../../entity/Users')
var MLModal = require('../../MLModal/MLModal');
var study = require('../../../entity/study');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var FPZhongxin = require('../../药物管理/仓库/保存数据/FPZhongxin');

var DgzxSq = React.createClass({

    getInitialState() {
        var tableData = [];
        tableData.push('研究编号')
        tableData.push('申请人')
        tableData.push('申请人手机号')
        tableData.push('是否推送短信给全国PI')
        tableData.push('是否推送邮件给全国PI')
        tableData.push('研究已停止受试者入组')
        tableData.push('选择原因')
        tableData.push('')
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData : tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            //ListView设置
            animating: false,
            //是否显示选择器
            isLanguage : false,
            //选择器默认选择值
            language:'',
            //短信
            isMessage:'',
            //邮件
            isMail:'',
            //原因
            yuanying:''
        }
    },
    render() {
        if (this.state.isLanguage == false){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'整个研究停止入组申请'} isBack={true} backFunc={() => {
                        Pickers.hide();
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'整个研究停止入组申请'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <View style={{position:'absolute', right:0, bottom:0, width:width, height:height, backgroundColor:'rgba(0,0,0,0.5)'}}>
                        <Picker
                            selectedValue={this.state.language}
                            onValueChange={(lang) => this.setState({language: lang})}>
                            {this.PickerItem()}
                        </Picker>
                    </View>
                </View>
            );
        }
    },
    PickerItem(){
        var views = [];
        for (var i = 0 ; i < this.state.languages.length ; i++) {
            views.push(<Picker.Item label={this.state.languages[i]} key={i} value="java" />)
        }
        return views
    },
    //返回具体的cell
    renderRow(rowData){
        /*tableData.push('研究编号')
         tableData.push('中心编号')
         tableData.push('中心名称')
         tableData.push('申请人')
         tableData.push('申请人手机号')
         tableData.push('申请日期')
         tableData.push('是否推送短信给全国PI')
         tableData.push('是否推送邮件给全国PI')
         tableData.push('中心已停止受试者入组')
         tableData.push('选择原因')
         tableData.push('')*/
        if (rowData == "研究编号") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users[0].StudyID} isArrow={false}/>
            )
        }
        if (rowData == "申请人") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users[0].UserNam} isArrow={false}/>
            )
        }
        if (rowData == "申请人手机号") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users[0].UserMP} isArrow={false}/>
            )
        }
        if (rowData == "是否推送短信给全国PI") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData: ['是','否'],
                        onPickerConfirm: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({isMessage:pickedValue[0],
                                dataSource: ds.cloneWithRows(this.state.tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({isMessage:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                        },
                        onPickerSelect: pickedValue => {
                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.isMessage}/>
                </TouchableOpacity>
            )
        }
        if (rowData == "是否推送邮件给全国PI") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData: ['是','否'],
                        onPickerConfirm: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({isMail:pickedValue[0],
                                dataSource: ds.cloneWithRows(this.state.tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({isMail:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                        },
                        onPickerSelect: pickedValue => {
                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.isMail}/>
                </TouchableOpacity>
            )
        }
        if (rowData == "研究已停止受试者入组") {
            return(
                <MLTableCell title={rowData} rightTitle={'否'} isArrow={false}/>
            )
        }
        if (rowData == "选择原因") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData:['本研究入组完成','申办方提前终止研究','其他'],
                        onPickerConfirm: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({yuanying:pickedValue[0],
                                dataSource: ds.cloneWithRows(this.state.tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({yuanying:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                        },
                        onPickerSelect: pickedValue => {
                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.yuanying}/>
                </TouchableOpacity>
            )
        }
        if (rowData == ''){
            return(
                <View>
                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                        <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                            确 定
                        </Text>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={[styles.centering, {height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    },
    getLogin(){
        /*
         //短信
         isMessage:'',
         //邮件
         isMail:'',
         //原因
         yuanying:''*/
        if (this.state.isMessage.length == 0){
            //错误
            Alert.alert(
                '提示',
                '请选择是否推送短信',
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.isMail.length == 0){
            //错误
            Alert.alert(
                '提示',
                '请选择是否推送邮件',
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.yuanying.length == 0){
            //错误
            Alert.alert(
                '提示',
                '请选择原因',
                [
                    {text: '确定'}
                ]
            )
            return
        }
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getApplyYJStopIt", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID: Users.Users[0].StudyID,
                UserNam:Users.Users[0].UserNam,
                UserMP:Users.Users[0].UserMP,
                isMessage:this.state.isMessage,
                isMail:this.state.isMail,
                UserEmail:Users.Users[0].UserEmail,
                Reason:this.state.yuanying,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    animating: false
                })
                if (responseJson.isSucceed == 200){
                    //错误
                    Alert.alert(
                        '提示',
                        responseJson.msg,
                        [
                            {text: '确定', onPress: () => this.props.navigator.pop()}
                        ]
                    )
                }else {
                    //错误
                    Alert.alert(
                        '提示',
                        responseJson.msg,
                        [
                            {text: '确定', onPress: () => this.props.navigator.pop()}
                        ]
                    )
                }
            })
            .catch((error) => {//错误
                this.setState({
                    animating: false
                })
                this.setState({animating:false});
                console.log(error),
                    //错误
                    Alert.alert(
                        '提示',
                        '请检查您的网络',
                        [
                            {text: '确定', onPress: () => this.props.navigator.pop()}
                        ]
                    )
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
    xiantiaoViewStyle:{
        width: 42,
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    zongView: {
        backgroundColor: 'white',
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center'
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginTop:20,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
    },
});

// 输出组件类
module.exports = DgzxSq;
