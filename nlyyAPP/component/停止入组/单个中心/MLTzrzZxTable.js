

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ListView,
    Alert
} from 'react-native';

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Changku = require('../../../entity/Changku');
var settings = require('../../../settings');
var FPZhongxin = require('../../药物管理/仓库/保存数据/FPZhongxin');
var FPChangku = require('../../药物管理/仓库/保存数据/FPChangku');
var CytchwclsfbZX = require('../../受试者随机/查阅退出或完成例数分布/MLCytchwclsfbZX');
var DgzxSq = require('./MLDgzxSq');
var Cxzxywqk = require('../../药物管理/查询中心药物情况/MLCxzxywqk');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var ApplicationAndAudit = require('../../../entity/ApplicationAndAudit');
const Item = List.Item;
const Brief = Item.Brief;

var TzrzZxTable = React.createClass({
    getDefaultProps(){
        return {
            pushType : null
        }
    },

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getSite", {
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


                    var shengqing = [];
                    var shenghe = [];
                    for (var y = 0 ; y < ApplicationAndAudit.ApplicationAndAudit.length ; y++) {
                        if (ApplicationAndAudit.ApplicationAndAudit[y].EventApp == 2){
                            shengqing = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");
                        }
                        if (ApplicationAndAudit.ApplicationAndAudit[y].EventRev == 2){
                            shenghe = ApplicationAndAudit.ApplicationAndAudit[y].EventRevUsers.split(",");
                        }
                    }


                    //ListView设置
                    var tableData = [];
                    //判断用户负责中心
                    var UserSite = '';
                    for (var i = 0; i < Users.Users.length; i++) {
                        var data = Users.Users[i];
                        for (var y = 0; y < shengqing.length; y++) {
                            if (data.UserFun == shengqing[y]) {
                                if (data.UserSiteYN == 1){
                                    UserSite = ''
                                }else{
                                    UserSite = data.UserSite
                                }
                            }
                        }
                    }

                    if (this.props.pushType == 2){
                        for (var i = 0; i < Users.Users.length; i++) {
                            var data = Users.Users[i];
                            if(data.UserFun == 'M1' || data.UserFun == 'H4' ||
                                data.UserFun == 'M6' || data.UserFun == 'M7'){
                                    UserSite = data.UserSite
                            }
                        }
                        for (var i = 0; i < Users.Users.length; i++) {
                            var data = Users.Users[i];
                            if(data.UserFun == 'M1' || data.UserFun == 'H4' ||
                                data.UserFun == 'M6' || data.UserFun == 'M7'){
                                if (data.UserSiteYN == 1){
                                    UserSite = ''
                                }
                            }
                        }

                    }
                    if (this.props.pushType == 1){
                        for (var i = 0; i < Users.Users.length; i++) {
                            var data = Users.Users[i];
                            if(data.UserFun == 'H1' || data.UserFun == 'M1' || data.UserFun == 'H2' ||
                                data.UserFun == 'H3' || data.UserFun == 'M7'){
                                UserSite = data.UserSite
                            }
                        }
                        for (var i = 0; i < Users.Users.length; i++) {
                            var data = Users.Users[i];
                            if (data.UserFun == 'H1' || data.UserFun == 'M1' || data.UserFun == 'H2' ||
                                data.UserFun == 'H3' || data.UserFun == 'M7') {
                                if (data.UserSiteYN == 1) {
                                    UserSite = ''
                                }
                            }
                        }
                    }
                    if (UserSite == ''){//负责全部中心
                        for (var i = 0 ; i < responseJson.data.length ; i++){
                            var changku = responseJson.data[i];
                            tableData.push(changku)
                        }
                    }else{
                        //判断用户管理几个中心
                        var sites = UserSite.split(",")
                        for (var j = 0 ; j < sites.length ; j++){
                            for (var i = 0 ; i < responseJson.data.length ; i++){
                                if (responseJson.data[i].SiteID == sites[j]){
                                    var changku = responseJson.data[i];
                                    tableData.push(changku)
                                }
                            }
                        }
                    }

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
    // getInitialState() {


    // },

    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.cuowu == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'选择中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
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
    renderRow(rowData){
        return(
            <Item arrow="horizontal"
                  multipleLine={true}
                  wrap={true}
                  align='middle'
                  onClick={() => {
                      if (this.props.pushType == null){
                          if (rowData.isStopIt == 1){
                              //错误
                              Alert.alert(
                                  '提示',
                                  '该中心已经停止入组',
                                  [
                                      {text: '确定'}
                                  ]
                              )
                          }else{
                              //设置数据
                              FPZhongxin.FPZhongxin = rowData;
                              FPChangku.FPChangku = null;
                              // 页面的切换
                              this.props.navigator.push({
                                  component: DgzxSq, // 具体路由的版块
                              });
                          }
                      }else if (this.props.pushType == 1){
                          // 页面的切换
                          this.props.navigator.push({
                              component: CytchwclsfbZX, // 具体路由的版块
                              //传递参数
                              passProps:{
                                  FPZhongxin:rowData
                              }
                          });
                      }else if (this.props.pushType == 2){
                          //设置数据
                          // 页面的切换
                          this.props.navigator.push({
                              component: Cxzxywqk, // 具体路由的版块
                              //传递参数
                              passProps:{
                                  FPZhongxin:rowData
                              }
                          });
                      }
                  }}
            >
                {rowData.SiteNam}
                <Text style={{
                    marginTop:5,
                    color:'gray'
                }}>{"中心编号:" + rowData.SiteID}</Text>
            </Item>
        )
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
module.exports = TzrzZxTable;



