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
var Popup = require('../../node_modules/antd-mobile/lib/popup/index');

var netTool = require('../../kit/net/netTool'); //网络请求

var Toast = require('../../node_modules/antd-mobile/lib/toast/index');
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
        var markTypeStr = ""
        //标记状态,0:未解决,1:已解决,2:不需要解决,3:取消标记
        if (rowData.markType == 0){
            markTypeStr = "未解决"
        }else if (rowData.markType == 1){
            markTypeStr = "已解决"
        }else if (rowData.markType == 2){
            markTypeStr = "不需要解决"
        }else if (rowData.markType == 3){
            markTypeStr = ""
        }
        return(
            <TouchableOpacity 
            onLongPress={()=>{
                //错误
                this.cellOnLongPress(rowData)
            }}
            onPress={()=> {

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
                    width:width
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
                    <View style={{
                        flexDirection:'row',
                        width:width,
                        height:22,
                        justifyContent:'space-between'
                    }}>
                        <Text style={{
                            left:15,
                        }}>{moment(rowData.Date).format("YYYY/MM/DD H:mm:ss")}</Text>
                        <Text style={{
                            right:15,
                            // color:rowData.voiceType == 0 ? 'red' : 'gray'
                        }}>{markTypeStr}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    },

    // 长按回调
    cellOnLongPress(rowData){
        var array = ["请选择你想做的","已解决","不需要解决","取消标记","取消"];
        Popup.show(
            <View>
                <List renderHeader={this.renderHeader}
                      className="popup-list"
                >
                    {array.map((i, index) => (
                        <List.Item key={index}
                                   style = {{
                                       textAlign:'center'
                                   }}
                                   onClick={()=>{
                                       if (index == array.length - 1 || index == 0){
                                           Popup.hide();
                                           return;
                                       }
                                       
                                       var url = "/app/getMarkType"
                                       Toast.loading('请稍候...',60);
                                    netTool.post(settings.fwqUrl + url,{messageIDNum : rowData.messageIDNum , markType : index})
                                    .then((responseJson) => {
                                        Toast.hide()
                                        this.updateNews()
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ],
                                            {cancelable : false}
                                        )
                                    })
                                    .catch((error)=>{
                                        Toast.hide()
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            '请检查您的网络111',
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                    })
                                    Popup.hide();
                                   }}
                        >
                            <View style={{
                                width:width - 30,
                                alignItems:'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{
                                    fontSize:index == 0 ? 12 : 16,
                                    color:(index == array.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                }}>{i}</Text>
                            </View>
                        </List.Item>
                    ))}
                </List>
            </View>,
            {maskClosable: true,animationType: 'slide-up' }
        )
    }
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