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
var yytx = require('../../受试者随机/用药提醒/MLYytx')
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
import Icon from 'react-native-vector-icons/FontAwesome';

var Bcywh = React.createClass({
    getDefaultProps(){
        return {
            data:null
        }
    },
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[],
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
        if (this.props.data == null) {

            this.setState({
                DrugId : this.props.DrugId,
                UsedAddressId : this.props.UsedAddressId,
            })
            //发送登录网络请求
            fetch(settings.fwqUrl + "/app/getLookupSuccessBasicsData", {
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
        }else {
            //ListView设置
            var tableData = this.props.data;
            this.state.tableData = tableData;
            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
            this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
            //移除等待
            this.setState({animating:false});
        }
    },


    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'补充药物号'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'补充药物号'} isBack={true} backFunc={() => {
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
    renderRow(rowData,sectionID, rowID){
        console.log(rowData)
        return(
            <TouchableOpacity onPress={()=>{
                if (rowData.isSuccess != 1){
                    //错误
                    Alert.alert(
                        '提示',
                        '筛选失败患者无操作',
                        [
                            {text: '确定'}
                        ]
                    )
                    return
                }
                //错误
                Alert.alert(
                    "提示:",
                    "请选择你要操作的功能",
                    [
                        {text: '发送药物提醒短信', onPress: () => {
                            //判断该研究是否提供药物号
                            if (researchParameter.researchParameter.BlindSta == 1){
                                // 页面的切换
                                this.props.navigator.push({
                                    //传递参数
                                    passProps:{
                                        userId : rowData.id,
                                        phone : rowData.SubjMP
                                    },
                                    component: yytx, // 具体路由的版块
                                });
                            }else if (researchParameter.researchParameter.BlindSta == 2){
                                if (researchParameter.researchParameter.DrugNSBlind == 1){
                                    // 页面的切换
                                    this.props.navigator.push({
                                        //传递参数
                                        passProps:{
                                            userId : rowData.id,
                                            phone : rowData.SubjMP
                                        },
                                        component: yytx, // 具体路由的版块
                                    });
                                }else{
                                    //错误
                                    Alert.alert(
                                        '提示',
                                        '该研究不提供药物号',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }
                            }else {
                                if (researchParameter.researchParameter.DrugNOpen == 1){
                                    // 页面的切换
                                    this.props.navigator.push({
                                        //传递参数
                                        passProps:{
                                            userId : rowData.id,
                                            phone : rowData.SubjMP
                                        },
                                        component: yytx, // 具体路由的版块
                                    });
                                }else{
                                    Alert.alert(
                                        '提示',
                                        '该研究不提供药物号',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }
                            }
                        }},
                        {text: '补充药物号', onPress: () => {
                            //移除等待
                            this.setState({animating:true});
                            var UserSite = '';
                            for (var i = 0 ; i < Users.Users.length ; i++) {
                                if (Users.Users[i].UserSite != null) {
                                    UserSite = Users.Users[i].UserSite
                                }
                            }
                            //发送登录网络请求
                            fetch(settings.fwqUrl + "/app/getBcywh", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId : rowData.id,
                                    SiteID : UserSite,
                                    StudyID : Users.Users[0].StudyID
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    console.log(responseJson);
                                    if (responseJson.isSucceed != 400){
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                        //移除等待
                                        this.setState({animating:false});
                                    }else{
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ]
                                        )
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
                        }},
                        {text: '取消'}
                    ]
                )
            }}>
                <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={rowData.isSuccess == 1 ? '随机号:' + rowData.Random : "筛选失败受试者"} rightTitleColor = {rowData.isSuccess == 1 ? 'black': "gray"}/>
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
});

// 输出组件类
module.exports = Bcywh;

