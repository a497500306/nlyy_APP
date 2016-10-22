
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

var study = require('../../../entity/study');
var researchParameter = require('../../../entity/researchParameter');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');

var XzsxcgsszQR = React.createClass({
    getDefaultProps(){
        return {
            //出生年月
            csDate:'',
            //受试者性别
            xb:'',
            //姓名缩写
            name:'',
            //受试者手机号
            phone:'',
            //是否参加子研究
            zyj:'',
            //中心数据
            site:null
        }
    },
    getInitialState() {
        var tableData = [];
        tableData.push('研究编号')
        tableData.push('中心编号')
        tableData.push('中心名称')
        tableData.push('受试者出生日期')
        tableData.push('受试者性别')
        tableData.push('受试者姓名缩写')
        tableData.push('受试者手机号')
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
        if (study.study.SubStudYN == 1){
            tableData.push('受试者是否参加子研究')
        }
        tableData.push('筛选结果')
        tableData.push('')

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});

        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            //ListView设置
            animating: false,
        }
    },
    render() {
        console.log(this.props.site)
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'新增筛选成功受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                </View>
            );
    },
    //返回具体的cell
    renderRow(rowData){
        if(rowData == "研究编号") {
            return(
                <MLTableCell title={rowData} rightTitle={Users.Users.StudyID} isArrow={false}/>
            )
        }
        if(rowData == "中心编号") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.site.SiteID} isArrow={false}/>
            )
        }
        if(rowData == "中心名称") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.site.SiteNam} isArrow={false}/>
            )
        }
        if(rowData == "受试者出生日期") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.csDate} isArrow={false}/>
            )
        }
        if(rowData == "受试者性别") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.xb}  isArrow={false}/>
            )
        }
        if (rowData == '受试者姓名缩写'){
            return(
                <MLTableCell title={rowData} rightTitle={this.props.name} isArrow={false}/>
            )
        }
        if (rowData == '受试者手机号'){
            return(
                <MLTableCell title={rowData} rightTitle={this.props.phone} isArrow={false}/>
            )

        }

        if (researchParameter.researchParameter.LabelStraA != null){
            if (rowData == researchParameter.researchParameter.LabelStraA){
                return(
                    <MLTableCell title={rowData} isArrow={false}/>
                )

            }
        }

        if (researchParameter.researchParameter.LabelStraB != null){
            if (rowData == researchParameter.researchParameter.LabelStraB){
                return(
                    <MLTableCell title={rowData} isArrow={false}/>
                )

            }
        }
        if (researchParameter.researchParameter.LabelStraC != null){
            if (rowData == researchParameter.researchParameter.LabelStraC){
                return(
                    <MLTableCell title={rowData} isArrow={false}/>
                )

            }
        }

        if (researchParameter.researchParameter.LabelStraD != null){
            if (rowData == researchParameter.researchParameter.LabelStraD){
                return(
                    <MLTableCell title={rowData} isArrow={false}/>
                )

            }
        }
        if (rowData == '受试者是否参加子研究'){
            return(
                <MLTableCell title={rowData} rightTitle={this.props.zyj} isArrow={false}/>
            )
        }
        if (rowData == '筛选结果'){
            return(
                <MLTableCell title={rowData} rightTitle='成功' isArrow={false}/>
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
        this.setState({
            animating: true
        })
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getAddSuccessBasicsData", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                StudySeq: study.study.StudySeq,
                StudyID: study.study.StudyID,
                SiteID:this.props.site.SiteID,
                SiteNam:this.props.site.SiteNam,
                ScreenYN:1,
                SubjDOB:this.props.csDate,
                SubjSex:this.props.xb,
                SubjIni:this.props.name,
                SubjMP:this.props.phone,
                RandoM:researchParameter.researchParameter.RandoM,
                SubjFa:researchParameter.researchParameter.LabelStraA,
                SubjFb:researchParameter.researchParameter.LabelStraB,
                SubjFc:researchParameter.researchParameter.LabelStraC,
                SubjFd:researchParameter.researchParameter.LabelStraD,
                SubjStudYN:this.props.zyj
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
                    //错误
                    Alert.alert(
                        "该患者编号为:",
                        responseJson.USubjID,
                        [
                            {text: '取随机号', onPress: () => {console.log('OK Pressed!')}},
                            {text: '下次再取', onPress: () => {this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])}}
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
module.exports = XzsxcgsszQR;
