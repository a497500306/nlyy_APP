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

var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
import Icon from 'react-native-vector-icons/FontAwesome';

var Qsjh = React.createClass({
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
                    SiteID : Users.Users.UserSite,
                    StudyID : Users.Users.StudyID
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
                    <MLNavigatorBar title={'取药物号'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'药物操作'} isBack={true} backFunc={() => {
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
        if (rowData.isSuccess == 1){
            if (rowData.Random == -1){
                return(
                    <TouchableOpacity onPress={()=>{
                        //错误
                        Alert.alert(
                            "提示:",
                            "请选择你要操作的功能",
                            [
                                {text: '取随机号', onPress: () => { }},
                                {text: '取消'}
                            ]
                        )
                    }}>
                        <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'随机号:未取'}/>
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
                                {text: '发送药物提醒短信', onPress: () => { }},
                                {text: '取消'}
                            ]
                        )
                    }}>
                        <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'随机号:' + rowData.Random} rightTitleColor = {'black'}/>
                    </TouchableOpacity>
                )
            }
        }else {
            return(
                <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'筛选失败用户'} rightTitleColor = {'gray'}/>
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
module.exports = Qsjh;

