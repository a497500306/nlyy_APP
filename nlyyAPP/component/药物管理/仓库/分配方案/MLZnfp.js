

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

var List = require('../../../../node_modules/antd-mobile/lib/list/index');
const Item = List.Item;
const Brief = Item.Brief;
var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../../entity/Users');
var MLTableCell = require('../../../MLTableCell/MLTableCell');
var PatientRM = require('../../../受试者随机/MLPatientRM');
var MLActivityIndicatorView = require('../../../MLActivityIndicatorView/MLActivityIndicatorView');
var settings = require('../../../../settings');

var Ywqd = require('../MLYwqd');
var FPChangku = require('../保存数据/FPChangku');
var FPZhongxin = require('../保存数据/FPZhongxin');
var FPQDData = require('../保存数据/FPQDData');
var Changku = require('../../../../entity/Changku');
var Button = require('apsl-react-native-button');

var znfp = React.createClass({

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
            isShowWait : false,
            showLoginBtn : false,
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        var UserSiteID = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                if (Users.Users[i].UserFun == 'M6'){
                    UserSiteID = Users.Users[i].UserSite
                }
            }
        }
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
                console.log(responseJson)
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                    this.setState({cuowu:true});
                }else{
                    //ListView设置
                    var tableData = [];
                    //判断用户负责中心
                    var UserSite = '';
                    for (var i = 0 ; i < Users.Users.length ; i++) {
                        if (Users.Users[i].UserFun == 'M6'){
                            if (Users.Users[i].UserSite != null) {
                                UserSite = Users.Users[i].UserSite
                            }
                        }
                    }
                    //判断用户是否负责全部中心
                    for (var i = 0 ; i < Users.Users.length ; i++) {
                        if (Users.Users[i].UserFun == 'M6'){
                            if (Users.Users[i].UserSiteYN == 1) {
                                UserSite = ''
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
                      //发送网络请求
                      fetch(settings.fwqUrl + "app/getZnfp", {
                          method: 'POST',
                          headers: {
                              'Accept': 'application/json; charset=utf-8',
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                              StudyID: Users.Users[0].StudyID,
                              Users : Users.Users[0],
                              Address : FPChangku.FPChangku == null ? FPZhongxin.FPZhongxin : FPChangku.FPChangku,
                              Type : FPChangku.FPChangku == null ? 2 : 1,
                              DepotGNYN : Changku.Changku == null ? 0 : Changku.Changku.DepotGNYN,//是否为主仓库:1是,0不是
                              DepotBrYN : Changku.Changku == null ? 0 : Changku.Changku.DepotBrYN,//是否为分仓库:1是,0不是
                              DepotId : Changku.Changku == null ? 0 : Changku.Changku.id,
                          })
                      })
                          .then((response) => response.json())
                          .then((responseJson) => {
                              this.setState({animating:false});
                              if (responseJson.isSucceed != 400){
                                  //错误
                                  Alert.alert(
                                      '提示:',
                                      responseJson.msg,
                                      null,
                                      [
                                          {text: '确定'}
                                      ]
                                  )
                              }else {
                                  this.setState({animating:false});
                                  FPQDData.FPQDData = responseJson.data
                                  // 页面的切换
                                  this.props.navigator.push({
                                      name:'分配清单',
                                      component: Ywqd, // 具体路由的版块
                                  });
                              }
                          })
                          .catch((error) => {//错误
                              this.setState({animating:false});
                              console.log(error),
                                  //错误
                                  Alert.alert(
                                      '提示:',
                                      '请检查您的网络111',
                                      [
                                          {text: '确定'}
                                      ]
                                  )
                          });
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
module.exports = znfp;



