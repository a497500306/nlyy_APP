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
        console.log(rowData)
        if (this.props.isTihuan == false) {
            return (
                <MLTableCell title={'受试者编号:' + this.props.userData.USubjID} subTitle={'药物号:' + rowData}
                             subTitleColor={'black'}
                             rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')}
                             rightTitleColor={'black'} isArrow={false}/>
            )
        }else {
            return(
                <TouchableOpacity onPress={()=>{
                    console.log(rowData)
                    Alert.alert(
                        "提示:",
                        "是否确定替换药物号",
                        [
                            {text: '确定', onPress: () => {
                                var UserSite = '';
                                for (var i = 0 ; i < Users.Users.length ; i++) {
                                    if (Users.Users[i].UserSite != null) {
                                        UserSite = Users.Users[i].UserSite
                                    }
                                }
                                //发送登录网络请求
                                fetch(settings.fwqUrl + "/app/getThywh", {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json; charset=utf-8',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId :  this.props.userData.id,
                                        SiteID : UserSite,
                                        DrugNum : (rowData.length > 8 ? rowData.substr(6,rowData.length - 6) : rowData),
                                        StudyID : Users.Users[0].StudyID,
                                        Arm : this.props.userData.Arm,
                                        DrugStr : this.props.userData.Drug[rowID],
                                        DrugDateStr : this.props.userData.DrugDate[rowID]
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
                                                    {text: '确定', onPress: () => {
                                                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                                    }}
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
                                                    {text: '确定', onPress: () => {
                                                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                                    }}
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
                            {text: '取消'},
                        ]
                    )
                }}>
                    <MLTableCell title={'受试者编号:' + this.props.userData.USubjID} subTitle={'药物号:' + rowData} subTitleColor = {'black'} rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')} rightTitleColor = {'black'}/>
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
});

// 输出组件类
module.exports = QuhlsLB;

