

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
    DeviceEventEmitter
} from 'react-native';

var List = require('../../../node_modules/antd-mobile/lib/list/index');
const Item = List.Item;
const Brief = Item.Brief;
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var settings = require('../../../settings');
var Button = require('apsl-react-native-button');
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLSelectUser = React.createClass({
    getDefaultProps(){
        return {
            selectPhone:[]
        }
    },
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[]
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        console.log('123123123');
        console.log(Users.Users);
        var UserSite = null;
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            UserSite = data.UserSite;
        }
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            if (data.UserSiteYN == 1){
                UserSite = null;
            }
        }
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getShowSiteUsers", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                UserSite: UserSite
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                    //错误
                    Alert.alert(
                        '提示',
                        '请检查您的网络',
                        [
                            {text: '确定'}
                        ]
                    )
                }else{
                    //ListView设置
                    var tableData = [];
                    console.log('321321')
                    console.log(this.props.selectPhone.length)
                    var data = responseJson.data;
                    for (var i = 0 ; i < this.props.selectPhone.length ; i++){
                        for (var j = 0 ; j < data.length ; j++){
                            if (this.props.selectPhone[i] == data[j].UserMP){
                                data[j].isSelect = true;
                            }
                        }
                    }
                    tableData = data;

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(tableData),tableData:tableData});
                    //移除等待
                    this.setState({animating:false});
                }
            })
            .catch((error) => {//错误
                //移除等待,弹出错误
                this.setState({animating:false});
                //错误
                Alert.alert(
                    '提示',
                    '请检查您的网络',
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
                    <MLNavigatorBar title={'选择联系人'} isBack={true} backFunc={() => {
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
                    <MLNavigatorBar title={'选择联系人'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} rightTitle={"操作"} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} newFunc={()=>{
                        var array = ["请选择你的操作","全选"];
                        var UserSite = null;
                        for (var i = 0 ; i < Users.Users.length ; i++){
                            var data = Users.Users[i];
                            UserSite = data.UserSite;
                        }
                        for (var i = 0 ; i < Users.Users.length ; i++){
                            var data = Users.Users[i];
                            if (data.UserSiteYN == 1){
                                UserSite = null;
                            }
                        }
                        var userID = null;
                        if (UserSite != null){
                            userID = UserSite.split(",");
                            for(var i in userID){
                                array.push(userID[i]);
                            }
                        }
                        array.push('取消');
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
                                                       if (index == 1){//全选
                                                           var datas = this.state.tableData;
                                                           for (var i = 0 ; i < datas.length ; i++){
                                                                   datas[i].isSelect = true;
                                                           }
                                                           var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                                           this.setState({dataSource: ds.cloneWithRows(datas),tableData:datas});
                                                       }else{//选择某个中心
                                                           var datas = this.state.tableData;
                                                           for (var i = 0 ; i < datas.length ; i++){
                                                               datas[i].isSelect = false;
                                                           }
                                                           //选择中心
                                                           var zhongxin = array[index];
                                                           for (var y = 0 ; y < datas.length ; y++){
                                                               if ( typeof(datas[y].UserSite)!="undefined") {
                                                                   var userID = datas[y].UserSite.split(",");
                                                                   for (var v = 0; v < userID.length; v++) {
                                                                       if (userID[v] = zhongxin) {
                                                                           datas[y].isSelect = true;
                                                                       }
                                                                   }
                                                               }
                                                           }
                                                           var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                                           this.setState({dataSource: ds.cloneWithRows(datas),tableData:datas});
                                                       }
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
                    }}/>

                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <TouchableOpacity style={{
                        // 设置主轴的方向
                        flexDirection:'row',
                        // 垂直居中 ---> 设置侧轴的对齐方式
                        alignItems:'center',
                        // 设置主轴的对齐方式
                        justifyContent:'center',
                        width:width - 40,
                        marginTop:20,
                        marginLeft:20,
                        marginBottom:10,
                        height:40,
                        backgroundColor:'rgba(0,136,212,1.0)',
                        // 设置圆角
                        borderRadius:5,
                    }} onPress={()=>{
                        var selectPhone = [];
                        var selectUsers = [];
                        for (var i = 0 ; i < this.state.tableData.length ; i++){
                            if (this.state.tableData[i].isSelect == true){
                                selectPhone.push(this.state.tableData[i].UserMP);
                                selectUsers.push(this.state.tableData[i])
                            }
                        }
                        //发送通知
                        DeviceEventEmitter.emit('selectUserOver', selectPhone,selectUsers);
                        this.props.navigator.pop()
                    }}>
                        <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                            确 定
                        </Text>
                    </TouchableOpacity>
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData){
        if (rowData.isSelect == true){
            return(
                <TouchableOpacity onPress={()=>{
                    var datas = this.state.tableData;
                    for (var i = 0 ; i < datas.length ; i++){
                        if (datas[i].UserMP == rowData.UserMP){
                            datas[i].isSelect = false;
                        }
                    }
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(datas),tableData:datas});
                }}>
                    <MLTableCell title={rowData.UserNam} rightTitle={rowData.UserMP} rightTitleColor={'gray'} isArrow = {false}  iconTitl='check' iconColor='rgba(0,136,212,1.0)'/>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity onPress={()=>{
                    var datas = this.state.tableData;
                    for (var i = 0 ; i < datas.length ; i++){
                        if (datas[i].UserMP == rowData.UserMP){
                            datas[i].isSelect = true;
                        }
                    }
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(datas),tableData:datas});
                }}>
                    <MLTableCell title={rowData.UserNam} rightTitle={rowData.UserMP} rightTitleColor={'gray'} isArrow = {false} />
                </TouchableOpacity>
            )
        }
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
module.exports = MLSelectUser;



