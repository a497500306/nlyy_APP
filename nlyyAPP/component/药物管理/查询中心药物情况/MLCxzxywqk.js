// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */
//
// import React, { Component } from 'react';
// import {
//     AppRegistry,
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     Navigator,
//     ListView,
//     Alert
// } from 'react-native';
//
//
// var Dimensions = require('Dimensions');
// var {width, height} = Dimensions.get('window');
//
// var settings = require('../../../settings');
// var Users = require('../../../entity/Users');
// var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
// var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
//
// var Cxzxywqk = React.createClass({
//     getInitialState() {
//         return {
//             animating: true,//是否显示菊花
//             data: null,//数据
//             //ListView设置
//             dataSource: null
//         }
//     },
//     //耗时操作,网络请求
//     componentDidMount(){
//         //发送登录网络请求
//         fetch(settings.fwqUrl + "/app/getSiteDrugData", {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json; charset=utf-8',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 StudyID : Users.Users.StudyID,
//                 UsedCoreId : Users.Users.UserSite,
//             })
//         })
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 console.log(responseJson)
//                 if (responseJson.isSucceed == 400){
//                     this.setState({data: responseJson})
//                     //ListView设置
//                     var tableData = [];
//                     tableData.push('研究编号')
//                     tableData.push('中心编号')
//                     tableData.push('目前库存量')
//                     tableData.push('已签收药物量')
//                     tableData.push('已激活药物量')
//                     tableData.push('已发放药物量')
//                     tableData.push('已揭盲药物量')
//                     tableData.push('已替换药物量')
//                     tableData.push('已废弃药物量')
//                     var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
//                     this.setState({dataSource: ds.cloneWithRows(tableData)});
//                     //移除等待
//                     this.setState({animating:false});
//                 }else {
//                     //移除等待
//                     this.setState({animating:false});
//                     //错误
//                     Alert.alert(
//                         '提示:',
//                         '请检查您的网络',
//                         [
//                             {text: '确定'}
//                         ]
//                     )
//                 }
//
//             })
//             .catch((error) => {//错误
//                 //移除等待,弹出错误
//                 this.setState({animating:false});
//                 //错误
//                 Alert.alert(
//                     '提示:',
//                     '请检查您的网络',
//                     [
//                         {text: '确定'}
//                     ]
//                 )
//
//             });
//     },
//     render() {
//         if (this.state.animating == true){
//             return (
//                 <View style={styles.container}>
//
//                     <MLNavigatorBar title={'中心用药情况'} isBack={true} backFunc={() => {
//                         this.props.navigator.pop()
//                     }}/>
//
//                     {/*设置完了加载的菊花*/}
//                     <MLActivityIndicatorView />
//                 </View>
//
//             );
//         }else{
//             return (
//                 <View style={styles.container}>
//
//                     <MLNavigatorBar title={'中心用药情况'} isBack={true} backFunc={() => {
//                         this.props.navigator.pop()
//                     }}/>
//
//                     <ListView
//                         dataSource={this.state.dataSource}//数据源
//                         renderRow={this.renderRow}
//                     />
//                 </View>
//
//             );
//         }
//     },
//     //返回具体的cell
//     renderRow(rowData){
//         var berStr = '';
//         console.log('123');
//         console.log(this.state.data);
//         if(rowData == "研究编号") {
//             berStr = this.state.data.data.StudyID
//         }
//         if(rowData == "中心编号") {
//             berStr = this.state.data.data.UsedCoreId
//         }
//         if(rowData == "目前库存量") {
//             berStr = this.state.data.data.MQKCL
//         }
//         if(rowData == "已签收药物量") {
//             berStr = this.state.data.data.YQSYWL
//         }
//         if(rowData == "已激活药物量") {
//             berStr = this.state.data.data.YJHYWL
//         }
//         if(rowData == "已发放药物量") {
//             berStr = this.state.data.data.YFFYWL
//         }if(rowData == "已揭盲药物量") {
//             berStr = this.state.data.data.YJMYWL
//         }
//         if(rowData == "已替换药物量") {
//             berStr = this.state.data.data.YTHYWL
//         }
//         if(rowData == "已废弃药物量") {
//             berStr = this.state.data.data.YFQYWL
//         }
//         return(
//             /*
//              tableData.push('研究编号')
//              tableData.push('中心编号')
//              tableData.push('目前库存量')
//              tableData.push('已签收药物量')
//              tableData.push('已激活药物量')
//              tableData.push('已发放药物量')
//              tableData.push('已揭盲药物量')
//              tableData.push('已替换药物量')
//              tableData.push('已废弃药物量')*/
//             <MLTableCell title={rowData} isArrow = {false}/>
//         )
//     },
// });
//
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // justifyContent: 'center',
//         // alignItems: 'center',
//         backgroundColor: 'rgba(233,234,239,1.0)',
//     },
// });
//
// // 输出组件类
// module.exports = Cxzxywqk;
//
/**
 * Created by maoli on 16/10/9.
 */
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
    ListView,
    Alert
} from 'react-native';

var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var ResearchCore = require('../研究中心/MLResearchCore');
var Warehouse = require('../仓库/MLWarehouse');
var users = require('../../../entity/Users')
var Cxzxywqk = require('../查询中心药物情况/MLCxzxywqk')

var Cxzxywqk = React.createClass({
    getInitialState() {

        //ListView设置
        var tableData = [];
        tableData.push('研究编号')
        tableData.push('中心编号')
        tableData.push('目前库存量')
        tableData.push('已签收药物量')
        tableData.push('已激活药物量')
        tableData.push('已发放药物量')
        tableData.push('已揭盲药物量')
        tableData.push('已替换药物量')
        tableData.push('已废弃药物量')

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            data:null
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getSiteDrugData", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID : Users.Users.StudyID,
                UsedCoreId : Users.Users.UserSite,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.isSucceed == 400){
                    this.setState({data: responseJson})
                    //ListView设置
                    var tableData = [];
                    tableData.push('研究编号')
                    tableData.push('中心编号')
                    tableData.push('目前库存量')
                    tableData.push('已签收药物量')
                    tableData.push('已激活药物量')
                    tableData.push('已发放药物量')
                    tableData.push('已揭盲药物量')
                    tableData.push('已替换药物量')
                    tableData.push('已废弃药物量')
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(tableData)});
                    //移除等待
                    this.setState({animating:false});
                }else {
                    //移除等待
                    this.setState({animating:false});
                    //错误
                    Alert.alert(
                        '提示:',
                        '请检查您的网络',
                        [
                            {text: '确定'}
                        ]
                    )
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
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'查询中心用药情况'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                {/*<ScrollView>*/}
                {/*{this.tableCell()}*/}
                {/*</ScrollView>*/}
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData){

        var berStr = '';
        if(rowData == "研究编号") {
            if (this.state.data != null){
                berStr = this.state.data.data.StudyID
            }else{
                berStr = ''
            }
        }
        if(rowData == "中心编号") {
            if (this.state.data != null){
                berStr = this.state.data.data.UsedCoreId
            }else{
                berStr = ''
            }
        }
        if(rowData == "目前库存量") {
            if (this.state.data != null){
                berStr = this.state.data.data.MQKCL
            }else{
                berStr = ''
            }
        }
        if(rowData == "已签收药物量") {
            if (this.state.data != null){
                berStr = this.state.data.data.YQSYWL
            }else{
                berStr = ''
            }
        }
        if(rowData == "已激活药物量") {
            if (this.state.data != null){
                berStr = this.state.data.data.YJHYWL
            }else{
                berStr = ''
            }
        }
        if(rowData == "已发放药物量") {
            if (this.state.data != null){
                berStr = this.state.data.data.YFFYWL
            }else{
                berStr = ''
            }
        }if(rowData == "已揭盲药物量") {
            if (this.state.data != null){
                berStr = this.state.data.data.YJMYWL
            }else{
                berStr = ''
            }
        }
        if(rowData == "已替换药物量") {
            if (this.state.data != null){
                berStr = this.state.data.data.YTHYWL
            }else{
                berStr = ''
            }
        }
        if(rowData == "已废弃药物量") {
            if (this.state.data != null){
                berStr = this.state.data.data.YFQYWL
            }else{
                berStr = ''
            }
        }
        return(
            <MLTableCell title={rowData} rightTitle={berStr} isArrow={false}/>
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
module.exports = Cxzxywqk;
