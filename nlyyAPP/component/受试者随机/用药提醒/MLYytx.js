

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

var settings = require('../../../settings');
var researchParameter = require('../../../entity/researchParameter');

import Pickers from 'react-native-picker';
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLModal = require('../../MLModal/MLModal');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var MLSelectionModal = require('../../MLSelectionModal/MLSelectionModal');

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var Helper = React.createClass({

    getDefaultProps(){
        return {
            userId : null,
            phone : null,
            patient: null
        }
    },
    getInitialState() {
        let date = [];
        for(let i=2016;i<2070;i++){
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
        console.log(date)
        var tableData = [];

        //判断用户类别
        tableData.push('选择开始日期')
        tableData.push('选择结束日期')
        tableData.push('选择第一次推送时点和内容')
        tableData.push('选择第二次推送时点和内容')
        tableData.push('选择第三次推送时点和内容')
        tableData.push('')

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData:tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            animating: false,
            //选择器默认选择值
            language:'',
            date : date,
            //选择器内容数组
            languages:['javar','jss'],
            //是否显示moda
            isModalOpen:false,
            //是否显示编辑
            isBJModalOpen:false,
            //输入框显示文字
            srkxswz:['请输入推送内容'],
            //是否显示选择器
            isLanguage : false,
            //是否是选择时间
            isShijian : false,
            //选择的那个
            isModel:0,
            //开始时间
            kaishiDate : [],
            //结束时间
            jiesuDate : [],
            //开始时间
            kaishiStr : '',
            //结束时间
            jiesuStr : '',
            //推送时间
            tuisong1 : "",
            //推送内容
            tuisongnr1 : "",
            //推送时间
            tuisong2 : "",
            //推送内容
            tuisongnr2 : "",
            //推送时间
            tuisong3 : "",
            //推送内容
            tuisongnr3 : "",
            //模板内容
            content:'',
        }
    },

    render() {
        if (this.state.isLanguage == false){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'用药提醒'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <MLSelectionModal tableData={[
                        "研究温馨提示：健康记心间，平安幸福每一天，请按医嘱和说明书及时服药",
                        "研究温馨提示：您今天遵医嘱按时服用药物3次了吗",
                        "研究温馨提示：请您遵医嘱按时服用相应药物，餐后服用，每日三次",
                        "研究温馨提示：请您遵医嘱按时服用药物。服用任何药物都有不同的副作用，且存在很大的个体差异，如有不适，请及时联系您的主治医生"
                    ]} isVisible={this.state.isModalOpen}
                             onClose={(text) => {
                                 this.setState({isModalOpen:false,isBJModalOpen:true,content:text})
                                 {/*//ListView设置*/}
                                 {/*var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});*/}
                                 {/*if (this.state.isModel == 1){*/}
                                     {/*this.setState({isModalOpen:false,tuisongnr1:text,dataSource: ds.cloneWithRows(this.state.tableData)})*/}
                                 {/*}else if (this.state.isModel == 2){*/}
                                     {/*this.setState({isModalOpen:false,tuisongnr2:text,dataSource: ds.cloneWithRows(this.state.tableData),})*/}
                                 {/*}else if (this.state.isModel == 3){*/}
                                     {/*this.setState({isModalOpen:false,tuisongnr3:text,dataSource: ds.cloneWithRows(this.state.tableData),})*/}
                                 {/*}else {*/}
                                     {/*//ListView设置*/}
                                     {/*var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});*/}
                                     {/*this.setState({phone:text,dataSource: ds.cloneWithRows(this.state.tableData),isModalOpen:false,srkxswz:['请输入推送内容']})*/}
                                 {/*}*/}
                             }}
                             quxiao={(text) => {
                                 //ListView设置
                                 var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                 if (this.state.isModel == 1){
                                     this.setState({isModalOpen:false,tuisongnr1:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else if (this.state.isModel == 2){
                                     this.setState({isModalOpen:false,tuisongnr2:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else if (this.state.isModel == 3){
                                     this.this.setState({isModalOpen:false,tuisongnr3:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else{
                                     setState({isModalOpen:false,srkxswz:['请输入推送内容']})

                                 }
                             }}>></MLSelectionModal>
                    <MLModal content={this.state.content} placeholders={this.state.srkxswz} isVisible={this.state.isBJModalOpen}
                             onClose={(text) => {
                                 console.log("MLModal")
                                 console.log(text)
                                 //ListView设置
                                 var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                 if (this.state.isModel == 1){
                                     this.setState({isModalOpen:false,isBJModalOpen:false,tuisongnr1:text,dataSource: ds.cloneWithRows(this.state.tableData)})
                                 }else if (this.state.isModel == 2){
                                     this.setState({isModalOpen:false,isBJModalOpen:false,tuisongnr2:text,dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else if (this.state.isModel == 3){
                                     this.setState({isModalOpen:false,isBJModalOpen:false,tuisongnr3:text,dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else {
                                     //ListView设置
                                     var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                     this.setState({phone:text,dataSource: ds.cloneWithRows(this.state.tableData),isModalOpen:false,srkxswz:['请输入推送内容']})
                                 }
                             }}
                             quxiao={(text) => {
                                 //ListView设置
                                 var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                 if (this.state.isModel == 1){
                                     this.setState({isModalOpen:false,isBJModalOpen:false,tuisongnr1:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else if (this.state.isModel == 2){
                                     this.setState({isModalOpen:false,isBJModalOpen:false,tuisongnr2:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else if (this.state.isModel == 3){
                                     this.setState({isModalOpen:false,isBJModalOpen:false,tuisongnr3:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                                 }else{
                                     setState({isModalOpen:false,isBJModalOpen:false,srkxswz:['请输入推送内容']})
                                 }
                             }}>></MLModal>
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'用药提醒'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <MLSelectionModal tableData={[
                        "研究温馨提示：健康记心间，平安幸福每一天，请按医嘱和说明书及时服药。",
                        "研究温馨提示：您今天遵医嘱按时服用药物3次了吗？",
                        "研究温馨提示：请您遵医嘱按时服用相应药物，餐后服用，每日三次。",
                        "研究温馨提示：请您遵医嘱按时服用药物。服用任何药物都有不同的副作用，且存在很大的个体差异，如有不适，请及时联系您的主治医生。"
                    ]} isVisible={this.state.isModalOpen}
                             onClose={(text) => {

                                //刷新

                             }}
                             quxiao={(text) => {

                             }}>></MLSelectionModal>
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
    //返回具体的cell
    renderRow(rowData){
        if (rowData == ''){
            return(
                <View>
                    <TouchableOpacity style={styles.dengluBtnStyle} onPress={this.getLogin}>
                        <Text style={{color:'white',fontSize: 14,marginLeft:15}}>
                            确 定
                        </Text>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={[{height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

            )
        }else {
            if (rowData == "选择开始日期"){
                return(
                    <TouchableOpacity onPress={()=>{
                        this.setState({isShijian:false,isModel:0})
                        Pickers.init({
                            pickerData: this.state.date,
                            selectedValue: [moment().format('YYYY'),moment().format('M'),moment().format('D')],
                            onPickerConfirm: pickedValue => {
                                console.log(pickedValue[0], pickedValue[1], pickedValue[2])
                                var kaistiDateStr =  '';
                                kaistiDateStr = (pickedValue[0].length == 1 ? ("0" + pickedValue[0]) : pickedValue[0]) + '' + "-" +
                                (pickedValue[1].length == 1 ? ("0" + pickedValue[1]) : pickedValue[1]) + '' + "-" +
                                    (pickedValue[2].length == 1 ? ("0" + pickedValue[2]) : pickedValue[2]) + ''
                                var kaishiDate = moment(kaistiDateStr);
                                console.log(kaistiDateStr)
                                console.log(kaishiDate)
                                if (kaishiDate < moment().add(-1,'days')){
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        '选择日期不能小于当前日期',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }else{
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                    this.setState({kaishiDate:pickedValue,kaishiStr:pickedValue[0] + "/" + pickedValue[1] + '/' + pickedValue[2],dataSource: ds.cloneWithRows(this.state.tableData),})
                                }
                            },
                            onPickerCancel: pickedValue => {
                                //ListView设置
                                var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                this.setState({kaishiDate:[],kaishiStr:"",dataSource: ds.cloneWithRows(this.state.tableData),})
                            },
                            onPickerSelect: pickedValue => {

                            }
                        });
                        Pickers.show();
                    }}>
                        <MLTableCell title={rowData} rightTitle={this.state.kaishiStr}/>
                    </TouchableOpacity>
                )
            }else if (rowData == "选择结束日期"){
                return(
                    <TouchableOpacity onPress={()=>{
                        this.setState({isShijian:false,isModel:0})
                        Pickers.init({
                            pickerData: this.state.date,
                            selectedValue: [moment().format('YYYY'),moment().format('M'),moment().format('D')],
                            onPickerConfirm: pickedValue => {
                                var kaishiDate = new Date(pickedValue[0], pickedValue[1], pickedValue[2]);
                                if (kaishiDate < new Date()){
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        '选择日期不能小于当前日期',
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                }else{
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                    this.setState({jiesuDate:pickedValue,jiesuStr:pickedValue[0] + "/" + pickedValue[1] + '/' + pickedValue[2],dataSource: ds.cloneWithRows(this.state.tableData),})

                                }
                            },
                            onPickerCancel: pickedValue => {
                                //ListView设置
                                var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                this.setState({jieshuDate:'',jiesuStr:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                            },
                            onPickerSelect: pickedValue => {
                            }
                        });
                        Pickers.show();
                    }}>
                        <MLTableCell title={rowData}  rightTitle={this.state.jiesuStr}/>
                    </TouchableOpacity>
                )
            }else if (rowData == "选择第一次推送时点和内容"){
                return(
                    <TouchableOpacity onPress={()=>{
                        this.setState({isShijian:true})
                        Pickers.init({
                            pickerData: [['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
                                ['00','30']],
                            onPickerConfirm: pickedValue => {
                                this.setState({isModel:1,tuisong1:pickedValue[0]+ ":" + pickedValue[1],isModalOpen:true,srkxswz:['输入提示内容']})

                            },
                            onPickerCancel: pickedValue => {
                                //ListView设置
                                this.setState({tuisong1:"",tuisongnr1:""})
                            },
                        });
                        Pickers.show();
                    }}>
                        <MLTableCell title={rowData} rightTitle={this.state.tuisongnr1 != "" ? "已填" : ""}/>
                    </TouchableOpacity>
                )
            }else if (rowData == "选择第二次推送时点和内容"){
                return(
                    <TouchableOpacity onPress={()=>{
                        this.setState({isShijian:true})
                        Pickers.init({
                            pickerData: [['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
                                ['00','30']],
                            onPickerConfirm: pickedValue => {
                                this.setState({isModel:2,tuisong2:pickedValue[0]+ ":" + pickedValue[1],isModalOpen:true,srkxswz:['输入提示内容']})
                            },
                            onPickerCancel: pickedValue => {
                                //ListView设置
                                this.setState({tuisong2:"",tuisongnr2:""})
                                //ListView设置
                                {/*var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});*/}
                                {/*this.setState({csDate:'',dataSource: ds.cloneWithRows(this.state.tableData),})*/}
                            },
                        });
                        Pickers.show();
                    }}>
                        <MLTableCell title={rowData} rightTitle={this.state.tuisongnr2 != "" ? "已填" : ""} />
                    </TouchableOpacity>
                )
            }else if (rowData == "选择第三次推送时点和内容"){
                return(
                    <TouchableOpacity onPress={()=>{
                        this.setState({isShijian:true})
                        Pickers.init({
                            pickerData: [['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
                                ['00','30']],
                            onPickerConfirm: pickedValue => {
                                this.setState({isModel:3,tuisong3:pickedValue[0]+ ":" + pickedValue[1],isModalOpen:true,srkxswz:['输入提示内容']})

                            },
                            onPickerCancel: pickedValue => {
                                //ListView设置
                                this.setState({tuisong3:"",tuisongnr3:""})
                                //ListView设置
                                {/*var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});*/}
                                {/*this.setState({csDate:'',dataSource: ds.cloneWithRows(this.state.tableData),})*/}
                            },
                        });
                        Pickers.show();
                    }}>
                        <MLTableCell title={rowData}  rightTitle={this.state.tuisongnr3 != "" ? "已填" : ""}/>
                    </TouchableOpacity>
                )
            }

            return(
                <TouchableOpacity onPress={()=>{

                }}>
                    <MLTableCell title={rowData} />
                </TouchableOpacity>
            )
        }
    },
    //点击确定
    getLogin(){
        //判断两个日期是否有值
        if (this.state.kaishiDate.length == 0){
            //错误
            Alert.alert(
                '警告',
                "没填写开始日期",
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.jiesuDate.length == 0){
            //错误
            Alert.alert(
                '警告',
                "未填写结束日期",
                [
                    {text: '确定'}
                ]
            )
            return
        }
        //判断结束是否大于
        var kaistiDateStr = (this.state.kaishiDate[0].length == 1 ? ("0" + this.state.kaishiDate[0]) : this.state.kaishiDate[0]) + '' + "-" +
            (this.state.kaishiDate[1].length == 1 ? ("0" + this.state.kaishiDate[1]) : this.state.kaishiDate[1]) + '' + "-" +
            (this.state.kaishiDate[2].length == 1 ? ("0" + this.state.kaishiDate[2]) : this.state.kaishiDate[2]) + ''
        var kaishiDate = moment(kaistiDateStr);
        var jiesuDateStr = (this.state.jiesuDate[0].length == 1 ? ("0" + this.state.jiesuDate[0]) : this.state.jiesuDate[0]) + '' + "-" +
            (this.state.jiesuDate[1].length == 1 ? ("0" + this.state.jiesuDate[1]) : this.state.jiesuDate[1]) + '' + "-" +
            (this.state.jiesuDate[2].length == 1 ? ("0" + this.state.jiesuDate[2]) : this.state.jiesuDate[2]) + ''
        var jiesuDate = moment(jiesuDateStr);
        if (kaishiDate > jiesuDate){
            //错误
            Alert.alert(
                '警告',
                "开始时间不能大于结束时间",
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.tuisongnr1 == "" && this.state.tuisongnr2 == "" && this.state.tuisongnr3 == "") {
            //错误
            Alert.alert(
                '警告',
                "最少填写一次推送",
                [
                    {text: '确定'}
                ]
            )
            return
        }
        //发送网络请求
        this.setState({
            animating: true
        })
        console.log('手机号');
        console.log(this.props.phone);

        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getYytx", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID: Users.Users[0].StudyID,
                phone : this.props.phone,
                //开始时间
                kaishiStr : kaishiDate,
                //结束时间
                jiesuStr : jiesuDate,
                //推送时间
                tuisong1 : this.state.tuisong1,
                //推送内容
                tuisongnr1 : this.state.tuisongnr1,
                //推送时间
                tuisong2 :  this.state.tuisong2,
                //推送内容
                tuisongnr2 : this.state.tuisongnr2,
                //推送时间
                tuisong3 :  this.state.tuisong3,
                //推送内容
                tuisongnr3 :  this.state.tuisongnr3,
                //添加的用户
                users: Users.Users[0],
                //受试者信息
                patient:this.props.patient
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
                        "提示",
                        responseJson.msg,
                        [
                            {text: '确定'}
                        ]
                    )
                }else {
                    console.log(responseJson)
                    //错误
                    Alert.alert(
                        "提示",
                        responseJson.msg,
                        [
                            {text: '确定', onPress: () => {this.props.navigator.pop()}}
                        ]
                    )
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
        console.log(kaishiDate)
        console.log(jiesuDate)
    }
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
module.exports = Helper;
