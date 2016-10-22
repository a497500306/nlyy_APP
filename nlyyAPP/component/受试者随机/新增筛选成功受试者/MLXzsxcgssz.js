
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ListView,
    Alert,
    DatePickerAndroid,
    TouchableHighlight,
    DatePickerIOS,
    Picker,
    ActivityIndicator,

} from 'react-native';
//时间操作
var moment = require('moment');
moment().format();

import Pickers from 'react-native-picker';

// var Modal = require('react-native-modal');
var Users = require('../../../entity/Users')
var MLModal = require('../../MLModal/MLModal');
var study = require('../../../entity/study');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var XzsxcgsszQR = require('./MLXzsxcgsszQR')

var Xzsxcgssz = React.createClass({

    getInitialState() {
        var tableData = [];

        tableData.push('受试者出生日期')
        tableData.push('受试者性别')
        tableData.push('受试者姓名缩写')
        tableData.push('受试者手机')
        if (study.study.SubStudYN == 1){
            tableData.push('受试者是否参加子研究')
        }
        tableData.push('筛选结果')
        tableData.push('')

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});

        let date = [];
        for(let i=1900;i<2050;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k);
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k);
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k);
                    }
                }
                let _month = {};
                _month[j] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i] = month;
            date.push(_date);
        }

        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            //ListView设置
            animating: false,
            //是否显示选择器
            isLanguage : false,
            //选择器默认选择值
            language:'',
            //选择器内容数组
            languages:['javar','jss'],
            date : date,
            //出生年月
            csDate:'',
            //受试者性别
            xb:'',
            //输入的第几个
            shuru:0,
            //姓名缩写
            name:'',
            //受试者手机号
            phone:'',
            //是否参加子研究
            zyj:'',
            //是否显示moda
            isModalOpen:false,
            //输入框显示文字
            srkxswz:['']
        }
    },
    closeModal() {
        this.setState({isModalOpen: false});
    },
    render() {
        console.log('11111')
        if (this.state.isLanguage == false){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'新增筛选成功受试者'} isBack={true} backFunc={() => {
                        Pickers.hide();
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    {/*<Modal isVisible={this.state.isModalOpen} onClose={() => this.closeModal()}>*/}
                        {/*<Text>Hello world!</Text>*/}
                    {/*</Modal>*/}
                    <MLModal placeholders={this.state.srkxswz} isVisible={this.state.isModalOpen}
                             onClose={(text) => {
                                 var tableData = [];
                                 tableData.push('受试者出生日期')
                                 tableData.push('受试者性别')
                                 tableData.push('受试者姓名缩写')
                                 tableData.push('受试者手机')
                                 if (study.study.SubStudYN == 1){
                                     tableData.push('受试者是否参加子研究')
                                 }
                                 tableData.push('筛选结果')
                                 tableData.push('')
                                 //ListView设置
                                 var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                 if (this.state.shuru == 0){
                                     this.setState({name:text,dataSource: ds.cloneWithRows(tableData),isModalOpen:false,srkxswz:['受试者姓名缩写']})
                                 }else{
                                     this.setState({phone:text,dataSource: ds.cloneWithRows(tableData),isModalOpen:false,srkxswz:['受试者姓名缩写']})
                                 }
                             }}
                             quxiao={(text) => {
                                 this.setState({isModalOpen:false,srkxswz:['受试者姓名缩写']})
                             }}>></MLModal>
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'新增筛选成功受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <MLModal placeholders={this.state.srkxswz} isVisible={this.state.isModalOpen}
                             onClose={(text) => {
                                 var tableData = [];
                                 tableData.push('受试者出生日期')
                                 tableData.push('受试者性别')
                                 tableData.push('受试者姓名缩写')
                                 tableData.push('受试者手机')
                                 if (study.study.SubStudYN == 1){
                                     tableData.push('受试者是否参加子研究')
                                 }
                                 tableData.push('筛选结果')
                                 tableData.push('')
                                 //ListView设置
                                 var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                 if (this.state.shuru == 0){
                                     this.setState({name:text,dataSource: ds.cloneWithRows(tableData),isModalOpen:false,srkxswz:['受试者姓名缩写']})
                                 }else{
                                     this.setState({phone:text,dataSource: ds.cloneWithRows(tableData),isModalOpen:false,srkxswz:['受试者姓名缩写']})
                                 }
                             }}
                             quxiao={(text) => {
                                 this.setState({isModalOpen:false,srkxswz:['受试者姓名缩写']})
                             }}>></MLModal>
                    <View style={{position:'absolute', right:0, bottom:0, width:width, height:height, backgroundColor:'rgba(0,0,0,0.5)'}}>
                        <Picker
                            selectedValue={this.state.language}
                            onValueChange={(lang) => this.setState({language: lang})}>
                            {this.PickerItem()}
                        </Picker>
                    </View>
                </View>
            );
        }
    },
    PickerItem(){
        var views = [];
        for (var i = 0 ; i < this.state.languages.length ; i++) {
            views.push(<Picker.Item label={this.state.languages[i]} key={i} value="java" />)
        }
        return views
        // <Picker.Item label="Java" value="java" />
        // <Picker.Item label="JavaScript" value="js" />
    },
    /*
     tableData.push('受试者出生日期')
     tableData.push('受试者性别')
     tableData.push('受试者姓名缩写')
     tableData.push('受试者手机')
     tableData.push('受试者是否参加子研究')
     tableData.push('筛选结果')*/
    //返回具体的cell
    renderRow(rowData){
        if(rowData == "受试者出生日期") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData: this.state.date,
                        onPickerConfirm: pickedValue => {
                            var tableData = [];
                            tableData.push('受试者出生日期')
                            tableData.push('受试者性别')
                            tableData.push('受试者姓名缩写')
                            tableData.push('受试者手机')
                            if (study.study.SubStudYN == 1){
                                tableData.push('受试者是否参加子研究')
                            }
                            tableData.push('筛选结果')
                            tableData.push('')
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({csDate:pickedValue[0] + '/' + pickedValue[1]+ '/' + pickedValue[2],dataSource: ds.cloneWithRows(tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            var tableData = [];
                            tableData.push('受试者出生日期')
                            tableData.push('受试者性别')
                            tableData.push('受试者姓名缩写')
                            tableData.push('受试者手机')
                            if (study.study.SubStudYN == 1){
                                tableData.push('受试者是否参加子研究')
                            }
                            tableData.push('筛选结果')
                            tableData.push('')
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({csDate:'',dataSource: ds.cloneWithRows(tableData),})
                        },
                        onPickerSelect: pickedValue => {
                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.csDate}/>
                </TouchableOpacity>
            )
        }
        if(rowData == "受试者性别") {
            return(
                <TouchableOpacity onPress={()=>{
                    var data = ['男','女'];
                    Pickers.init({
                        pickerData: data,
                        selectedValue: ['男'],
                        onPickerConfirm: pickedValue => {
                            var tableData = [];

                            tableData.push('受试者出生日期')
                            tableData.push('受试者性别')
                            tableData.push('受试者姓名缩写')
                            tableData.push('受试者手机')
                            if (study.study.SubStudYN == 1){
                                tableData.push('受试者是否参加子研究')
                            }
                            tableData.push('筛选结果')
                            tableData.push('')

                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({xb:pickedValue[0],dataSource: ds.cloneWithRows(tableData),})
                        },
                        onPickerCancel: pickedValue => {
                            var tableData = [];
                            tableData.push('受试者出生日期')
                            tableData.push('受试者性别')
                            tableData.push('受试者姓名缩写')
                            tableData.push('受试者手机')
                            if (study.study.SubStudYN == 1){
                                tableData.push('受试者是否参加子研究')
                            }
                            tableData.push('筛选结果')
                            tableData.push('')
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({xb:'',dataSource: ds.cloneWithRows(tableData),})
                        },
                        onPickerSelect: pickedValue => {
                            console.log('area', pickedValue[0]);

                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.xb}/>
                </TouchableOpacity>
            )
        }
        if (rowData == '受试者姓名缩写'){
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.hide();
                    this.setState({isModalOpen:true,srkxswz:['受试者姓名缩写'],shuru:0})
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.name}/>
                </TouchableOpacity>
            )
        }

        if (rowData == '受试者手机'){
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.hide();
                    this.setState({isModalOpen:true,srkxswz:['受试者手机'],shuru:1})
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.phone}/>
                </TouchableOpacity>
            )

        }
        if (rowData == '受试者是否参加子研究'){
            return(
                <TouchableOpacity onPress={()=>{
                    var data = ['是','否'];
                    Pickers.init({
                        pickerData: data,
                        selectedValue: ['是'],
                        onPickerConfirm: pickedValue => {
                            var tableData = [];
                            tableData.push('受试者出生日期')
                            tableData.push('受试者性别')
                            tableData.push('受试者姓名缩写')
                            tableData.push('受试者手机')
                            if (study.study.SubStudYN == 1){
                                tableData.push('受试者是否参加子研究')
                            }
                            tableData.push('筛选结果')
                            tableData.push('')
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({zyj:pickedValue[0],dataSource: ds.cloneWithRows(tableData),})
                        },
                        onPickerCancel: pickedValue => {
                            var tableData = [];
                            tableData.push('受试者出生日期')
                            tableData.push('受试者性别')
                            tableData.push('受试者姓名缩写')
                            tableData.push('受试者手机')
                            if (study.study.SubStudYN == 1){
                                tableData.push('受试者是否参加子研究')
                            }
                            tableData.push('筛选结果')
                            tableData.push('')
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({zyj:'',dataSource: ds.cloneWithRows(tableData),})
                        },
                        onPickerSelect: pickedValue => {

                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.zyj}/>
                </TouchableOpacity>
            )
        }
        if (rowData == '筛选结果'){
            return(
                <MLTableCell title={rowData} rightTitle='成功'/>
            )
        }
        if (rowData == ''){
            return(
                <View>
                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                        <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                            确 定
                        </Text>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={[styles.centering, {height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    },
    getLogin(){
        if (this.state.csDate.length == 0){
            //错误
            Alert.alert(
                '出生年月为空',
                null,
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.xb.length == 0){
            //错误
            Alert.alert(
                '性别为空',
                null,
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.name.length == 0){
            //错误
            Alert.alert(
                '姓名缩写为空',
                null,
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.phone.length == 0){
            //错误
            Alert.alert(
                '手机号为空',
                null,
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (study.study.SubStudYN == 1){
            if (this.state.zyj.length == 0){
                //错误
                Alert.alert(
                    '是否愿意参加子研究为空',
                    null,
                    [
                        {text: '确定'}
                    ]
                )
                return
            }
        }
        this.setState({
            animating: true
        })
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getSingleSite", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID: Users.Users.StudyID,
                UserSite:Users.Users.UserSite
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    animating: false
                })
                if (responseJson.isSucceed == 200){
                    //错误
                    Alert.alert(
                        responseJson.msg,
                        null,
                        [
                            {text: '确定'}
                        ]
                    )
                }else {
                    console.log(responseJson)
                    // 页面的切换
                    this.props.navigator.push({
                        component: XzsxcgsszQR, // 具体路由的版块
                        //传递参数
                        passProps:{
                            //出生年月
                            csDate:this.state.csDate,
                            //受试者性别
                            xb:this.state.xb,
                            //姓名缩写
                            name:this.state.name,
                            //受试者手机号
                            phone:this.state.phone,
                            //是否参加子研究
                            zyj:this.state.zyj,
                            //中心数据
                            site:responseJson.site
                        }
                    });
                }
            })
            .catch((error) => {//错误
                this.setState({
                    animating: false
                })
                this.setState({animating:false});
                console.log(error),
                    //错误
                    Alert.alert(
                        '请检查您的网络111',
                        null,
                        [
                            {text: '确定'}
                        ]
                    )
            });
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
    },
    xiantiaoViewStyle:{
        width: 42,
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    zongView: {
        backgroundColor: 'white',
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center'
    },
    dengluBtnStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'center',
        width:width - 40,
        marginTop:20,
        marginLeft:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
    },
});

// 输出组件类
module.exports = Xzsxcgssz;
