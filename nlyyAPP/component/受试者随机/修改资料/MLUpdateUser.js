import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    NativeModules,
    DeviceEventEmitter,
    AsyncStorage,
    ScrollView,
    ListView,
    Alert,
    ActivityIndicator
} from 'react-native';
import Pickers from 'react-native-picker';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
//loding
var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var InputItem = require('../../../node_modules/antd-mobile/lib/input-item/index');
const Item = List.Item;
const Brief = Item.Brief;

var Users = require('../../../entity/Users')
var MLModal = require('../../MLModal/MLModal');
var study = require('../../../entity/study');
var settings = require('../../../settings');
var researchParameter = require('../../../entity/researchParameter');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');

var MLUpdateUser = React.createClass({

    getInitialState() {
        var tableData = [];
        tableData.push('受试者编号')
        tableData.push('受试者出生日期')
        tableData.push('受试者性别')
        tableData.push('受试者姓名缩写')
        tableData.push('受试者手机号')
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
        }return {
            tableData:tableData,
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
            //姓名缩写
            name:'',
            //受试者手机号
            phone:'',
            //输入的第几个
            shuru:0,
            //是否显示moda
            isModalOpen:false,
            //输入框显示文字
            srkxswz:['']
        }
    },
    componentDidMount(){
        this.setState({
            csDate:this.props.userData.persons.SubjDOB,
            name:this.props.userData.persons.SubjIni,
            xb:this.props.userData.persons.SubjSex,
            phone:this.props.userData.persons.SubjMP,
        })
    },
    closeModal() {
        this.setState({isModalOpen: false});
    },
    getDefaultProps(){
        return {
            userData:null,
            moneyfocused:true,
            isMohu:false
        }
    },
    render() {
        console.log(this.props.userData)
        return(
            <View style={styles.container}>
                <MLNavigatorBar title={'修改基本信息'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ListView
                    style={{width:width}}
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                {/*<Modal isVisible={this.state.isModalOpen} onClose={() => this.closeModal()}>*/}
                {/*<Text>Hello world!</Text>*/}
                {/*</Modal>*/}
                <MLModal placeholders={this.state.srkxswz} isVisible={this.state.isModalOpen}
                         onClose={(text) => {
                             //ListView设置
                             var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                             if (this.state.shuru == 0){
                                 this.setState({name:text,dataSource: ds.cloneWithRows(this.state.tableData),isModalOpen:false,srkxswz:['受试者姓名缩写']})
                             }else{
                                 this.setState({phone:text,dataSource: ds.cloneWithRows(this.state.tableData),isModalOpen:false,srkxswz:['受试者姓名缩写']})
                             }
                         }}
                         quxiao={(text) => {
                             this.setState({isModalOpen:false,srkxswz:['受试者姓名缩写']})
                         }}>></MLModal>
            </View>
        )
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
        //选择
        /*************/
        if(rowData == "受试者编号") {
            return(
                <MLTableCell title={rowData} rightTitle={this.props.userData.persons.USubjID} isArrow={false}/>
            )
        }
        if(rowData == "受试者出生日期") {
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.init({
                        pickerData: this.state.date,
                        selectedValue: [1960,1,1],
                        onPickerConfirm: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({csDate:pickedValue[0] + '/' + pickedValue[1]+ '/' + pickedValue[2],dataSource: ds.cloneWithRows(this.state.tableData),})

                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({csDate:'',dataSource: ds.cloneWithRows(this.state.tableData),})
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

                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({xb:pickedValue[0],dataSource: ds.cloneWithRows(this.state.tableData),})
                        },
                        onPickerCancel: pickedValue => {
                            //ListView设置
                            var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
                            this.setState({xb:'',dataSource: ds.cloneWithRows(this.state.tableData),})
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

        if (rowData == '受试者手机号'){
            return(
                <TouchableOpacity onPress={()=>{
                    Pickers.hide();
                    this.setState({isModalOpen:true,srkxswz:['受试者手机号'],shuru:1})
                }}>
                    <MLTableCell title={rowData} rightTitle={this.state.phone}/>
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
                            style={[styles.centering, {height: 30}]}
                            size="small"
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            )
        }
        return(
            <MLTableCell title={rowData}/>
        )
    },
    IsNum(s)
    {
        if(s!=null){
            var r,re;
            re = /\d*/i; //\d表示数字,*表示匹配多个数字
            r = s.match(re);
            return (r==s)?true:false;
        }
        return false;
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
        if (this.state.phone.length != 11){
            //错误
            Alert.alert(
                '请输入正确的手机号',
                null,
                [
                    {text: '确定'}
                ]
            )
            return
        }else if (/^\d+$/.test(this.state.phone) == false){
            //判断是否为数字
            //错误
            Alert.alert(
                '请输入正确的手机号',
                null,
                [
                    {text: '确定'}
                ]
            )
            return
        }
        var UserSite = '';
        for (var i = 0 ; i < Users.Users.length ; i++) {
            if (Users.Users[i].UserSite != null) {
                UserSite = Users.Users[i].UserSite
            }
        }
        Toast.loading('修改中...',60);
        //获取中心数据网络请求
        fetch(settings.fwqUrl + "/app/getUpdateFailPatientData", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                //出生年月
                csDate:this.state.csDate,
                //受试者性别
                xb:this.state.xb,
                //姓名缩写
                name:this.state.name,
                //受试者手机号
                phone:this.state.phone,
                id:this.props.userData.persons.id,
                StudyID:Users.Users[0].StudyID
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isSucceed == 200){

                    Toast.hide()
                    Toast.fail(responseJson.msg, 1);
                }else {
                    Toast.hide()
                    if (this.props.isMohu == true){
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[3])
                    }else {
                        //发送通知
                        DeviceEventEmitter.emit('updateUserSuccess');
                        Toast.success('修改成功!', 1,() => {
                            this.props.navigator.pop()
                        });
                    }
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
})

module.exports = MLUpdateUser;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white'
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
})
