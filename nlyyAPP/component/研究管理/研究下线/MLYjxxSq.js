
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
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView')
var FPZhongxin = require('../../药物管理/仓库/保存数据/FPZhongxin');

var YjxxSq = React.createClass({

    getInitialState() {
        var tableData = [];
        tableData.push('研究编号')
        tableData.push('总样本量')
        tableData.push('总随机例数')
        tableData.push('总完成例数')
        tableData.push('总脱落例数')
        tableData.push('研究已停止受试者入组')
        tableData.push('申请人')
        tableData.push('研究是否下线')
        tableData.push('')
        return {
            tableData : tableData,
            data : null,
            //ListView设置
            dataSource: null,
            //ListView设置
            animating: true,
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

    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getYjxxApplyData", {
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
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:true});
                }else{
                    //ListView设置
                    this.state.data = responseJson.data
                    var tableData = [];
                    tableData.push('研究编号')
                    tableData.push('总样本量')
                    tableData.push('总随机例数')
                    tableData.push('总完成例数')
                    tableData.push('总脱落例数')
                    tableData.push('研究已停止受试者入组')
                    tableData.push('申请人')
                    tableData.push('研究是否下线')
                    tableData.push('')
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(tableData)});
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:false});
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '请检查您的网络',
                    null,
                    [
                        {text: '确定'}
                    ]
                )

            });
    },

    render() {
        if (this.state.animating == true){
            console.log('菊花')
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'研究下线'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            console.log('tableview')
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'研究下线'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
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
        /*
         tableData.push('研究编号')
         tableData.push('总样本量')
         tableData.push('总随机例数')
         tableData.push('总完成例数')
         tableData.push('总脱落例数')
         tableData.push('研究已停止受试者入组')
         tableData.push('申请人')
         tableData.push('研究是否下线')

         "AllAampleNumber" : String, //总样本量
         "AllRandomNumber" : String, //总随机例数
         "AllCompleteNumber" : String, //总完成例数
         "AllFallOffNumber" : String, //总脱落例数
         "IsStudyStopIt" : String, //研究是否已经停止入组
         */
        if (rowData == "研究编号") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users[0].StudyID} isArrow={false}/>
            )
        }
        if (rowData == "总样本量") {
            return(
                <MLTableCell title={rowData} rightTitle={this.state.data.AllAampleNumber} isArrow={false}/>
            )
        }
        if (rowData == "总随机例数") {
            return(
                <MLTableCell title={rowData} rightTitle={this.state.data.AllRandomNumber} isArrow={false}/>
            )
        }
        if (rowData == "总完成例数") {
            return(
                <MLTableCell title={rowData} rightTitle={this.state.data.AllCompleteNumber} isArrow={false}/>
            )
        }
        if (rowData == "总脱落例数") {
            return(
                <MLTableCell title={rowData} rightTitle={this.state.data.AllFallOffNumber} isArrow={false}/>
            )
        }
        if (rowData == "研究已停止受试者入组") {
            return(
                <MLTableCell title={rowData} rightTitle={this.state.data.IsStudyStopIt} isArrow={false}/>
            )
        }
        if (rowData == "申请人") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users[0].UserNam} isArrow={false}/>
            )
        }
        if (rowData == "研究是否下线") {
            return(
                <MLTableCell title={rowData} rightTitle={'否'} isArrow={false}/>
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
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getYjxxApply", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID: Users.Users[0].StudyID,
                UserNam:Users.Users[0].UserNam
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
module.exports = YjxxSq;
