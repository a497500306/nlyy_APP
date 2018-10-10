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
//时间操作
var moment = require('moment');
moment().format();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
import Icon from 'react-native-vector-icons/FontAwesome';

var QuhlsLB = React.createClass({
    getDefaultProps(){
        return {
            userData:null,
            isTihuan : false
        }
    },

    //初始化设置
    getInitialState() {
        //ListView设置
        var tableData = this.props.userData.Drug;
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            animating: true,//是否显示菊花
            tableData:[],
        }
    },

    render() {
        if (this.props.isTihuan == false){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'取药物号历史'} isBack={true} backFunc={() => {
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
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'替换药物号'} isBack={true} backFunc={() => {
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
        console.log("321321")
        console.log(this.props.userData)
        if (this.props.isTihuan == false) {
            if (this.props.userData.persons.StudyDCross.length != 0){
                return (
                    <MLTableCell title={'受试者编号:' + this.props.userData.USubjID} subTitle={'药物号:' + rowData + '\n' + this.props.userData.persons.StudyDCross[rowID]}
                                 subTitleColor={'black'}
                                 rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')}
                                 rightTitleColor={'black'} isArrow={false}
                                 cellHeight = {64}
                    />
                )
            }else if (this.props.userData.persons.DrugDose.length != 0){
                return (
                    <MLTableCell title={'受试者编号:' + this.props.userData.USubjID} subTitle={'药物号:' + rowData + '\n' + this.props.userData.persons.DrugDose[rowID]}
                                 subTitleColor={'black'}
                                 rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')}
                                 rightTitleColor={'black'} isArrow={false}
                                 cellHeight = {64}
                    />
                )
            }else{
                return (
                    <MLTableCell title={'受试者编号:' + this.props.userData.USubjID} subTitle={'药物号:' + rowData}
                                 subTitleColor={'black'}
                                 rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')}
                                 rightTitleColor={'black'} isArrow={false}
                                 cellHeight = {54}
                    />
                )
            }
        }else {
            return(
                <TouchableOpacity onPress={()=>{
                    console.log('111111')
                    console.log(this.props.userData)
                    Alert.alert(
                        "提示:",
                        "是否确定替换药物号",
                        [
                            {text: '确定', onPress: () => {
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
                                                                   this.jiachaQusuijihao(studyDCross[index],rowData,rowID)
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
                                                                   this.yaowujiliangQusuijihao(studyDCross[index],rowData,rowID)
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
                                    //发送登录网络请求
                                    fetch(settings.fwqUrl + "/app/getThywh", {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json; charset=utf-8',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            userId: this.props.userData.id,
                                            user: Users.Users[0],
                                            SiteID: this.props.userData.persons.SiteID,
                                            DrugNum: (rowData.length > 8 ? rowData.substr(6, rowData.length - 6) : rowData),
                                            StudyID: Users.Users[0].StudyID,
                                            Arm: this.props.userData.Arm,
                                            DrugStr: this.props.userData.Drug[rowID],
                                            DrugDateStr: this.props.userData.DrugDate[rowID]
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
                                                        {
                                                            text: '确定', onPress: () => {
                                                            this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                                        }
                                                        }
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
                                                        {
                                                            text: '确定', onPress: () => {
                                                            this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                                        }
                                                        }
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
                            {text: '取消'},
                        ]
                    )
                }}>
                    <MLTableCell title={'受试者编号:' + this.props.userData.USubjID}
                                 subTitle={'药物号:' + rowData + (this.props.userData.persons.DrugDose.length != 0 ? ('\n' + this.props.userData.persons.DrugDose[rowID]) : (this.props.userData.persons.StudyDCross.length != 0 ? ('\n' + this.props.userData.persons.StudyDCross[rowID]) : ''))}
                                 subTitleColor = {'black'}
                                 rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')}
                                 rightTitleColor = {'black'}
                                 cellHeight = {(this.props.userData.persons.DrugDose.length != 0 ? (64) : (this.props.userData.persons.StudyDCross.length != 0 ? (64) : 54))}
                    />
                </TouchableOpacity>
            )
        }
    },

    //交叉设计取随机号
    jiachaQusuijihao(text,rowData,rowID){
        // alert('交叉设计' + text)
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //发送登录网络请求
                        fetch(settings.fwqUrl + "/app/getThywhJcsj", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: this.props.userData.id,
                                user: Users.Users[0],
                                SiteID: this.props.userData.persons.SiteID,
                                DrugNum: (rowData.length > 8 ? rowData.substr(6, rowData.length - 6) : rowData),
                                StudyID: Users.Users[0].StudyID,
                                Arm: this.props.userData.Arm,
                                DrugStr: this.props.userData.Drug[rowID],
                                DrugDateStr: this.props.userData.DrugDate[rowID],
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
                                            {
                                                text: '确定', onPress: () => {
                                                this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                            }
                                            }
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
                                            {
                                                text: '确定', onPress: () => {
                                                this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                            }
                                            }
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
    yaowujiliangQusuijihao(text,rowData,rowID){
        // alert('药物剂量' + text)
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //发送登录网络请求
                        fetch(settings.fwqUrl + "/app/getThywhYwjl", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: this.props.userData.id,
                                user: Users.Users[0],
                                SiteID: this.props.userData.persons.SiteID,
                                DrugNum: (rowData.length > 8 ? rowData.substr(6, rowData.length - 6) : rowData),
                                StudyID: Users.Users[0].StudyID,
                                Arm: this.props.userData.Arm,
                                DrugStr: this.props.userData.Drug[rowID],
                                DrugDateStr: this.props.userData.DrugDate[rowID],
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
                                            {
                                                text: '确定', onPress: () => {
                                                this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                            }
                                            }
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
                                            {
                                                text: '确定', onPress: () => {
                                                this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                            }
                                            }
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
module.exports = QuhlsLB;

