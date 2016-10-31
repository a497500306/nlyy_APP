

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

//时间操作
var moment = require('moment');
moment().format();

var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Users = require('../../../entity/Users');
var Changku = require('../../../entity/Changku');
var settings = require('../../../settings');
var FPZhongxin = require('../../药物管理/仓库/保存数据/FPZhongxin');
var FPChangku = require('../../药物管理/仓库/保存数据/FPChangku');
var DgzxSq = require('./MLDgzxSq');
var DgzxCkjd = require('./MLDgzxCkjd')

var Dshlb = React.createClass({

    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            cuowu: false,//是否显示错误
        }
    },

    //耗时操作,网络请求
    componentDidMount(){
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getZXStopItTable", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID:Users.Users[0].StudyID,
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
                    console.log(responseJson.data)
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

    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'已停止入组中心列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else if(this.state.cuowu == true){
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'已停止入组中心列表'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>

                    <MLNavigatorBar title={'已停止入组中心列表'} isBack={true} backFunc={() => {
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
    renderRow(rowData){
        return(
            <View style={{marginTop: 10 , backgroundColor: 'white',borderBottomColor: '#dddddd', borderBottomWidth: 1,borderTopColor: '#dddddd', borderTopWidth: 1, }}>
                <Text style={{marginTop: 5,marginLeft:10}}>{'研究编号:' + rowData.StudyID}</Text>
                <Text style={{marginTop: 5,marginLeft:10}}>{'中心名称:' + rowData.SiteNam}</Text>
                <Text style={{marginTop: 5,marginLeft:10}}>{'受试者入组是否中心之间竞争:' + '这是什么?'}</Text>
                <Text style={{marginTop: 5,marginLeft:10}}>{'中心平均入组例数:' + '这是什么'}</Text>
                <Text style={{marginTop: 5,marginLeft:10}}>{'中心目前已随机例数:' + '这是什么'}</Text>
                <Text style={{marginTop: 5,marginLeft:10}}>{'中心已停止受试者入组:' + '是'}</Text>
                <Text style={{marginBottom: 5,marginTop: 5,marginLeft:10}}>{'停止入组日期:' + moment(rowData.StopItDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </View>
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
module.exports = Dshlb;



