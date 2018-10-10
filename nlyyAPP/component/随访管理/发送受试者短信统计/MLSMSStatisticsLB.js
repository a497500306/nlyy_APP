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
    ListView
} from 'react-native';

var MLTableCell = require('../../MLTableCell/MLTableCell');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var settings = require("../../../settings");
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
import ActionSheet from 'react-native-actionsheet';
var moment = require('moment');
moment().format();

const buttons = ['取消', '按受试者编号排序查看','按时间排序查看'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
var friendId = 0;
var seveRowData = {};

var compareDate = function (obj1, obj2) {
    var val1 = obj1.Date;
    var val2 = obj2.Date;
    if (val1 > val2) {
        return -1;
    } else if (val1 < val2) {
        return 1;
    } else {
        return 0;
    }
}

var compareUser = function (obj1, obj2) {
    var val1 = obj1.patient.id;
    var val2 = obj2.patient.id;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
var MLSMSStatisticsLB = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },
    getDefaultProps(){
        return{
            data:[],//数据
            type:0,//排序1:编号排序,2:时间排序
        }
    },

    //初始化设置
    getInitialState() {
        var tableData = [];
        if (this.props.type == 1){
            tableData = this.props.data.sort(compareUser)
        }else{
            tableData = this.props.data.sort(compareDate)
        }

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            tableData:tableData,
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'查看详细'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ListView
                    removeClippedSubviews={false}
                    showsVerticalScrollIndicator={false}
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
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        return(
            <TouchableOpacity style={{marginTop : 10,}} onPress={()=>{
                var xx = 0;
                for (var i = 0 ; i < this.props.data.length ; i++){
                    if (this.props.data[i].patient.USubjID == rowData.patient.USubjID){
                        xx = xx + 1;
                    }
                }
                //错误
                Alert.alert(
                    '受试者' + rowData.patient.USubjID + '总条数',
                    xx.toString() + '条',
                    [
                        {text: '确定'},
                    ]
                )
            }}>
                <View style={{
                    backgroundColor:'white',
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                }}>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{rowData.content}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'发送者:' + rowData.users.UserMP.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'发送时间:' + moment(rowData.Date).format('YYYY-MM-DD h:mm:ss a')}</Text>
                    <Text style={{
                        marginBottom : 5,
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'接收受试者的编号:' + rowData.patient.USubjID}</Text>
                </View>
            </TouchableOpacity>
        )
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLSMSStatisticsLB;