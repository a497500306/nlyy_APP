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
    Alert,
    ListView
} from 'react-native';

var MLTableCell = require('../../MLTableCell/MLTableCell');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var settings = require("../../../settings");
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLSMSStatisticsLB = require('./MLSMSStatisticsLB');
import ActionSheet from 'react-native-actionsheet';

const buttons = ['取消', '查询随访短信(受试者编号排序)','查询随访短信(时间排序)', '查询用药提醒短信(受试者编号排序)','查询用药提醒短信(时间排序)'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 5;
var friendId = 0;
var seveRowData = {};

var MLSMSStatistics = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[],
            tableStr : [],
            recordingSMS:[]
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        //时候负责全部中心
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserFun == 'H2' || Users.Users[i].UserFun == 'H3' || Users.Users[i].UserFun == 'S1' ){
                if (Users.Users[i].UserSiteYN == 1) {
                    UserSite = ''
                }
            }
        }
        //移除等待
        this.setState({animating:true});
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getSMSStatistics", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                SiteID : UserSite,
                StudyID : Users.Users[0].StudyID
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{
                    var array = [];
                    for (var i = 0 ; i < responseJson.data.sites.length ; i++){
                        var yy = 0 ;
                        var sf = 0 ;
                        for (var y = 0 ; y < responseJson.data.sites[i].recordingSMS.length ; y++){
                            if (responseJson.data.sites[i].recordingSMS[y].type == 1){
                                yy  = yy + 1;
                            }else {
                                sf = sf + 1;
                            }
                        }
                        array.push({
                            yy : yy,
                            sf : sf
                        })
                    }
                    //ListView设置
                    var tableData = responseJson.data.sites;
                    this.state.tableData = tableData;
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData),tableStr:array});
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
    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'发送受试者短信统计'} isBack={true} backFunc={() => {
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
                    <MLNavigatorBar title={'发送受试者短信统计'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择您的操作？"
                        options={buttons}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={(sss)=>{
                            this._handlePress(this)
                            if (sss == 1){//编号排序
                                var array = [];
                                for (var i = 0 ; i < this.state.recordingSMS.length ; i++){
                                    if (this.state.recordingSMS[i].type == 2){
                                        array.push(this.state.recordingSMS[i])
                                    }
                                }
                                // 页面的切换
                                this.props.navigator.push({
                                    //传递参数
                                    passProps:{
                                        data:array,//数据
                                        type:1,//排序
                                    },
                                    component: MLSMSStatisticsLB, // 具体路由的版块
                                });
                            }else if (sss == 2){//时间排序
                                var array = [];
                                for (var i = 0 ; i < this.state.recordingSMS.length ; i++){
                                    if (this.state.recordingSMS[i].type == 2){
                                        array.push(this.state.recordingSMS[i])
                                    }
                                }
                                // 页面的切换
                                this.props.navigator.push({
                                    //传递参数
                                    passProps:{
                                        data:array,//数据
                                        type:2,//排序
                                    },
                                    component: MLSMSStatisticsLB, // 具体路由的版块
                                });
                            }else if (sss == 3){
                                var array = [];
                                for (var i = 0 ; i < this.state.recordingSMS.length ; i++){
                                    if (this.state.recordingSMS[i].type == 1){
                                        array.push(this.state.recordingSMS[i])
                                    }
                                }
                                // 页面的切换
                                this.props.navigator.push({
                                    //传递参数
                                    passProps:{
                                        data:array,//数据
                                        type:1,//排序
                                    },
                                    component: MLSMSStatisticsLB, // 具体路由的版块
                                });

                            }else if (sss == 4){
                                var array = [];
                                for (var i = 0 ; i < this.state.recordingSMS.length ; i++){
                                    if (this.state.recordingSMS[i].type == 1){
                                        array.push(this.state.recordingSMS[i])
                                    }
                                }
                                // 页面的切换
                                this.props.navigator.push({
                                    //传递参数
                                    passProps:{
                                        data:array,//数据
                                        type:2,//排序
                                    },
                                    component: MLSMSStatisticsLB, // 具体路由的版块
                                });

                            }
                        }}
                    />
                </View>
            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        return(
            <TouchableOpacity onPress={()=>{
                this.setState({
                    recordingSMS:rowData.recordingSMS
                })
                this.show(this)
            }}>
                <MLTableCell title={'中心编号:' + rowData.site.SiteID} subTitleColor = {'black'} rightTitle={'随访预约短信：' + this.state.tableStr[rowID].sf + '\n' +  '用药提醒短信：' + this.state.tableStr[rowID].yy} rightTitleColor = {'black'}/>
            </TouchableOpacity>
        )
    },
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLSMSStatistics;