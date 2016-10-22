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
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});

        return {
            //ListView设置
            dataSource: ds.cloneWithRows(UserData.data),

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
                        StudyID: rowData.StudyID
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
                            console.log(responseJson)
                            //设置数据
                            Users.Users = rowData,
                            researchParameter.researchParameter = responseJson.researchParameter,
                            study.study = responseJson.study,
                                console.log(Users.Users)
                            console.log(study.study)
                            console.log(researchParameter.researchParameter)
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
                 <MLTableCell title={rowData.SponsorS} subTitle={rowData.StudNameS}/>
            </TouchableOpacity>
        )
    },

    tableCell(){
        var cells = [];
        for (var i = 0 ; i < UserData.data.length ; i++){
            cells.push(<MLTableCell key={i} title={UserData.data[i].SponsorS} subTitle={UserData.data[i].StudNameS} data={UserData.data[i]}/>)
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
