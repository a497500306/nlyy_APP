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
    TextInput,
    ActivityIndicator,
    Alert,
    ListView,
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Button = require('apsl-react-native-button');

var settings = require('../../../../settings');
var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../../entity/Users');
var MLActivityIndicatorView = require('../../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../../MLTableCell/MLTableCell');
var Ywqd = require('../MLYwqd');
var FPChangku = require('../保存数据/FPChangku');
var FPZhongxin = require('../保存数据/FPZhongxin');
var FPQDData = require('../保存数据/FPQDData');
var Changku = require('../../../../entity/Changku');
import Icon from 'react-native-vector-icons/FontAwesome';

var Zgfp = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            title:'确 定',
            tableData:[],
            xuanzhongData:[],
            isShowWait : false,
            showLoginBtn : false,
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        console.log('逐个分配');
        console.log(FPChangku.FPChangku);
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getAllDrug", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                DepotGNYN : Changku.Changku == null ? 0 : Changku.Changku.DepotGNYN,//是否为主仓库:1是,0不是
                DepotBrYN : Changku.Changku == null ? 0 : Changku.Changku.DepotBrYN,//是否为分仓库:1是,0不是
                DepotId : Changku.Changku == null ? 0 : Changku.Changku.id,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isSucceed != 400){
                    //移除等待
                    this.setState({animating:false});
                }else{
                    //ListView设置
                    var tableData = [];
                    for (var i = 0 ; i < responseJson.data.length ; i++){
                        var changku = responseJson.data[i];
                        tableData.push(changku)
                    }
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
                    <MLNavigatorBar title={'逐个分配'} isBack={true} backFunc={() => {
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
                    <MLNavigatorBar title={'逐个分配'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <Button
                        style={{
                            width:width - 40,
                            marginTop:10,
                            marginLeft:20,
                            height:40,
                            backgroundColor:'rgba(0,136,212,1.0)',
                            // 设置圆角
                            borderRadius:5,
                            marginBottom:10,
                            borderColor: 'rgba(0,136,212,1.0)',
                            borderWidth: 1,
                        }}
                        isLoading={this.state.isShowWait}
                        isDisabled={this.state.showLoginBtn}
                        textStyle={{
                            color: 'white',
                            fontSize:15
                        }}
                        onPress={this.getLogin}>
                        确 定
                    </Button>
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        if (this.state.tableData[rowID].isSelected == true){
            return(
                <TouchableOpacity onPress={()=>{
                    this.state.tableData[rowID].isSelected = !this.state.tableData[rowID].isSelected
                    console.log('取消添加' + this.state.tableData[rowID].isSelected)

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //把id从数组中拿出来
                    console.log(this.state.tableData[rowID].id)
                    var jj = 0;
                    for(var i = 0 ; i < this.state.xuanzhongData.length ; i++){
                        if (this.state.xuanzhongData[i] == this.state.tableData[rowID].id){
                            this.state.xuanzhongData.splice(i,1);
                        }
                    }
                    if (this.state.xuanzhongData.length == 0){
                        this.state.title = '确 定'
                    }else{
                        this.state.title = '确 定( ' + this.state.xuanzhongData.length + ' )'
                    }

                    console.log(this.state.xuanzhongData)
                }}>
                    <MLTableCell title={rowData.DrugNum} isArrow = {false}  iconTitl='check' iconColor='rgba(0,136,212,1.0)'/>
                </TouchableOpacity>
            )
        }else{
            this.state.tableData[rowID].isSelected = false;
            return(
                <TouchableOpacity onPress={()=>{
                    this.state.tableData[rowID].isSelected = !this.state.tableData[rowID].isSelected
                    console.log('添加进去' + this.state.tableData[rowID].isSelected)

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //把id添加到数组中
                    this.state.xuanzhongData.push(this.state.tableData[rowID].id)
                    console.log(this.state.xuanzhongData)
                    this.state.title = '确 定( ' + this.state.xuanzhongData.length + ' )'
                }}>
                    <MLTableCell title={rowData.DrugNum} isArrow = {false}/>
                </TouchableOpacity>
            )
        }
    },

    //点击确定
    getLogin(){
        if (this.state.xuanzhongData.length != 0){
            this.setState({animating:true});
            //发送网络请求
            fetch(settings.fwqUrl + "/app/getZgfp", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ids: this.state.xuanzhongData,
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
        }else{
            //错误
            Alert.alert(
                '提示:',
                '请选择最少一个药物号',
                [
                    {text: '确定'}
                ]
            )
        }
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginTop:10,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
        marginBottom:10
    },
});

// 输出组件类
module.exports = Zgfp;

