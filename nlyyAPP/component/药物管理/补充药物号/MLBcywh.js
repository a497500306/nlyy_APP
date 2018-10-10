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

var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var NewIcon = require('../../../node_modules/antd-mobile/lib/icon/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
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
                    <MLNavigatorBar title={'补充药物号'} isBack={true} backFunc={() => {
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
    renderRow(rowData,sectionID, rowID){
        console.log(rowData)
        if (rowData.isOut == 1) {
            return(
                <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ('分组:' + rowData.Arm) : "") } subTitleColor = {'black'} rightTitle={'已经完成或退出'} rightTitleColor = {'gray'}/>
            )
        }else {
            if (rowData.isSuccess == 1){
                if (rowData.Random == -1){
                    if (rowData.persons.isBasicData == 1){
                        return(
                            <TouchableOpacity onPress={() => {
                                //错误
                                Alert.alert(
                                    '提示:',
                                    '筛选中受试者不能操作',
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }}>
                                <MLTableCell title={'受试者编号:' + rowData.USubjID}
                                         subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                         subTitleColor={'black'} rightTitle={'筛选中受试者'} rightTitleColor = {'gray'}/>
                            </TouchableOpacity>
                        )
                    }else {
                        var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                        return (
                            <TouchableOpacity onPress={() => {
                                //错误
                                Alert.alert(
                                    '提示:',
                                    grps.length == 1 ? '未给予研究治疗' : '未取随机号',
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }}>
                                <MLTableCell title={'受试者编号:' + rowData.USubjID}
                                             subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                             subTitleColor={'black'}
                                             rightTitle={grps.length == 1 ? "未给予研究治疗" : '随机号:未取'}/>
                            </TouchableOpacity>
                        )
                    }
                }else {
                    var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                    return(
                        <TouchableOpacity onPress={()=>{
                            if (researchParameter.researchParameter.DrugNOpen == 1){
                                //错误
                                Alert.alert(
                                    "提示:",
                                    "请选择你要操作的功能",
                                    [
                                        {text: '发送用药提醒短信', onPress: () => {
                                            //判断该研究是否提供药物号
                                            if (researchParameter.researchParameter.BlindSta == 1){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.persons.id,
                                                        phone : rowData.persons.SubjMP,
                                                        patient: rowData.persons
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }else if (researchParameter.researchParameter.BlindSta == 2){
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.persons.id,
                                                        phone : rowData.persons.SubjMP,
                                                        patient: rowData.persons
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }else {
                                                // 页面的切换
                                                this.props.navigator.push({
                                                    //传递参数
                                                    passProps:{
                                                        userId : rowData.persons.id,
                                                        phone : rowData.persons.SubjMP,
                                                        patient: rowData.persons
                                                    },
                                                    component: yytx, // 具体路由的版块
                                                });
                                            }
                                        }},
                                        {text: '补充药物号', onPress: () => {
                                            if (typeof(researchParameter.researchParameter.StudyDCross) != "undefined" && researchParameter.researchParameter.StudyDCross != ''){
                                                var studyDCross = researchParameter.researchParameter.StudyDCross.split(",");
                                                studyDCross.push('取消')
                                                studyDCross.splice(0, 0, '请选择交叉设计');
                                                Popup.show(
                                                    <View>
                                                        <List renderHeader={this.renderHeader}
                                                              className="popup-list"
                                                        >
                                                            {studyDCross.map((i, index) => (
                                                                <List.Item key={index}
                                                                           style = {{
                                                                               textAlign:'center'
                                                                           }}
                                                                           onClick={()=>{
                                                                               if (index == studyDCross.length - 1 || index == 0){
                                                                                   Popup.hide();
                                                                                   return;
                                                                               }
                                                                               this.jiachaQusuijihao(studyDCross[index],rowData)
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
                                                                            color:(index == studyDCross.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                                                        }}>{i}</Text>
                                                                    </View>
                                                                </List.Item>
                                                            ))}
                                                        </List>
                                                    </View>,
                                                    {maskClosable: true,animationType: 'slide-up' }
                                                )
                                            }else if (typeof(researchParameter.researchParameter.DrugDose) != "undefined" && researchParameter.researchParameter.DrugDose != ''){
                                                var studyDCross = researchParameter.researchParameter.DrugDose.split(",");
                                                studyDCross.push('取消')
                                                studyDCross.splice(0, 0, '请选择药物规格');
                                                Popup.show(
                                                    <View>
                                                        <List renderHeader={this.renderHeader}
                                                              className="popup-list"
                                                        >
                                                            {studyDCross.map((i, index) => (
                                                                <List.Item key={index}
                                                                           style = {{
                                                                               textAlign:'center'
                                                                           }}
                                                                           onClick={()=>{
                                                                               if (index == studyDCross.length - 1 || index == 0){
                                                                                   Popup.hide();
                                                                                   return;
                                                                               }
                                                                               this.yaowujiliangQusuijihao(studyDCross[index],rowData)
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
                                                                            color:(index == studyDCross.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                                                        }}>{i}</Text>
                                                                    </View>
                                                                </List.Item>
                                                            ))}
                                                        </List>
                                                    </View>,
                                                    {maskClosable: true,animationType: 'slide-up' }
                                                )
                                            }else {
                                                //移除等待
                                                this.setState({animating: true});
                                                var UserSite = '';
                                                for (var i = 0; i < Users.Users.length; i++) {
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
                                                        userId: rowData.id,
                                                        SiteID: rowData.persons.SiteID,
                                                        StudyID: Users.Users[0].StudyID,
                                                        Arm: rowData.Arm,
                                                        user: Users.Users[0]
                                                    })
                                                })
                                                    .then((response) => response.json())
                                                    .then((responseJson) => {
                                                        console.log(responseJson);
                                                        if (responseJson.isSucceed != 400) {
                                                            //错误
                                                            Alert.alert(
                                                                '提示:',
                                                                responseJson.msg,
                                                                [
                                                                    {text: '确定'}
                                                                ]
                                                            )
                                                            //移除等待
                                                            this.setState({animating: false});
                                                        } else {
                                                            //错误
                                                            Alert.alert(
                                                                '提示:',
                                                                responseJson.msg,
                                                                [
                                                                    {text: '确定'}
                                                                ]
                                                            )
                                                            //移除等待
                                                            this.setState({animating: false});
                                                        }
                                                    })
                                                    .catch((error) => {//错误
                                                        //移除等待,弹出错误
                                                        this.setState({animating: false});
                                                        //错误
                                                        Alert.alert(
                                                            '提示:',
                                                            '请检查您的网络',
                                                            [
                                                                {text: '确定'}
                                                            ]
                                                        )

                                                    });
                                            }
                                        }},
                                        {text: '取消'}
                                    ]
                                )
                            }else{
                                //错误
                                Alert.alert(
                                    '提示:',
                                    '该研究不提供药物号',
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }
                        }}>
                            <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + rowData.Arm) : "") } subTitleColor = {'black'} rightTitle={grps.length == 1 ? "给予研究治疗" : '随机号:' + rowData.Random} rightTitleColor = {'black'}/>
                        </TouchableOpacity>
                    )
                }
            }else {
                return(
                    <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:不适用")) : "")} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
                )
            }
        }


        /*
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
        */
    },


    //交叉设计取随机号
    jiachaQusuijihao(text,rowData){
        // alert('交叉设计' + text)
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //移除等待
                        this.setState({animating: true});
                        var UserSite = '';
                        for (var i = 0; i < Users.Users.length; i++) {
                            if (Users.Users[i].UserSite != null) {
                                UserSite = Users.Users[i].UserSite
                            }
                        }
                        //发送登录网络请求
                        fetch(settings.fwqUrl + "/app/getBcywhJcsj", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: rowData.id,
                                SiteID: rowData.persons.SiteID,
                                StudyID: Users.Users[0].StudyID,
                                Arm: rowData.Arm,
                                user: Users.Users[0],
                                StudyDCross: text
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson);
                                if (responseJson.isSucceed != 400) {
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                    //移除等待
                                    this.setState({animating: false});
                                } else {
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                    //移除等待
                                    this.setState({animating: false});
                                }
                            })
                            .catch((error) => {//错误
                                //移除等待,弹出错误
                                this.setState({animating: false});
                                //错误
                                Alert.alert(
                                    '提示:',
                                    '请检查您的网络',
                                    [
                                        {text: '确定'}
                                    ]
                                )

                            });
                    }}])
    },

    //药物剂量取随机号
    yaowujiliangQusuijihao(text,rowData){
        // alert('药物剂量' + text)
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //移除等待
                        this.setState({animating: true});
                        var UserSite = '';
                        for (var i = 0; i < Users.Users.length; i++) {
                            if (Users.Users[i].UserSite != null) {
                                UserSite = Users.Users[i].UserSite
                            }
                        }
                        //发送登录网络请求
                        fetch(settings.fwqUrl + "/app/getBcywhYwjl", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: rowData.id,
                                SiteID: rowData.persons.SiteID,
                                StudyID: Users.Users[0].StudyID,
                                Arm: rowData.Arm,
                                user: Users.Users[0],
                                DrugDose: text
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson);
                                if (responseJson.isSucceed != 400) {
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                    //移除等待
                                    this.setState({animating: false});
                                } else {
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                    //移除等待
                                    this.setState({animating: false});
                                }
                            })
                            .catch((error) => {//错误
                                //移除等待,弹出错误
                                this.setState({animating: false});
                                //错误
                                Alert.alert(
                                    '提示:',
                                    '请检查您的网络',
                                    [
                                        {text: '确定'}
                                    ]
                                )

                            });
                    }
                }
                ])
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

