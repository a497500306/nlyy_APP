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
var yytx = require('../用药提醒/MLYytx')
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';

const buttons = ['取消', '添加筛选成功受试者','添加筛选失败受试者','登记受试者','搜索'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
var friendId = 0;
var seveRowData = {};

var Qsjh = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },
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
        console.log(UserSite)
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
                    <MLNavigatorBar title={'受试者随机'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'受试者随机'} newTitle = {"plus-circle"} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} newFunc={() => {
                        this.show(this)
                    }}/>
                    <ListView
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
                            if (sss == 1){//点击修改备注

                            }else if (sss == 2){//点击查看资料

                            }else if (sss == 3) {//点击删除好友

                            }
                        }}
                    />
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        console.log(rowData.isUnblinding)
        console.log(rowData)
            if (rowData.isOut == 1) {
                return(
                    <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")} subTitleColor = {'black'} rightTitle={'已经完成或退出'} rightTitleColor = {'gray'}/>
                )
            }else {
                if (rowData.isSuccess == 1){
                    if (rowData.Random == -1){
                        return (
                            <TouchableOpacity onPress={()=> {
                                //错误
                                Alert.alert(
                                    "提示:",
                                    "请选择你要操作的功能",
                                    [
                                        {
                                            text: '取随机号', onPress: () => {
                                            //移除等待
                                            this.setState({animating: true})
                                            var UserSite = '';
                                            for (var i = 0; i < Users.Users.length; i++) {
                                                if (Users.Users[i].UserSite != null) {
                                                    UserSite = Users.Users[i].UserSite
                                                }
                                            }
                                            //获取中心数据网络请求
                                            fetch(settings.fwqUrl + "/app/getRandomNumber", {
                                                method: 'POST',
                                                headers: {
                                                    'Accept': 'application/json; charset=utf-8',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    StudyID: Users.Users[0].StudyID,
                                                    SubjFa: rowData.persons.SubjFa == null ? '' : rowData.persons.SubjFa ,
                                                    SubjFb: rowData.persons.SubjFb == null ? '' : rowData.persons.SubjFb ,
                                                    SubjFc: rowData.persons.SubjFc == null ? '' : rowData.persons.SubjFc ,
                                                    SubjFd: rowData.persons.SubjFd == null ? '' : rowData.persons.SubjFd ,
                                                    SubjFe: rowData.persons.SubjFe == null ? '' : rowData.persons.SubjFe ,
                                                    SubjFf: rowData.persons.SubjFf == null ? '' : rowData.persons.SubjFf ,
                                                    SubjFg: rowData.persons.SubjFg == null ? '' : rowData.persons.SubjFg ,
                                                    SubjFh: rowData.persons.SubjFh == null ? '' : rowData.persons.SubjFh ,
                                                    SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ?  (rowData.persons.SubjFi  == null ? '' : rowData.persons.SubjFi ): '',
                                                    SiteID: UserSite,
                                                    user:Users.Users[0],
                                                    userId: rowData.persons.id,
                                                    czzUser:Users.Users[0],
                                                    sjzUser : rowData.persons
                                                })
                                            })
                                                .then((response) => response.json())
                                                .then((responseJson) => {
                                                    this.setState({
                                                        animating: false
                                                    })
                                                    if (responseJson.isSucceed == 200) {
                                                        //错误
                                                        Alert.alert(
                                                            "提示",
                                                            responseJson.msg,
                                                            [
                                                                {text: '确定'}
                                                            ]
                                                        )
                                                    } else {
                                                        //错误
                                                        Alert.alert(
                                                            "提示",
                                                            responseJson.msg,
                                                            [
                                                                {
                                                                    text: '确定', onPress: () => {
                                                                    this.props.navigator.pop()
                                                                }
                                                                }
                                                            ]
                                                        )
                                                    }
                                                })
                                                .catch((error) => {//错误
                                                    this.setState({
                                                        animating: false
                                                    })
                                                    this.setState({animating: false});
                                                    console.log(error),
                                                        //错误
                                                        Alert.alert(
                                                            '请检查您的网络111',
                                                            null,
                                                            [
                                                                {text: '确定'}
                                                            ]
                                                        )
                                                });
                                        }
                                        },
                                        {text: '取消'}
                                    ]
                                )
                            }}>
                                <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                             subTitleColor={'black'} rightTitle={'随机号:未取'}/>
                            </TouchableOpacity>
                        )
                    }else {
                        return(
                            <TouchableOpacity onPress={()=>{
                                //错误
                                Alert.alert(
                                    "提示:",
                                    "请选择你要操作的功能",
                                    [
                                        {text: '发送用药提醒短信', onPress: () => {
                                            console.log('xxxxxxxxx')
                                            console.log(rowData)
                                            //判断该研究是否提供药物号
                                            if (researchParameter.researchParameter.BlindSta == 1){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.id,
                                                        phone : rowData.persons == null ? rowData.phone :rowData.persons.SubjMP
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }else if (researchParameter.researchParameter.BlindSta == 2){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.id,
                                                        phone : rowData.persons == null ? rowData.phone :rowData.persons.SubjMP
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }else {
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.id,
                                                        phone : rowData.persons == null ? rowData.phone :rowData.persons.SubjMP
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }
                                        }},
                                        {text: '添加为筛选成功'},
                                        {text: '添加为筛选失败'},
                                        {text: '取消'}
                                    ]
                                )
                            }}>
                                <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3)? ('分组:' + rowData.Arm) : "") } subTitleColor = {'black'} rightTitle={'随机号:' + rowData.Random} rightTitleColor = {'black'}/>
                            </TouchableOpacity>
                        )
                    }
                }else {
                    return(
                        <View/>
                        // <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:不适用")) : "")} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
                    )
                }
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
});

// 输出组件类
module.exports = Qsjh;

