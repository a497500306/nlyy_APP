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
    ListView
} from 'react-native';

var Home = require('../MLHome/MLHome');
var UserData = require('../../entity/UserData');
var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../MLTableCell/MLTableCell');
var Users = require('../../entity/Users');
var study = require('../../entity/study');
var researchParameter = require('../../entity/researchParameter');
var settings = require("../../settings");

var SelectionStudy = React.createClass({

    getDefaultProps(){
        return {
            phone:"123",
        }
    },

    componentDidMount() {
        //这里获取从FirstPageComponent传递过来的参数: id
        this.setState({
            phone: this.props.phone
        });
    },

    getInitialState() {
        //[[研究A],[研究B]] 研究A:身份A,身份B ==[[身份A,身份B],[身份A,身份B]]
        var datas = [];
        for (var i = 0 ; i < UserData.data.length ; i++){
            if (datas.length == 0){
                datas.push([UserData.data[i]])
            }else {
                var isYj = false;
                for (var j = 0 ; j < datas.length ; j++ ){
                    console.log('newData')
                    console.log(datas[j][0])
                    var newData = datas[j][0];
                    if (newData.StudySeq == UserData.data[i].StudySeq){
                        isYj = true;
                        datas[j].push(UserData.data[i])
                    }
                }
                if (isYj = false){
                    datas.push([UserData.data[i]])
                }
            }
        }
        console.log(datas)
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(datas),

            phone:"",
            animating: false,//是否显示菊花
        }
    },

    // 复杂的操作:定时器\网络请求
    componentDidMount(){
        //获取用户列表数据
       console.log(UserData.data)
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'选择研究'} isBack={false}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                {/*<ScrollView>*/}
                    {/*{this.tableCell()}*/}
                {/*</ScrollView>*/}
            </View>
        );
    },
    // 跳转到二级界面
    pushToDetail(){
        // 页面的切换
        this.props.navigator.push({
            component: Home, // 具体路由的版块
        });
    },

    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                //发送登录网络请求
                fetch(settings.fwqUrl + "/app/getStudyAndResearchParameter", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json; charset=utf-8',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        StudyID: rowData[0].StudyID
                    })
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.isSucceed == 200){
                            //错误
                            Alert.alert(
                                responseJson.msg,
                                null,
                                [
                                    {text: '确定'}
                                ]
                            )
                        }else {
                            //设置数据
                            Users.Users = rowData,
                            researchParameter.researchParameter = responseJson.researchParameter,
                            study.study = responseJson.study,
                            // 页面的切换
                            this.props.navigator.push({
                            component: Home, // 具体路由的版块
                            });
                        }
                    })
                    .catch((error) => {//错误
                        this.setState({animating:false});
                        console.log(error),
                            //错误
                            Alert.alert(
                                '请检查您的网络111',
                                null,
                                [
                                    {text: '确定'}
                                ]
                            )
                    });

            }}>
                 <MLTableCell title={rowData[0].SponsorS} subTitle={rowData[0].StudNameS} subTitleColor={'gray'}/>
            </TouchableOpacity>
        )
    },

    tableCell(){
        var cells = [];
        for (var i = 0 ; i < UserData.data.length ; i++){
            var userFunStr = '123';
            if (UserData.data[i].UserFun == 'H1') {
                userFunStr = '全国PI'
            }
            if (UserData.data[i].UserFun == 'H2') {
                userFunStr = '中心PI'
            }
            if (UserData.data[i].UserFun == 'H3') {
                userFunStr = 'Subi'
            }
            if (UserData.data[i].UserFun == 'H4') {
                userFunStr = '药物管理员'
            }
            if (UserData.data[i].UserFun == 'S1') {
                userFunStr = 'CRC'
            }
            if (UserData.data[i].UserFun == 'M1') {
                userFunStr = 'PM'
            }
            if (UserData.data[i].UserFun == 'M2') {
                userFunStr = '医学部'
            }
            if (UserData.data[i].UserFun == 'M3') {
                userFunStr = '统计部'
            }
            if (UserData.data[i].UserFun == 'M4') {
                userFunStr = 'DM'
            }
            if (UserData.data[i].UserFun == 'M5') {
                userFunStr = '安全专员'
            }
            if (UserData.data[i].UserFun == 'M6') {
                userFunStr = '药品仓管员'
            }
            if (UserData.data[i].UserFun == 'M7') {
                userFunStr = 'CRA'
            }
            if (UserData.data[i].UserFun == 'C1') {
                userFunStr = '随机化专员'
            }
            if (UserData.data[i].UserFun == '15') {
                userFunStr = '物流人员'
            }
            if (UserData.data[i].UserFun == 'X9') {
                userFunStr = '其他'
            }
            cells.push(<MLTableCell key={i} title={UserData.data[i].SponsorS} subTitle={UserData.data[i].StudNameS} rightTitle={UserData.data[i].UserFun} data={UserData.data[i]}/>)
        }
        return cells
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});

// 输出组件类
module.exports = SelectionStudy;
