

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
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var settings = require('../../../settings');
var MLProgressHUD = require('../../MLProgressHUD/MLProgressHUD');
var DjmCKJD = require('./MLDjmCKJD')
//时间操作
var moment = require('moment');
moment().format();

var DjmNewLB = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
            isHud:false,
        }
    },
    getDefaultProps(){
        return {
            UnblindingType:null,
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getAllStayUnblindingApplication", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users[0].StudyID,
                UserMP:Users.Users[0].UserMP
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
                    var tableData = responseJson.data;
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

                    <MLNavigatorBar title={'待揭盲'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.cuowu == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'待揭盲'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'待揭盲'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <MLProgressHUD text={"正在加载..."} isVisible={this.state.isHud} />
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity style={{marginTop : 10,}} onPress={()=>{
                //判断用户类型
                //判断改用户是不是随机化专员
                var isSJHZY = false;
                console.log(Users.Users)
                for (var i = 0 ; i < Users.Users.length ; i++) {
                    if (Users.Users[i].UserFun == 'C1') {
                        isSJHZY = true
                        console.log('有C1模块')
                    }
                }
                console.log(isSJHZY)
                if (isSJHZY == true){//是随机化专员
                    //错误
                    Alert.alert(
                        '提示',
                        '您可选择您的操作',
                        [
                            {text: '查看进度', onPress: () => {
                                // 页面的切换
                                this.props.navigator.push({
                                    component: DjmCKJD, // 具体路由的版块
                                    //传递参数
                                    passProps: {
                                        //出生年月
                                        datas:rowData,
                                    }
                                });
                            }},
                            {text: '取消'}
                        ]
                    )
                }else{//不是随机化专员
                    //错误
                    Alert.alert(
                        '提示',
                        '您可选择您的操作',
                        [
                            {text: '查看进度', onPress: () => {
                                // 页面的切换
                                this.props.navigator.push({
                                    component: DjmCKJD, // 具体路由的版块
                                    //传递参数
                                    passProps: {
                                        //出生年月
                                        datas:rowData,
                                    }
                                });
                            }},
                            {text: '取消'}
                        ]
                    )
                }
            }}>
                {/*设置内容*/}
                {this.renderNeirong(rowData)}
            </TouchableOpacity>
        )
    },

    //设置左边图标
    renderNeirong(rowData){
        console.log("11111")
        console.log(rowData)
        if (rowData.UnblindingType == 4){
            var shengqingren = '';
            for (var i = 0 ; i < rowData.UserNam.length ; i++){
                shengqingren = shengqingren + rowData.UserNam[i] + ';'
            }

            var wangchengzhuantai = '';
            for (var i = 0 ; i < rowData.ToExamineUsers.length; i++){
                if (rowData.ToExamineType[i] == 1){
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批通过;"
                }else{
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批不通过;"
                }
            }
            return(
                <View style={{
                    backgroundColor:'white',
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                }}>

                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'研究编号:' + rowData.StudyID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'研究简称:' + rowData.study.StudNameS}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请类型:' + '整个研究紧急揭盲'}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'不良事件因果关系:' + rowData.Causal[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'揭盲原因:' + rowData.Reason[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请时间:' + moment(rowData.UnblApplDTC).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请人:' + shengqingren}</Text>
                    <Text style={{
                        marginBottom : 5,
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'完成状态:' + (wangchengzhuantai == '' ? '未审批' : wangchengzhuantai)}</Text>
                </View>
            )
        }else if (rowData.UnblindingType == 3){
            var shengqingren = '';
            for (var i = 0 ; i < rowData.UserNam.length ; i++){
                shengqingren = shengqingren + rowData.UserNam[i] + ';'
            }

            var wangchengzhuantai = '';
            for (var i = 0 ; i < rowData.ToExamineUsers.length; i++){
                if (rowData.ToExamineType[i] == 1){
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批通过;"
                }else{
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批不通过;"
                }
            }
            return(
                <View style={{
                    backgroundColor:'white',
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                }}>

                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'研究编号:' + rowData.StudyID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心编号:' + rowData.SiteID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心名称:' + rowData.SiteNam}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请类型:' + '单个中心紧急揭盲'}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'不良事件因果关系:' + rowData.Causal[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'揭盲原因:' + rowData.Reason[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请时间:' + moment(rowData.UnblApplDTC).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请人:' + shengqingren}</Text>
                    <Text style={{
                        marginBottom : 5,
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'完成状态:' + (wangchengzhuantai == '' ? '未审批' : wangchengzhuantai)}</Text>
                </View>
            )
        }else if (rowData.UnblindingType == 2){
            var shengqingren = '';
            for (var i = 0 ; i < rowData.UserNam.length ; i++){
                shengqingren = shengqingren + rowData.UserNam[i] + ';'
            }

            var wangchengzhuantai = '';
            for (var i = 0 ; i < rowData.ToExamineUsers.length; i++){
                if (rowData.ToExamineType[i] == 1){
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批通过;"
                }else{
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批不通过;"
                }
            }
            return(
                <View style={{
                    backgroundColor:'white',
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                }}>

                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'研究编号:' + rowData.StudyID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心编号:' + rowData.SiteID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心名称:' + rowData.SiteNam}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者编号:' + rowData.Users.USubjID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者姓名缩写:' + rowData.Users.SubjIni}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者手机号:' + rowData.Users.SubjMP}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请类型:' + '单个受试者紧急揭盲'}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'不良事件因果关系:' + rowData.Causal[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'揭盲原因:' + rowData.Reason[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请时间:' + moment(rowData.UnblApplDTC).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请人:' + shengqingren}</Text>
                    <Text style={{
                        marginBottom : 5,
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'完成状态:' + (wangchengzhuantai == '' ? '未审批' : wangchengzhuantai)}</Text>
                </View>
            )
        }else{
            var shengqingren = '';
            for (var i = 0 ; i < rowData.UserNam.length ; i++){
                shengqingren = shengqingren + rowData.UserNam[i] + ';'
            }

            var wangchengzhuantai = '';
            for (var i = 0 ; i < rowData.ToExamineUsers.length; i++){
                if (rowData.ToExamineType[i] == 1){
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批通过;"
                }else{
                    wangchengzhuantai = wangchengzhuantai + rowData.ToExamineUsers[i] + "审批不通过;"
                }
            }
            return(
                <View style={{
                    backgroundColor:'white',
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                }}>

                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'研究编号:' + rowData.StudyID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心编号:' + rowData.SiteID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心名称:' + rowData.SiteNam}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者编号:' + rowData.Users.USubjID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者姓名缩写:' + rowData.Users.SubjIni}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者手机号:' + rowData.Users.SubjMP}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请类型:' + '单个受试者特定揭盲'}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'不良事件因果关系:' + rowData.Causal[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'揭盲原因:' + rowData.Reason[0]}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请时间:' + moment(rowData.UnblApplDTC).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'申请人:' + shengqingren}</Text>
                    <Text style={{
                        marginBottom : 5,
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'完成状态:' + (wangchengzhuantai == '' ? '未审批' : wangchengzhuantai)}</Text>
                </View>
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
module.exports = DjmNewLB;



