

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

var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../../entity/Users');
var MLTableCell = require('../../../MLTableCell/MLTableCell');
var PatientRM = require('../../../受试者随机/MLPatientRM');
var MLActivityIndicatorView = require('../../../MLActivityIndicatorView/MLActivityIndicatorView');
var settings = require('../../../../settings');
var DgzxjjjmQR = require('./MLDgzxjjjmQR');
var List = require('../../../../node_modules/antd-mobile/lib/list/index');
var ApplicationAndAudit = require('../../../../entity/ApplicationAndAudit');
const Item = List.Item;
const Brief = Item.Brief;

var Dgzxjjjm = React.createClass({

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

                    var dgssztdjmSH = [];
                    var dgssztdjmSQ = [];
                    var dgsszjjjmSH = [];
                    var dgsszjjjmSQ = [];
                    var dgzxjjjmSH = [];
                    var dgzxjjjmSQ = [];
                    var zgyjjjjmSH = [];
                    var zgyjjjjmSQ = [];
                    for (var y = 0 ; y < ApplicationAndAudit.ApplicationAndAudit.length ; y++) {
                        if (ApplicationAndAudit.ApplicationAndAudit[y].EventApp == 1){
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 1){
                                dgssztdjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 2){
                                dgsszjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 3){
                                dgzxjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbApp == 4){
                                zgyjjjjmSQ = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                        }
                        if (ApplicationAndAudit.ApplicationAndAudit[y].EventRev == 1){
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 1){
                                dgssztdjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 2){
                                dgsszjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 3){
                                dgzxjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                            if (ApplicationAndAudit.ApplicationAndAudit[y].EventUnbRev == 4){
                                zgyjjjjmSH = ApplicationAndAudit.ApplicationAndAudit[y].EventAppUsers.split(",");

                            }
                        }
                    }

                    //ListView设置
                    var tableData = [];
                    //判断用户负责中心
                    var UserSite = '';
                    for (var i = 0 ; i < Users.Users.length ; i++) {
                        var data = Users.Users[i];
                        //判断用户类别
                        for (var y = 0; y < dgzxjjjmSQ.length; y++) {
                            if (data.UserFun == dgzxjjjmSQ[y]) {
                                if (data.UserSiteYN == 1){
                                    UserSite = ''
                                }else{
                                    UserSite = data.UserSite
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
        if (rowData.isUnblinding == 1){
            return(
                <Item arrow="horizontal"
                      multipleLine={true}
                      wrap={true}
                      align='middle'
                      extra={'该中心已揭盲'}
                >
                    {rowData.SiteNam}
                </Item>
            )
        }else{
            return(
                <Item arrow="horizontal"
                      multipleLine={true}
                      wrap={true}
                      align='middle'
                      onClick={() => {
                          //错误
                          this.props.navigator.push({
                              component: DgzxjjjmQR, // 具体路由的版块
                              //传递参数
                              passProps: {
                                  //出生年月
                                  core: rowData
                              }
                          })
                      }}
                >
                    {rowData.SiteNam}
                </Item>
            )
        }
        /*
        if (rowData.isUnblinding == 1){
            return(
                <MLTableCell isArrow = {false} title={rowData.SiteNam} subTitle = {"中心编号:" + rowData.SiteID} subTitleColor = {'black'} rightTitle={'该中心已揭盲'} rightTitleColor = {'gray'}/>
            )
        }else{
            return(
                <TouchableOpacity onPress={()=>{
                    //错误
                    this.props.navigator.push({
                        component: DgzxjjjmQR, // 具体路由的版块
                        //传递参数
                        passProps: {
                            //出生年月
                            core: rowData
                        }
                    })
                }}>
                    <MLTableCell title={rowData.SiteNam}/>
                </TouchableOpacity>
            )
        }
        */
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
module.exports = Dgzxjjjm;



