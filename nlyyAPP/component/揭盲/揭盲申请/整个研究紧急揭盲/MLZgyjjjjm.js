
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
var study = require('../../../../entity/study');
var researchParameter = require('../../../../entity/researchParameter');

var MLActivityIndicatorView = require('../../../MLActivityIndicatorView/MLActivityIndicatorView');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../../settings');
var MLNavigatorBar = require('../../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../../entity/Users');
var MLTableCell = require('../../../MLTableCell/MLTableCell');
var MLProgressHUD = require('../../../MLProgressHUD/MLProgressHUD');

var Zgyjjjjm = React.createClass({
    getDefaultProps(){
        return {
            //用户信息
            core:null,
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
        tableData.push('揭盲申请人');
        tableData.push('申请类型');
        tableData.push('研究编号');
        tableData.push('研究简称');
        tableData.push('揭盲原因');
        tableData.push('选择不良事件因果关系');
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
            baselineDate:'',
            baselineDateArray:[],
            stopDrugDate:'',
            stopDrugDateArray:[],
            isHud:false,
            yuanying:"",
            shifouchanjia:'',
        }
    },
    render() {
        console.log(this.props.site)
        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'单个研究紧急揭盲'} isBack={true} backFunc={() => {
                        Pickers.hide();
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
                        <MLNavigatorBar title={'整个研究紧急揭盲'} isBack={true} backFunc={() => {
                            Pickers.hide();
                            this.props.navigator.pop()
                        }}/>
                        <ListView
                            dataSource={this.state.dataSource}//数据源
                            renderRow={this.renderRow}
                        />
                        <MLProgressHUD text={"正在加载..."} isVisible={this.state.isHud} />
                    </View>
                );
            }else{
                return (
                    <View style={styles.container}>
                        <MLNavigatorBar title={'整个研究紧急揭盲'} isBack={true} backFunc={() => {

                            Pickers.hide();
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
                            <MLProgressHUD text={"正在加载..."} isVisible={this.state.isHud} />
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
        if(rowData == "揭盲申请人") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users[0].UserNam} isArrow={false}/>
            )
        }
        if(rowData == "申请类型") {
            return(
                <MLTableCell title={rowData} rightTitle={'整个研究紧急揭盲'} isArrow={false}/>
            )
        }
        if(rowData == "研究编号") {
            return(
                <MLTableCell title={rowData} rightTitle={study.study.StudyID} isArrow={false}/>
            )
        }
        if(rowData == "研究简称") {
            return(
                <MLTableCell title={rowData} rightTitle={study.study.StudNameS} isArrow={false}/>
            )
        }
        if (rowData == "揭盲原因") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData:['严重不良事件','非预期不良事件','研究者要求','申办方要求','研究评价终点','不适用','其他'],
                        onPickerConfirm: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({yuanying:pickedValue[0],
                                dataSource: ds.cloneWithRows(this.state.tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({yuanying:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                        },
                        onPickerSelect: pickedValue => {
                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.yuanying}/>
                </TouchableOpacity>
            )
        }
        if (rowData == "选择不良事件因果关系") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData:['与研究药物有关','与研究药物无关','不适用'],
                        onPickerConfirm: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({shifouchanjia:pickedValue[0],
                                dataSource: ds.cloneWithRows(this.state.tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({shifouchanjia:'',dataSource: ds.cloneWithRows(this.state.tableData),})
                        },
                        onPickerSelect: pickedValue => {
                        }
                    });
                    Pickers.show();
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.shifouchanjia}/>
                </TouchableOpacity>
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
                            style={[{height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
                <MLTableCell title={rowData} />
            )
        }
    },
    getLogin(){
        if (this.state.yuanying.length == 0){
            //错误
            Alert.alert(
                '提示',
                '请选择揭盲原因',
                [
                    {text: '确定'}
                ]
            )
            return
        }
        if (this.state.shifouchanjia.length == 0){
            //错误
            Alert.alert(
                '提示',
                '请选择不良事件因果关系',
                [
                    {text: '确定'}
                ]
            )
            return
        }

        this.setState({
            isHud: true
        })
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getStudyUnblindingApplication", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudyID:Users.Users[0].StudyID,
                StudySeq:Users.Users[0].StudySeq,
                study:study.study,
                UnblindingType:4,
                UserNam:Users.Users[0].UserNam,
                UserMP:Users.Users[0].UserMP,
                Causal:this.state.shifouchanjia,
                Reason:this.state.yuanying,
            })
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
module.exports = Zgyjjjjm;
