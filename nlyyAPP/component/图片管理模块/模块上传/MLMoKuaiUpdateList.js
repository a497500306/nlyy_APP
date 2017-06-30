/**
 * Created by Rolle on 2017/5/25.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity
} from 'react-native';
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var MLMoKuaiNewUpdateList = require('./MLMoKuaiNewUpdateList')
import ActionSheet from 'react-native-actionsheet';

const buttons = ['取消', '添加一个因素'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
var friendId = 0;
var seveRowData = {};

var MLMoKuaiUpdateList = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },
    getInitialState() {
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData:[],
            //ListView设置
            dataSource: ds.cloneWithRows([])
        }
    },

    render() {
        // console.log('更新属性' + this.props.initialProps.weChatUser + "123")
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'模块上传'} isBack={true} newTitle={"plus-circle"} backFunc={() => {
                    this.props.navigator.pop()
                }} newFunc={()=>{
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
                            var array = this.state.tableData;
                            array.push("");
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({
                                tableData:array,
                                //ListView设置
                                dataSource: ds.cloneWithRows(array)
                            })
                        }else if (sss == 2){//点击查看资料
                            var array = this.state.tableData;
                            array.push("");
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({
                                tableData:array,
                                //ListView设置
                                dataSource: ds.cloneWithRows(array)
                            })
                        }
                    }}
                />
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity onPress={()=> {
                // 页面的切换
                this.props.navigator.push({
                    component: MLMoKuaiNewUpdateList, // 具体路由的版块
                });
            }}>
                <MLTableCell title={'不良因素' + rowID}/>
            </TouchableOpacity>
        )
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLMoKuaiUpdateList;