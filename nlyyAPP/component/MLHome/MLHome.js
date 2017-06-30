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
    Image,
    TouchableHighlight,
    Alert
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../entity/Users');
var researchParameter = require('../../entity/researchParameter');
var MLTableCell = require('../MLTableCell/MLTableCell');
var PatientRM = require('../受试者随机/MLPatientRM');
var DrugsAI = require('../药物管理/MLDrugsAI');
var FollowUpAI = require('../随访管理/MLFollowUpAI');
var Unblinding = require('../揭盲/MLUnblinding');
var StopEntry = require('../停止入组/MLStopEntry');
var ResearchAI = require('../研究管理/MLResearchAI');
var Helper = require('../小帮手/MLHelper');
var ImageList = require('../图片管理模块/入口/MLImagesList');

var Home = React.createClass({
    getInitialState() {
        console.log(Users.Users)
        var tableData = [];
        for (var i = 0 ; i < Users.Users.length ; i++){
            var data = Users.Users[i];
            //判断用户类别
            if (data.UserFun == 'H1' || data.UserFun == 'H2' ||
                data.UserFun == 'H3' || data.UserFun == 'S1' ||
                data.UserFun == 'M7' || data.UserFun == 'M3' || data.UserFun == 'M1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '受试者随机'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'受试者随机',imageTitle:"people"})
                }
                // if (tableData.indexOf({title:'受试者随机',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'}) == -1){
                //     tableData.push({title:'受试者随机',imageTitle:"users",iconColor:'rgba(0,136,212,1.0)'})
                // }
            }
            if (data.UserFun == 'H4' || data.UserFun == 'M6' ||
                data.UserFun == 'M1' || data.UserFun == 'M7' ||
                data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '药物管理'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'药物管理',imageTitle:"medkit",iconColor:'rgba(0,136,212,1.0)'})
                }
                // if (tableData.indexOf({title:'药物管理',imageTitle:"medkit",iconColor:'rgba(0,136,212,1.0)'}) == -1){
                //     tableData.push({title:'药物管理',imageTitle:"medkit",iconColor:'rgba(0,136,212,1.0)'})
                // }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '随访管理'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'随访管理',imageTitle:"phone",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'S1' || data.UserFun == 'C1' || data.UserFun == 'M4' ||
                data.UserFun == 'M2' || data.UserFun == 'M3' || data.UserFun == 'H1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '揭盲'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'揭盲',imageTitle:"eye",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
            if (data.UserFun == 'H2' || data.UserFun == 'H3' ||
                data.UserFun == 'C1' || data.UserFun == 'S1' ||
                data.UserFun == 'M7' || data.UserFun == 'M1' ||
                data.UserFun == 'H1' || data.UserFun == 'M4' ||
                data.UserFun == 'M2' || data.UserFun == 'M3'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '停止入组'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'停止入组',imageTitle:'../../images/stop.png'})
                }
            }
            if (data.UserFun == 'M1' || data.UserFun == 'H1' || data.UserFun == 'M4' ||
                data.UserFun == 'M2' || data.UserFun == 'M3' || data.UserFun == 'C1'){
                var isY = false
                for (var j = 0 ; j < tableData.length ; j++){
                    if (tableData[j].title == '研究管理'){
                        isY = true;
                    }
                }
                if (isY == false){
                    tableData.push({title:'研究管理',imageTitle:"key",iconColor:'rgba(0,136,212,1.0)'})
                }
            }
        }
        tableData.push({title:'图片资料管理',imageTitle:'../../images/imageGL.png'});
        tableData.push({title:'消息中心',imageTitle:'../../images/chat.png'});
        tableData.push({title:'小助手',imageTitle:'../../images/感叹号.png'});

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData : tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData)
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'首页'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ListView
                    removeClippedSubviews={false}
                    pageSize={this.state.tableData.length}
                    contentContainerStyle={styles.list}
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                    showsVerticalScrollIndicator={false}
                />
                {/*<ScrollView>*/}
                {/*{this.tableCell()}*/}
                {/*</ScrollView>*/}
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData){
        console.log('点击'+rowData.title);
        if (rowData.iconColor != null){
            return(
                <TouchableOpacity onPress={()=>{
                    //设置数据
                    // 页面的切换
                    if (rowData.title == "受试者随机"){
                        this.props.navigator.push({
                            component: PatientRM, // 具体路由的版块
                        });
                    }
                    if (rowData.title == "药物管理"){
                        if (researchParameter.researchParameter.DrugNOpen == 1){
                            this.props.navigator.push({
                                component: DrugsAI, // 具体路由的版块
                            });
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
                    }
                    if (rowData.title == "随访管理"){
                        this.props.navigator.push({
                            component: FollowUpAI, // 具体路由的版块
                        });
                    }
                    if (rowData.title == "揭盲"){
                        if (researchParameter.researchParameter.BlindSta == 1){
                            this.props.navigator.push({
                                component: Unblinding, // 具体路由的版块
                            });
                        }else{
                            //错误
                            Alert.alert(
                                '提示:',
                                '该研究无揭盲操作',
                                [
                                    {text: '确定'}
                                ]
                            )
                        }
                    }
                    if (rowData.title == "停止入组"){
                        this.props.navigator.push({
                            component: StopEntry, // 具体路由的版块
                        });
                    }
                    if (rowData.title == "研究管理"){
                        this.props.navigator.push({
                            component: ResearchAI, // 具体路由的版块
                        });
                    }
                    if (rowData.title == "小助手"){
                        this.props.navigator.push({
                            component: Helper, // 具体路由的版块
                        });
                    }
                }}>
                    <View>
                        <View style={styles.row}>
                            <Icon name={rowData.imageTitle} size={60} color={rowData.iconColor} style={styles.thumb}/>
                            <Text style={styles.text}>
                                {rowData.title}
                            </Text>
                        </View>
                    </View>
                    {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                </TouchableOpacity>
            )
        }else {
            if (rowData.title == "小助手"){
                return (
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            component: Helper, // 具体路由的版块
                        });
                    }}>
                        <View>
                            <View style={styles.row}>
                                <Image
                                    style={{width: 65, height: 65}}
                                    source={require('../../images/i1.png')}
                                />
                                <Text style={styles.text}>
                                    {rowData.title}
                                </Text>
                            </View>
                        </View>
                        {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                    </TouchableOpacity>
                )
            }
            if (rowData.title == "受试者随机") {
                return (
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            component: PatientRM, // 具体路由的版块
                        });
                    }}>
                        <View>
                            <View style={styles.row}>
                                <Image
                                    style={{width: 65, height: 65}}
                                    source={require('../../images/people.png')}
                                />
                                <Text style={styles.text}>
                                    {rowData.title}
                                </Text>
                            </View>
                        </View>
                        {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                    </TouchableOpacity>
                )
            }
            if (rowData.title == "停止入组") {
                return (
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            component: StopEntry, // 具体路由的版块
                        });
                    }}>
                        <View>
                            <View style={styles.row}>
                                <Image
                                    style={{width: 65, height: 65}}
                                    source={require('../../images/stop.png')}
                                />
                                <Text style={styles.text}>
                                    {rowData.title}
                                </Text>
                            </View>
                        </View>
                        {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                    </TouchableOpacity>
                )
            }
            if (rowData.title == "图片资料管理") {
                return (
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            component: ImageList, // 具体路由的版块
                        });
                    }}>
                        <View>
                            <View style={styles.row}>
                                <Image
                                    style={{width: 65, height: 65}}
                                    source={require('../../images/imageGL.png')}
                                />
                                <Text style={styles.text}>
                                    {rowData.title}
                                </Text>
                            </View>
                        </View>
                        {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                    </TouchableOpacity>
                )
            }
            if (rowData.title == "消息中心") {
                return (
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            component: StopEntry, // 具体路由的版块
                        });
                    }}>
                        <View>
                            <View style={styles.row}>
                                <Image
                                    style={{width: 65, height: 65}}
                                    source={require('../../images/chat.png')}
                                />
                                <Text style={styles.text}>
                                    {rowData.title}
                                </Text>
                            </View>
                        </View>
                        {/*<MLTableCell title={rowData.title} iconTitl={rowData.imageTitle} iconColor={rowData.iconColor}/>*/}
                    </TouchableOpacity>
                )
            }
        }
    },
});


const styles = StyleSheet.create({
    thumb: {
        width: 65,
        height: 65
    },
    text: {
        flex: 1,
        marginTop: 15,
        fontWeight: 'bold',
        marginBottom:15,
    },
    row: {
        justifyContent: 'center',
        padding: 5,
        width: width/2,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC'
    },
    list: {
        alignItems:'flex-start',
        width:width,
        // justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = Home;
