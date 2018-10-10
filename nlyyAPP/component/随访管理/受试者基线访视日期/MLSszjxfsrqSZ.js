
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
    TouchableHighlight,
    DatePickerIOS,
    Picker,
    ActivityIndicator
} from 'react-native';
//时间操作
var moment = require('moment');
moment().format();
import Pickers from 'react-native-picker';
var study = require('../../../entity/study');
var researchParameter = require('../../../entity/researchParameter');

var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var MLProgressHUD = require('../../MLProgressHUD/MLProgressHUD');
var Button = require('apsl-react-native-button');

var SszjxfsrqSZ = React.createClass({
    getDefaultProps(){
        return {
            //用户信息
            users:null,
            suijihao:null,
            Random:null
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
        var tableData = [];
        tableData.push('研究编号');
        tableData.push('中心编号');
        tableData.push('中心名称');
        tableData.push('受试者编号');
        tableData.push('受试者出生日期');
        tableData.push('受试者性别');
        tableData.push('受试者姓名缩写');
        tableData.push('受试者手机号');
        if (researchParameter.researchParameter.LabelStraA != null){
            tableData.push(researchParameter.researchParameter.LabelStraA)
        }
        if (researchParameter.researchParameter.LabelStraB != null){
            tableData.push(researchParameter.researchParameter.LabelStraB)
        }
        if (researchParameter.researchParameter.LabelStraC != null){
            tableData.push(researchParameter.researchParameter.LabelStraC)
        }
        if (researchParameter.researchParameter.LabelStraD != null){
            tableData.push(researchParameter.researchParameter.LabelStraD)
        }
        if (researchParameter.researchParameter.LabelStraE != null){
            tableData.push(researchParameter.researchParameter.LabelStraE)
        }
        if (researchParameter.researchParameter.LabelStraF != null){
            tableData.push(researchParameter.researchParameter.LabelStraF)
        }
        if (researchParameter.researchParameter.LabelStraG != null){
            tableData.push(researchParameter.researchParameter.LabelStraG)
        }
        if (researchParameter.researchParameter.LabelStraH != null){
            tableData.push(researchParameter.researchParameter.LabelStraH)
        }
        if (researchParameter.researchParameter.LabelStraI != null){
            tableData.push(researchParameter.researchParameter.LabelStraI)
        }
        tableData.push('随机号');
        tableData.push('基线访视日期');
        tableData.push('停止用药日期');
        tableData.push('');

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});

        return {
            tableData:tableData,
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            //ListView设置
            animating: false,
            date:date,
            isLanguage:false,
            baselineDate:null,
            baselineDateArray:[],
            stopDrugDate:null,
            stopDrugDateArray:[],
            isHud:false,
        }
    },

    render() {
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'设置随访参比日期'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else {
            if (this.state.isLanguage == false) {
                return (
                    <View style={styles.container}>
                        <MLNavigatorBar title={'设置随访参比日期'} isBack={true} backFunc={() => {
                            this.props.navigator.pop()
                        }}/>
                        <ListView
                            dataSource={this.state.dataSource}//数据源
                            renderRow={this.renderRow}
                        />
                    </View>
                );
            }else{
                return (
                    <View style={styles.container}>
                        <MLNavigatorBar title={'设置随访参比日期'} isBack={true} backFunc={() => {
                            this.props.navigator.pop()
                        }}/>
                        <ListView
                            dataSource={this.state.dataSource}//数据源
                            renderRow={this.renderRow}
                        />
                        <View style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: width,
                            height: height,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <Picker
                                selectedValue={this.state.language}
                                onValueChange={(lang) => this.setState({language: lang})}>
                                {this.PickerItem()}
                            </Picker>
                        </View>
                    </View>
                );
            }
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
        if(rowData == "研究编号") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.StudyID} isArrow={false}/>
            )
        }
        if(rowData == "中心编号") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.SiteID} isArrow={false}/>
            )
        }
        if(rowData == "中心名称") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.SiteNam} isArrow={false}/>
            )
        }
        if(rowData == "受试者编号") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.USubjID} isArrow={false}/>
            )
        }
        if(rowData == "受试者出生日期") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.SubjDOB} isArrow={false}/>
            )
        }
        if(rowData == "受试者性别") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.SubjSex}  isArrow={false}/>
            )
        }
        if (rowData == '受试者姓名缩写'){
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.SubjIni} isArrow={false}/>
            )
        }
        if (rowData == '受试者手机号'){
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.SubjMP} isArrow={false}/>
            )

        }
        if (researchParameter.researchParameter.LabelStraA != null){
            if (rowData == researchParameter.researchParameter.LabelStraA) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFa} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraB != null){
            if (rowData == researchParameter.researchParameter.LabelStraB) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFb} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraC != null){
            if (rowData == researchParameter.researchParameter.LabelStraC) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFc} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraD != null){
            if (rowData == researchParameter.researchParameter.LabelStraD) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFd} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraE != null){
            if (rowData == researchParameter.researchParameter.LabelStraE) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFe} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraF != null){
            if (rowData == researchParameter.researchParameter.LabelStraF) {

                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFf} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraG != null){
            if (rowData == researchParameter.researchParameter.LabelStraG) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFg} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraH != null){
            if (rowData == researchParameter.researchParameter.LabelStraH) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFh} isArrow={false}/>
                )
            }
        }if (researchParameter.researchParameter.LabelStraI != null){
            if (rowData == researchParameter.researchParameter.LabelStraI) {
                return (
                    <MLTableCell title={rowData} rightTitle={this.props.users.SubjFi} isArrow={false}/>
                )
            }
        }if (rowData == '随机号'){
            return(
                <MLTableCell title={rowData} rightTitle={this.props.users.Random == '' ? '没取随机号' : this.props.users.Random} isArrow={false}/>
            )

        }
        if (rowData == '基线访视日期'){
            if (this.state.baselineDate != null){
                return(
                    <TouchableOpacity onPress={()=>{
                            Pickers.init({
                                pickerData: this.state.date,
                                selectedValue: [moment().format('YYYY'),moment().format('MM'),moment().format('DD')],
                                onPickerConfirm: pickedValue => {
                                    console.log("点击确定4")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                    this.setState({baselineDateArray:pickedValue ,baselineDate:pickedValue[0] + '-' + pickedValue[1]+ '-' + pickedValue[2],dataSource: ds.cloneWithRows(this.state.tableData),})

                                },
                                onPickerCancel: pickedValue => {
                                    console.log("点击取消4")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                                    this.setState({baselineDateArray:[],baselineDate:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                                },
                                onPickerSelect: pickedValue => {
                                }
                            });
                            Pickers.show();
                        }}>
                        <MLTableCell title={rowData} rightTitle={this.state.baselineDate} isArrow={true}/>

                    </TouchableOpacity>
                )
            }else {
                return (
                    <TouchableOpacity onPress={()=>{
                            Pickers.init({
                                pickerData: this.state.date,
                                selectedValue: [moment().format('YYYY'), moment().format('MM'), moment().format('DD')],
                                onPickerConfirm: pickedValue => {
                                    console.log("点击确定5")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({
                                        baselineDateArray: pickedValue,
                                        baselineDate: pickedValue[0] + '-' + pickedValue[1] + '-' + pickedValue[2],
                                        dataSource: ds.cloneWithRows(this.state.tableData),
                                    })

                                },
                                onPickerCancel: pickedValue => {
                                    console.log("点击取消5")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({
                                        baselineDateArray: [],
                                        baselineDate: '',
                                        dataSource: ds.cloneWithRows(this.state.tableData),
                                    })
                                },
                                onPickerSelect: pickedValue => {
                                }
                            });
                            Pickers.show();
                    }}>
                        <MLTableCell title={rowData} rightTitle={this.props.users.baselineDate != null ? moment(this.props.users.baselineDate).format('YYYY-M-D') : ""} isArrow={true}/>

                    </TouchableOpacity>
                )
            }
        }
        if (rowData == '停止用药日期'){
            if (this.state.stopDrugDate != null){
                return(
                    <TouchableOpacity onPress={()=>{
                            Pickers.init({
                                pickerData: this.state.date,
                                selectedValue: [moment().format('YYYY'), moment().format('MM'), moment().format('DD')],
                                onPickerConfirm: pickedValue => {
                                    console.log("点击确定6")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({
                                        stopDrugDateArray: pickedValue,
                                        stopDrugDate: pickedValue[0] + '-' + pickedValue[1] + '-' + pickedValue[2],
                                        dataSource: ds.cloneWithRows(this.state.tableData),
                                    })
                                },
                                onPickerCancel: pickedValue => {
                                    console.log("点击确定6")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({
                                        stopDrugDateArray: [],
                                        stopDrugDate: '',
                                        dataSource: ds.cloneWithRows(this.state.tableData),
                                    })
                                },
                                onPickerSelect: pickedValue => {
                                }
                            });
                            Pickers.show();
                    }}>

                        <MLTableCell title={rowData} rightTitle={this.state.stopDrugDate} isArrow={true}/>

                    </TouchableOpacity>
                )
            }else{
                return(
                    <TouchableOpacity onPress={()=>{
                            Pickers.init({
                                pickerData: this.state.date,
                                selectedValue: [moment().format('YYYY'), moment().format('MM'), moment().format('DD')],
                                onPickerConfirm: pickedValue => {
                                    console.log("点击确定7")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({
                                        stopDrugDateArray: pickedValue,
                                        stopDrugDate: pickedValue[0] + '-' + pickedValue[1] + '-' + pickedValue[2],
                                        dataSource: ds.cloneWithRows(this.state.tableData),
                                    })

                                },
                                onPickerCancel: pickedValue => {
                                    console.log("点击取消7")
                                    //ListView设置
                                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                    this.setState({
                                        stopDrugDateArray: [],
                                        stopDrugDate: '',
                                        dataSource: ds.cloneWithRows(this.state.tableData),
                                    })
                                },
                                onPickerSelect: pickedValue => {
                                }
                            });
                            Pickers.show();
                    }}>
                        <MLTableCell title={rowData} rightTitle={this.props.users.stopDrugDate != null ? moment(this.props.users.stopDrugDate).format('YYYY-M-D') : ""} isArrow={true}/>

                        </TouchableOpacity>
                )
            }
        }
        //选择
        // if (researchParameter.researchParameter.LabelStraA != null){
        //     if (rowData == researchParameter.researchParameter.LabelStraA){
        //         return(
        //             <MLTableCell title={rowData} rightTitle={this.props.LabelStraA} isArrow={false}/>
        //         )
        //     }
        // }
        if (rowData == ''){
            return(
                <View>
                    <Button
                        style={{
                            width:width - 20,
                            height:40,
                            borderColor: 'rgba(0,136,212,1.0)',
                            backgroundColor: "rgba(0,136,212,1.0)",
                            borderRadius: 5,
                            borderWidth: 1,
                            marginTop:10,
                            marginLeft:10
                        }}
                        isLoading={this.state.isHud}
                        isDisabled={this.state.isHud}
                        textStyle={{
                            color: 'white',
                            fontSize:15
                        }}
                        onPress={this.getLogin.bind(this)}>
                        确 定
                    </Button>
                </View>
            )
        }else{
            return(
                <MLTableCell title={rowData} />
            )
        }
    },
    getLogin(){
        if (this.state.baselineDateArray.length == 0 && this.props.users.baselineDate == null){
            //错误
            Alert.alert(
                '提示',
                '请输入基线访视日期',
                [
                    {text: '确定'}
                ]
            )
            return
        }

        this.setState({
            isHud: true
        })
        var baselineDate = null;
        var stopDrugDate = null;
        console.log(this.state.stopDrugDate+"zzzzz"+this.state.baselineDate)
        if (this.state.baselineDate != null){
            baselineDate = (this.state.baselineDate == '' ? '' : new Date(this.state.baselineDateArray[0], this.state.baselineDateArray[1] - 1, this.state.baselineDateArray[2]));
        }else{
            baselineDate = this.props.users.baselineDate;
        }
        if (this.state.stopDrugDate != null){
            stopDrugDate = (this.state.stopDrugDate == '' ? '' : new Date(this.state.stopDrugDateArray[0], this.state.stopDrugDateArray[1] - 1, this.state.stopDrugDateArray[2]));
        }else{
            stopDrugDate = this.props.users.stopDrugDate;
        }
        console.log(baselineDate+"ssss"+stopDrugDate)
        //获取中心数据网络请求
        var jsonDict = {
                    StudyID:this.props.users.StudyID,
                    SiteID:this.props.users.SiteID,
                    userId:this.props.users.id,
                    user:this.props.users,
                    baselineDate:baselineDate,
                    stopDrugDate:stopDrugDate
                };
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getAddSszjxfsrq", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonDict)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isHud: false
                })
                if (responseJson.isSucceed == 200){
                    //错误
                    Alert.alert(
                        '提示',
                        responseJson.msg,
                        [
                            {text: '确定'}
                        ]
                    )
                }else {
                    //错误
                    Alert.alert(
                        '提示',
                        responseJson.msg,
                        [
                            {text: '确定', onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[3])}
                        ]
                    )
                }
            })
            .catch((error) => {//错误
                this.setState({
                    isHud: false
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
        marginBottom:20,
        height:40,
        backgroundColor:'rgba(0,136,212,1.0)',
        // 设置圆角
        borderRadius:5,
    },
});

// 输出组件类
module.exports = SszjxfsrqSZ;