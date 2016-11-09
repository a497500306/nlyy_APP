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
var Ywqd = require('../仓库/MLYwqd');
var FPChangku = require('../仓库/保存数据/FPChangku');
var FPZhongxin = require('../仓库/保存数据/FPZhongxin');
var FPQDData = require('../仓库/保存数据/FPQDData');
import Icon from 'react-native-vector-icons/FontAwesome';

var NewYwqd = React.createClass({
    //初始化设置
    getInitialState() {
        return {
            DrugId : '',
            UsedAddressId : '',
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            title:'确 定',
            tableData:[],
            xuanzhongData:[]
        }
    },
    getDefaultProps(){
        return {
            DrugId : '',
            UsedAddressId : ''
        }
    },
    //耗时操作,网络请求
    componentDidMount(){
        this.setState({
            DrugId : this.props.DrugId,
            UsedAddressId : this.props.UsedAddressId,
        })
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        //发送登录网络请求
        fetch(settings.fwqUrl + "/app/getZXAllOnDrug", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                DrugId : this.props.DrugId,
                UsedCoreId : UserSite
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
                    var tableData = [];
                    for (var i = 0 ; i < responseJson.data.length ; i++){
                        var changku = responseJson.data[i];
                        tableData.push(changku)
                    }
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
    },


    render() {
        console.log('---------')
        console.log(this.state.DrugId);
        console.log(this.state.UsedAddressId);
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'药物操作'} isBack={true} backFunc={() => {
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
                    <View style={styles.anniuViewStyle}>
                        <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                            <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                                {this.state.title}
                            </Text>
                            <ActivityIndicator
                                animating={this.state.animating}
                                style={[styles.centering, {height: 30}]}
                                size="small"
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.quanxuan}>
                            <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                                全选
                            </Text>
                            <ActivityIndicator
                                animating={this.state.animating}
                                style={[styles.centering, {height: 30}]}
                                size="small"
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        if (this.state.tableData[rowID].isSelected == true){
            return(
                <TouchableOpacity onPress={()=>{
                    this.state.tableData[rowID].isSelected = !this.state.tableData[rowID].isSelected
                    console.log('取消添加' + this.state.tableData[rowID].isSelected)

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //把id从数组中拿出来
                    console.log(this.state.tableData[rowID].id)
                    var jj = 0;
                    for(var i = 0 ; i < this.state.xuanzhongData.length ; i++){
                        if (this.state.xuanzhongData[i] == this.state.tableData[rowID].id){
                            this.state.xuanzhongData.splice(i,1);
                        }
                    }
                    if (this.state.xuanzhongData.length == 0){
                        this.state.title = '确 定'
                    }else{
                        this.state.title = '确 定( ' + this.state.xuanzhongData.length + ' )'
                    }

                    console.log(this.state.xuanzhongData)
                }}>
                    <MLTableCell title={rowData.DrugNum} subTitle={(rowData.DDrugNumAYN == 1 ?'已激活  ' : '未激活  ') + (rowData.DDrugDMNumYN == 1 ? '已废弃' : ' ')}
                                 rightTitle={rowData.DDrugUseAYN == 1 ?'已使用' : '未使用'} isArrow = {false}  iconTitl='check' iconColor='rgba(0,136,212,1.0)'
                                 rightTitleColor = {rowData.DDrugUseAYN == 1 ?'red' : 'gray'} subTitleColor={rowData.DDrugNumAYN == 1 ?'red  ' : 'gray '}
                    />
                </TouchableOpacity>
            )
        }else{
            this.state.tableData[rowID].isSelected = false;
            return(
                <TouchableOpacity onPress={()=>{
                    this.state.tableData[rowID].isSelected = !this.state.tableData[rowID].isSelected
                    console.log('添加进去' + this.state.tableData[rowID].isSelected)

                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                    this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
                    //把id添加到数组中
                    this.state.xuanzhongData.push(this.state.tableData[rowID].id)
                    console.log(this.state.xuanzhongData)
                    this.state.title = '确 定( ' + this.state.xuanzhongData.length + ' )'
                }}>
                    <MLTableCell title={rowData.DrugNum} subTitle={(rowData.DDrugNumAYN == 1 ?'已激活  ' : '未激活  ') + (rowData.DDrugDMNumYN == 1 ? '已废弃' : ' ')}
                                 rightTitle={rowData.DDrugUseAYN == 1 ?'已使用' : '未使用'} isArrow = {false}
                                 rightTitleColor = {rowData.DDrugUseAYN == 1 ?'red' : 'gray'} subTitleColor={rowData.DDrugNumAYN == 1 ?'red' : 'gray'}
                    />
                </TouchableOpacity>
            )
        }
    },

    //点击全选
    quanxuan(){
        for(var i = 0 ; i < this.state.tableData.length ; i++){
            this.state.tableData[i].isSelected = true;
        }
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.setState({dataSource: ds.cloneWithRows(this.state.tableData)});
    },

    //点击确定
    getLogin(){
        if (this.state.xuanzhongData.length != 0){
            //弹出提示
            Alert.alert(
                '提示:',
                '请选择功能',
                [
                    {text: '激活', onPress: () => {
                        //发送激活请求
                        //发送网络请求
                        fetch(settings.fwqUrl + "/app/getSelectedActivation", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                ids: this.state.xuanzhongData
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({animating:false});
                                if (responseJson.isSucceed != 400){
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }else {
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [

                                            {text: '确定', onPress: () => this.props.navigator.pop()}
                                        ]
                                    )
                                }
                            })
                            .catch((error) => {//错误
                                this.setState({animating:false});
                                console.log(error),
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        '请检查您的网络111',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                            });
                    }},

                    {text: '废弃', onPress: () => {
                        //发送废弃请求//发送网络请求
                        fetch(settings.fwqUrl + "/app/getSelectedAbandoned", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                ids: this.state.xuanzhongData
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({animating:false});
                                if (responseJson.isSucceed != 400){
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }else {
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        responseJson.msg,
                                        [

                                            {text: '确定', onPress: () => this.props.navigator.pop()}
                                        ]
                                    )
                                }
                            })
                            .catch((error) => {//错误
                                this.setState({animating:false});
                                console.log(error),
                                    //错误
                                    Alert.alert(
                                        '提示:',
                                        '请检查您的网络111',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                            });

                    }},
                    {text: '取消'}
                ]
            )
        }else{
            //错误
            Alert.alert(
                '提示:',
                '请选择最少一个药物号',
                [
                    {text: '确定'}
                ]
            )
        }
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    anniuViewStyle: {
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'space-around',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width/2 - 40,
        marginTop:10,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
        marginBottom:10
    },
});

// 输出组件类
module.exports = NewYwqd;

