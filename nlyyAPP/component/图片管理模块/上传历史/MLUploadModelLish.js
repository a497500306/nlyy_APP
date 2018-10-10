/**
 * Created by Rolle on 2017/5/25.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Alert
} from 'react-native';
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Users = require('../../../entity/Users');
var settings = require('../../../settings');
var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
var MLMoKuaiUpdateList = require('../模块上传/MLMoKuaiUpdateList')

var MLUploadModelLish = React.createClass({
    getDefaultProps(){
        return {
            data:null,
            name:''
        }
    },
    //耗时操作,网络请求
    componentDidMount(){
        var UserSite = '';
        var UserSiteYN = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'S1' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'H2' ||
                Users.Users[i].UserFun == 'H5' || Users.Users[i].UserFun == 'M1' || Users.Users[i].UserFun == 'M8' ||
                Users.Users[i].UserFun == 'M5' || Users.Users[i].UserFun == 'H5' || Users.Users[i].UserFun == 'M4' ||
                Users.Users[i].UserFun == 'M7' || Users.Users[i].UserFun == 'C2'
            ){
                UserSite = Users.Users[i].UserSite;
                UserSiteYN = Users.Users[i].UserSiteYN;
            }
        }
        fetch(settings.fwqUrl + "/app/getAddImageModeulesListUser", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                CRFModeulesName:this.props.name,
                UserSite:UserSite,
                UserSiteYN:UserSiteYN
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{
                    var tableData = [];
                    tableData = responseJson.data;
                    //ListView设置
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(tableData),data:responseJson.data});
                    //移除等待
                    this.setState({animating:false});
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '提示:',
                    '请检查您的网络',
                    [
                        {text: '确定'}
                    ]
                )

            });
    },

    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            data:null,
        }
    },

    render() {
        if (this.state.animating == true) {
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={this.props.name + '上传历史'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>
            )
        }else {
            // console.log('更新属性' + this.props.initialProps.weChatUser + "123")
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={this.props.name + '上传历史'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={() => {
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                </View>
            );
        }
    },

    //返回具体的cell
    renderRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity onPress={()=> {
                // 页面的切换
                this.props.navigator.push({
                    component: MLMoKuaiUpdateList, // 具体路由的版块
                    //传递参数
                    passProps:{
                        data:rowData,
                        name:this.props.name
                    }
                });
            }}>
                <MLTableCell title={rowData.USubjID}/>
            </TouchableOpacity>
        )
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLUploadModelLish;