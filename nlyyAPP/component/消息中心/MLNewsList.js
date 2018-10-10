import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ScrollView,
    ListView,
    Alert,
    DeviceEventEmitter
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var List = require('../../node_modules/antd-mobile/lib/list/index');
var MLActivityIndicatorView = require('../MLActivityIndicatorView/MLActivityIndicatorView');
const Item = List.Item;
const Brief = Item.Brief;
var Users = require('../../entity/Users');
var researchParameter = require('../../entity/researchParameter');
var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var MLLookNews = require('./查看消息/MLLookNews');
var MLAddNews = require('./发送消息/MLAddNews')
var settings = require("../../settings");
//时间操作
var moment = require('moment');
moment().format();

var NewsList = React.createClass({
    getInitialState() {
        return {
            animating: true,//是否显示菊花
            //ListView设置
            dataSource: null,
            tableData:[],
        }
    },
    getDefaultProps(){
        return {

        }
    },
    componentWillUnmount(){
        this.subscription.remove();
    },
    //更新数据
    updateNews(){
        this.httpData()
    },
    //耗时操作,网络请求
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('updateNews',this.updateNews);
        this.httpData()
    },

    httpData(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getNewsList", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                UserMP :  Users.Users[0].UserMP
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{
                    //ListView设置
                    var tableData = responseJson.data;
                    this.state.tableData = tableData;
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
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
                    <MLNavigatorBar title={"消息中心"} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} newTitle={"plus-circle"} newFunc={()=>{
                        // 页面的切换
                        this.props.navigator.push({
                            component: MLAddNews,
                        });
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return(
                <View style={styles.container}>
                    <MLNavigatorBar title={'消息中心'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} newTitle={"plus-circle"} newFunc={()=>{
                        // 页面的切换
                        this.props.navigator.push({
                            component: MLAddNews,
                        });
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                </View>
            )
        }
    },
    //返回具体的cell
    renderRow(rowData){
        console.log('233232')
        console.log(rowData)
        return(
            <TouchableOpacity onPress={()=> {

                // 页面的切换
                this.props.navigator.push({
                    component: MLLookNews, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                    //传递参数
                    passProps: {
                        //出生年月
                        data: rowData
                    }
                });
            }}>
                <View style={{
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                    backgroundColor:'white',
                    width:width,
                    height:54
                }}>
                    <View style={{
                        flexDirection:'row',
                        width:width,
                        height:32,
                        justifyContent:'space-between'
                    }}>
                    <Text style={{
                        left:15,
                        top:6
                    }}>{rowData.CRFModeule != null ? ((typeof(rowData.CRFModeule.Subjects.persons.USubjID) == "undefined" ? rowData.CRFModeule.Subjects.persons.USubjectID : rowData.CRFModeule.Subjects.persons.USubjID) + rowData.CRFModeule.CRFModeulesName + (rowData.CRFModeule.CRFModeulesNum + 1)) : rowData.addUsers.UserNam + '发送的消息'}</Text>
                        <Text style={{
                            right:15,
                            top:6,
                            color:rowData.voiceType == 0 ? 'red' : 'gray'
                        }}>{rowData.voiceType == 0 ? '未读' : '已读'}</Text>
                    </View>
                    <Text style={{
                        left:15,
                    }}>{moment(rowData.Date).format("YYYY/MM/DD H:mm:ss")}</Text>
                </View>
            </TouchableOpacity>
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
module.exports = NewsList;