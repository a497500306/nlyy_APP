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
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');

var netTool = require('../../../kit/net/netTool'); //网络请求

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
            xuanzhongData:[],
            SiteID:null
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
                UsedCoreId : this.props.SiteID
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
        var title = (rowData.DDrugDMNumYN == 1 ? ('已废弃  ' +  (rowData.DDrugNumAYN == 1 ?'已激活  ' : '未激活  ')) : (rowData.DDrugNumAYN == 1 ?'已激活  ' : '未激活  '))
        if (rowData.isRecycling == 1) {
            title = title + "已回收  "
        }
        if (rowData.isDestroy == 1) {
            title = title + "已销毁"
        }
        var titleColor = rowData.DDrugDMNumYN == 1 ? 'gray' :  (rowData.DDrugNumAYN == 1 ?"red" : 'gray')
        if (rowData.isRecycling == 1) {
            titleColor = 'gray'
        }
        if (rowData.isDestroy == 1) {
            titleColor = 'gray'
        }
        var text = rowData.DDrugUseAYN == 1 ?'已发放' : '未发放'
        // if (rowData.isRecycling == 1){
        //     text = '已回收'
        // }
        var textColor = rowData.DDrugUseAYN == 1 ?'red' : 'gray'
        if (rowData.isRecycling == 1){
            textColor = 'gray'
        }

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
                    <MLTableCell title={rowData.DrugNum}
                                 subTitle={title}
                                 subTitleColor={titleColor}
                                 rightTitle={text} 
                                 isArrow = {false}  
                                 iconTitl='check' iconColor='rgba(0,136,212,1.0)'
                                 rightTitleColor = {textColor}
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
                    <MLTableCell title={rowData.DrugNum}
                                 subTitle={title}
                                 subTitleColor={titleColor}
                                 rightTitle={text} isArrow = {false}
                                 rightTitleColor = {textColor}
                    />
                </TouchableOpacity>
            )
        }
    },

    //点击全选
    quanxuan(){
        var data = [];
        for(var i = 0 ; i < this.state.tableData.length ; i++){
                this.state.tableData[i].isSelected = true;
                data.push(this.state.tableData[i].id)
        }
        console.log(this.state.tableData)
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(this.state.tableData),
            xuanzhongData : data,
            title:'确 定( ' + data.length + ' )'
        });
    },

    //点击确定
    getLogin(){
        if (this.state.xuanzhongData.length != 0){

            var self = this
            var array = ["请选择你想做的","激活","废弃","销毁","撤回销毁","取消"];
            Popup.show(
                <View>
                    <List renderHeader={this.renderHeader}
                          className="popup-list"
                    >
                        {array.map((i, index) => (
                            <List.Item key={index}
                                       style = {{
                                           textAlign:'center'
                                       }}
                                       onClick={()=>{
                                           if (index == array.length - 1 || index == 0){
                                               Popup.hide();
                                               return;
                                           }
                                           if (index == 1){
                                            self.activation()
                                           }else if (index == 2){
                                            self.discard()
                                           }else if (index == 3){
                                            self.destroy()
                                           }else if (index == 4){
                                            self.cancelDestroy()
                                           }
                                           Popup.hide();
                                       }}
                            >
                                <View style={{
                                    width:width - 30,
                                    alignItems:'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{
                                        fontSize:index == 0 ? 12 : 16,
                                        color:(index == array.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                    }}>{i}</Text>
                                </View>
                            </List.Item>
                        ))}
                    </List>
                </View>,
                {maskClosable: true,animationType: 'slide-up' }
            )
/*
            //弹出提示
            Alert.alert(
                '提示:',
                '请选择功能',
                [
                    {text: '激活', onPress: () => {
                        
                    }},

                    {text: '废弃', onPress: () => {
                        

                    }},
                    {text: '销毁'},
                    {text: '取消'}
                ]
            )
            */
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
    },

    // 激活
    activation(){
        //判断药物号是否被激活
        for(var i = 0 ; i < this.state.tableData.length ; i++){
            if (this.state.tableData[i].isSelected == true){
                if (this.state.tableData[i].isRecycling == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被回收，无法激活',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
                if (this.state.tableData[i].isDestroy == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被销毁，无法激活',
                        [
                            {text: '确定'}
                        ],
                        {cancelable : false}
                    );
                    return;
                }
                if (this.state.tableData[i].DDrugNumAYN == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被激活，请勿重复激活',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
            }
        }
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
                        ],
                        {cancelable : false}
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
    },

    // 废弃
    discard(){
        //判断药物号是否被废弃
        for(var i = 0 ; i < this.state.tableData.length ; i++){
            if (this.state.tableData[i].isSelected == true){
                if (this.state.tableData[i].isRecycling == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被回收，无法废弃',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
                if (this.state.tableData[i].isDestroy == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被销毁，无法废弃',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
                if (this.state.tableData[i].DDrugDMNumYN == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被废弃，请勿重复废弃',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
            }
        }
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
                        ],
                        {cancelable : false}
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
    },

    //销毁
    destroy(){
        //判断药物号是否被废弃
        for(var i = 0 ; i < this.state.tableData.length ; i++){
            if (this.state.tableData[i].isSelected == true){
                if (this.state.tableData[i].isDestroy == 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号已（部分）被销毁，请勿重复销毁',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
                if (this.state.tableData[i].DDrugDMNumYN != 1) {
                    if (this.state.tableData[i].DDrugUseAYN == 1 && this.state.tableData[i].isRecycling != 1) {
                        //错误
                        Alert.alert(
                            '提示:',
                            '该（批）药物号已（部分）已发放，无法销毁',
                            [
                                {text: '确定'}
                            ]
                        );
                        return;
                    }
                }
            }
        }
        netTool.post(settings.fwqUrl +"/app/getSelectedDestroy",{ids: this.state.xuanzhongData})
        .then((responseJson) => {
            this.setState({animating:false});
                if (responseJson.isSucceed != 400){
                    //错误
                    Alert.alert(
                        '提示:',
                        responseJson.msg,
                        [
                            {text: '确定'}
                        ],
                        {cancelable : false}
                    )
                }else {
                    //错误
                    Alert.alert(
                        '提示:',
                        responseJson.msg,
                        [

                            {text: '确定', onPress: () => this.props.navigator.pop()}
                        ],
                        {cancelable : false}
                    )
                }
        })
        .catch((error)=>{
            //错误
            Alert.alert(
                '提示:',
                '请检查您的网络111',
                [
                    {text: '确定'}
                ]
            )
        })
    },

    // 销毁撤回
    cancelDestroy(){
        //判断药物号是否被废弃
        for(var i = 0 ; i < this.state.tableData.length ; i++){
            if (this.state.tableData[i].isSelected == true){
                if (this.state.tableData[i].isDestroy != 1){
                    //错误
                    Alert.alert(
                        '提示:',
                        '该（批）药物号（部分）未被销毁，请勿撤回销毁',
                        [
                            {text: '确定'}
                        ]
                    );
                    return;
                }
            }
        }
        netTool.post(settings.fwqUrl +"/app/getCancelSelectedDestroy",{ids: this.state.xuanzhongData})
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
                        ],
                        {cancelable : false}
                    )
                }
        })
        .catch((error)=>{
            //错误
            Alert.alert(
                '提示:',
                '请检查您的网络111',
                [
                    {text: '确定'}
                ]
            )
        })
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

