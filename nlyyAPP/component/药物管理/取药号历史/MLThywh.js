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
var researchParameter = require('../../../entity/researchParameter');
import Icon from 'react-native-vector-icons/FontAwesome';

var Thywh = React.createClass({
    getDefaultProps(){
        return {
            data:null,
            userId : null,
            DrugNum : null
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
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        if (this.props.data == null) {
            this.setState({
                DrugId : this.props.DrugId,
                UsedAddressId : this.props.UsedAddressId,
            })
            //发送登录网络请求
            fetch(settings.fwqUrl + "/app/getZXAllKYYwh", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SiteID : UserSite,
                    StudyID : Users.Users[0].StudyID
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
                    <MLNavigatorBar title={'替换药物号'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
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
        return(
            <TouchableOpacity onPress={()=>{
                var UserSite = '';
                for (var i = 0 ; i < Users.Users.length ; i++) {
                    if (Users.Users[i].UserSite != null) {
                        UserSite = Users.Users[i].UserSite
                    }
                }
                //移除等待
                this.setState({animating:true});
                //发送登录网络请求
                fetch(settings.fwqUrl + "/app/getThywh", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json; charset=utf-8',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId : this.props.userId,
                        SiteID : UserSite,
                        StudyID : Users.Users[0].StudyID,
                        DrugNum : this.props.DrugNum,
                        newDrug : rowData
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
                                    {text: '确定'}
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
                                        this.props.navigator.pop()
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

            }}>
                <MLTableCell
                    title={rowData.DrugNum}
                    subTitle={(rowData.DDrugDMNumYN == 1 ? ('已废弃  ' +  (rowData.DDrugNumAYN == 1 ?'已激活  ' : '未激活  ')) : (rowData.DDrugNumAYN == 1 ?'已激活  ' : '未激活  '))}
                    isArrow = {false}
                    subTitleColor={rowData.DDrugNumAYN == 1 ? 'red' : 'gray'}
                />
            </TouchableOpacity>
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
});

// 输出组件类
module.exports = Thywh;