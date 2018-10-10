import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Platform,
    PermissionsAndroid,
    ScrollView,
    Alert,
    DeviceEventEmitter,
    AsyncStorage,
    Modal
} from 'react-native';

var TextareaItem = require('../../../node_modules/antd-mobile/lib/textarea-item/index');
var Button = require('../../../node_modules/antd-mobile/lib/button/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var SwipeAction = require('../../../node_modules/antd-mobile/lib/swipe-action/index');
const Item = List.Item;
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var wenzi = '';
var MLMoban = React.createClass({
    getInitialState() {
        //ListView设置
        var tableData = [];
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            moban:[],
            isModal:false,
            tableData:tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData)
        }
    },
    componentDidMount () {
        var self = this;
        AsyncStorage.getItem(Users.Users[0].UserMP,function (err,result) {
            console.log('321321')
            if (result != null){
                console.log('数据2222');
                var dataJson = JSON.parse(result);
                console.log(result);
                if (result != null){
                    //ListView设置
                    var tableData = dataJson.data;
                    self.state.tableData = tableData;
                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                    self.setState({
                        moban:dataJson.data
                    })
                    DeviceEventEmitter.emit('updateMoban');
                }
            }
        })
    },
    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'快捷模板'} isBack={true} rightTitle={"添加"} backFunc={() => {
                    this.props.navigator.pop()
                }} newFunc={()=>{
                    Popup.show(
                        <View>
                            <View style={{
                                height:20
                            }}/>
                            <TextareaItem
                                placeholder="请输入您的模板"
                                rows={15}
                                count={250}
                                onChange={(val)=>{
                                    wenzi = val
                                }}
                            />
                            <TouchableOpacity style={{
                                width:width,
                                height:40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,136,212,1.0)',
                            }} onPress={()=>{
                                if (wenzi.length == 0){
                                    Alert.alert(
                                        "提示:",
                                        "请输入内容",
                                        [
                                            {text: '确定'},
                                        ])
                                    return
                                }
                                var data = this.state.moban;
                                data.push(wenzi)
                                var dataJson = {
                                    data:data
                                }
                                var dataStr = JSON.stringify(dataJson);
                                console.log('数据1111');
                                console.log(dataStr);
                                var self = this;
                                AsyncStorage.setItem(Users.Users[0].UserMP,dataStr,function (err) {
                                    AsyncStorage.getItem(Users.Users[0].UserMP,function (err, result) {

                                        console.log('数据2222');
                                        var dataJson = JSON.parse(result);
                                        console.log(dataJson);
                                        if (result != null){
                                            //ListView设置
                                            var tableData = dataJson.data;
                                            self.state.tableData = tableData;
                                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                            self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                                            self.setState({
                                                moban:dataJson.data
                                            })
                                            DeviceEventEmitter.emit('updateMoban');
                                        }
                                    })
                                })

                                wenzi = ''
                                Popup.hide()
                            }}>
                                <Text style={{
                                    color:'rgba(255,255,255,1)',
                                    fontSize: 18
                                }}>
                                    确    定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                    this.setState({
                        isModal:true
                    })
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ListView
                    removeClippedSubviews={false}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
            </View>
        )
    },
    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        return(
            <View style={{
                backgroundColor:'rgba(255,255,255,1)'
            }}><SwipeAction
                style={{ backgroundColor: 'gray' }}
                autoClose
                right={[
                    {
                        text: '删除',
                        onPress: () => {
                            var data = this.state.moban;
                            data.splice(rowID,1);
                            var dataJson = {
                                data:data
                            }
                            var dataStr = JSON.stringify(dataJson);
                            var self = this;
                            AsyncStorage.setItem(Users.Users[0].UserMP,dataStr,function (err) {
                                AsyncStorage.getItem(Users.Users[0].UserMP,function (err, result) {
                                    var dataJson = JSON.parse(result);
                                    console.log(dataJson);
                                    if (result != null){
                                        //ListView设置
                                        var tableData = dataJson.data;
                                        self.state.tableData = tableData;
                                        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                        self.setState({dataSource: ds.cloneWithRows(self.state.tableData)});
                                        self.setState({
                                            moban:dataJson.data
                                        })
                                        DeviceEventEmitter.emit('updateMoban');
                                    }
                                })
                            })
                        },
                        style: { backgroundColor: '#F4333C', color: 'white' },
                    },
                ]}
                onOpen={() => console.log('global open')}
                onClose={() => console.log('global close')}
            >
                <Item wrap className="my-list" arrow="horizontal" onClick={()=>{
                    DeviceEventEmitter.emit('selectMoban',rowData);
                    this.props.navigator.pop()
                }}>{rowData}</Item>
            </SwipeAction>
            </View>
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
})

// 输出组件类
module.exports = MLMoban;