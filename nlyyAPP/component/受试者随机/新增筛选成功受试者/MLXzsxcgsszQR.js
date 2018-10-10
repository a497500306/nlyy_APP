
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

var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var NewIcon = require('../../../node_modules/antd-mobile/lib/icon/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');
var study = require('../../../entity/study');
var researchParameter = require('../../../entity/researchParameter');

var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
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
            site:null,
            LabelStraA:'',
            LabelStraB:'',
            LabelStraC:'',
            LabelStraD:'',
            LabelStraE:'',
            LabelStraF:'',
            LabelStraG:'',
            LabelStraH:'',
            LabelStraI:'',
            newLabelStraI:'',
            data:null
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

        if (this.state.animating == true){
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'新增筛选成功受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else {
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'新增筛选成功受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
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
    renderRow(rowData){
        if(rowData == "研究编号") {
            return(
                <MLTableCell title={rowData} rightTitle={study.study.StudyID} isArrow={false}/>
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

        //选择
        if (researchParameter.researchParameter.LabelStraA != null){
            if (rowData == researchParameter.researchParameter.LabelStraA){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraA} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraB != null){
            if (rowData == researchParameter.researchParameter.LabelStraB){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraB} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraC != null){
            if (rowData == researchParameter.researchParameter.LabelStraC){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraC} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraD != null){
            if (rowData == researchParameter.researchParameter.LabelStraD){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraD} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraE != null){
            if (rowData == researchParameter.researchParameter.LabelStraE){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraE} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraF != null){
            if (rowData == researchParameter.researchParameter.LabelStraF){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraF} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraG != null){
            if (rowData == researchParameter.researchParameter.LabelStraG){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraG} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraH != null){
            if (rowData == researchParameter.researchParameter.LabelStraH){
                return(
                        <MLTableCell title={rowData} rightTitle={this.props.LabelStraH} isArrow={false}/>
                )
            }
        }
        if (researchParameter.researchParameter.LabelStraI != null){
            if (rowData == researchParameter.researchParameter.LabelStraI){
                return(
                    <MLTableCell title={rowData} rightTitle={this.props.LabelStraI} isArrow={false}/>
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
        if (this.props.data == null) {
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
                    SiteID: this.props.site.SiteID,
                    SiteNam: this.props.site.SiteNam,
                    ScreenYN: 1,
                    SubjDOB: this.props.csDate,
                    SubjSex: this.props.xb,
                    SubjIni: this.props.name,
                    SubjMP: this.props.phone,
                    RandoM: researchParameter.researchParameter.RandoM,
                    SubjFa: this.props.LabelStraA,
                    SubjFb: this.props.LabelStraB,
                    SubjFc: this.props.LabelStraC,
                    SubjFd: this.props.LabelStraD,
                    SubjFe: this.props.LabelStraE,
                    SubjFf: this.props.LabelStraF,
                    SubjFg: this.props.LabelStraG,
                    SubjFh: this.props.LabelStraH,
                    SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? this.props.LabelStraI : '',
                    SubjStudYN: this.props.zyj
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        animating: false
                    })
                    if (responseJson.isSucceed == 200) {
                        //错误
                        Alert.alert(
                            responseJson.msg,
                            null,
                            [
                                {text: '确定'}
                            ]
                        )
                    } else {
                        var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                        if (grps.length == 1){
                            //错误
                            Alert.alert(
                                "给予研究治疗:",
                                responseJson.USubjID,
                                [
                                    {
                                        text: '同意给予', onPress: () => this.qusuijihao(responseJson)
                                    },
                                    {
                                        text: '下次给予', onPress: () => {
                                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                    }
                                    }
                                ]
                            )
                        }else{
                            //错误
                            Alert.alert(
                                "该受试者编号为:",
                                responseJson.USubjID,
                                [
                                    {
                                        text: '取随机号', onPress: () => this.qusuijihao(responseJson)
                                    },
                                    {
                                        text: '下次再取', onPress: () => {
                                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                    }
                                    }
                                ]
                            )
                        }
                    }
                })
                .catch((error) => {//错误
                    this.setState({
                        animating: false
                    })
                    this.setState({animating: false});
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
        }else{
            //获取中心数据网络请求
            fetch(settings.fwqUrl + "/app/getAddBasisDataSuccessBasicsData", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id:this.props.data.id,
                    USubjID: this.props.data.USubjID,
                    SubjID: this.props.data.SubjID,
                    StudySeq: study.study.StudySeq,
                    StudyID: study.study.StudyID,
                    SiteID: this.props.site.SiteID,
                    SiteNam: this.props.site.SiteNam,
                    ScreenYN: 1,
                    SubjDOB: this.props.csDate,
                    SubjSex: this.props.xb,
                    SubjIni: this.props.name,
                    SubjMP: this.props.phone,
                    RandoM: researchParameter.researchParameter.RandoM,
                    SubjFa: this.props.LabelStraA,
                    SubjFb: this.props.LabelStraB,
                    SubjFc: this.props.LabelStraC,
                    SubjFd: this.props.LabelStraD,
                    SubjFe: this.props.LabelStraE,
                    SubjFf: this.props.LabelStraF,
                    SubjFg: this.props.LabelStraG,
                    SubjFh: this.props.LabelStraH,
                    SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? this.props.LabelStraI : '',
                    SubjStudYN: this.props.zyj
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        animating: false
                    })
                    if (responseJson.isSucceed == 200) {
                        //错误
                        Alert.alert(
                            responseJson.msg,
                            null,
                            [
                                {text: '确定'}
                            ]
                        )
                    } else {

                        var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                        if (grps.length == 1){
                            //错误
                            Alert.alert(
                                "给予研究治疗:",
                                responseJson.USubjID,
                                [
                                    {
                                        text: '同意给予', onPress: () => this.qusuijihao(responseJson)
                                    },
                                    {
                                        text: '下次给予', onPress: () => {
                                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                    }
                                    }
                                ]
                            )
                        }else {
                            //错误
                            Alert.alert(
                                "该受试者编号为:",
                                responseJson.USubjID,
                                [
                                    {
                                        text: '取随机号', onPress: () => this.qusuijihao(responseJson)
                                    },
                                    {
                                        text: '下次再取', onPress: () => {
                                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                    }
                                    }
                                ]
                            )
                        }
                    }
                })
                .catch((error) => {//错误
                    this.setState({
                        animating: false
                    })
                    this.setState({animating: false});
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
        }
    },

    qusuijihao(responseJson){
        if (typeof(researchParameter.researchParameter.StudyDCross) != "undefined" && researchParameter.researchParameter.StudyDCross != ''){
            var studyDCross = researchParameter.researchParameter.StudyDCross.split(",");
            studyDCross.push('取消')
            studyDCross.splice(0, 0, '请选择交叉设计');
            Popup.show(
                <View>
                    <List renderHeader={this.renderHeader}
                          className="popup-list"
                    >
                        {studyDCross.map((i, index) => (
                            <List.Item key={index}
                                       style = {{
                                           textAlign:'center'
                                       }}
                                       onClick={()=>{
                                           if (index == studyDCross.length - 1 || index == 0){
                                               Popup.hide();
                                               return;
                                           }
                                           this.jiachaQusuijihao(studyDCross[index],responseJson)
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
                                        color:(index == studyDCross.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                    }}>{i}</Text>
                                </View>
                            </List.Item>
                        ))}
                    </List>
                </View>,
                {maskClosable: true,animationType: 'slide-up' }
            )
        }else if (typeof(researchParameter.researchParameter.DrugDose) != "undefined" && researchParameter.researchParameter.DrugDose != ''){
            var studyDCross = researchParameter.researchParameter.DrugDose.split(",");
            studyDCross.push('取消')
            studyDCross.splice(0, 0, '请选择药物规格');
            Popup.show(
                <View>
                    <List renderHeader={this.renderHeader}
                          className="popup-list"
                    >
                        {studyDCross.map((i, index) => (
                            <List.Item key={index}
                                       style = {{
                                           textAlign:'center'
                                       }}
                                       onClick={()=>{
                                           if (index == studyDCross.length - 1 || index == 0){
                                               Popup.hide();
                                               return;
                                           }
                                           this.yaowujiliangQusuijihao(studyDCross[index],responseJson)
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
                                        color:(index == studyDCross.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                    }}>{i}</Text>
                                </View>
                            </List.Item>
                        ))}
                    </List>
                </View>,
                {maskClosable: true,animationType: 'slide-up' }
            )
        }else {
            //移除等待
            this.setState({animating: true});
            var UserSite = '';
            for (var i = 0; i < Users.Users.length; i++) {
                if (Users.Users[i].UserSite != null) {
                    UserSite = Users.Users[i].UserSite
                }
            }
            //获取中心数据网络请求
            fetch(settings.fwqUrl + "/app/getRandomNumber", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    StudyID: Users.Users[0].StudyID,
                    SubjFa: this.props.LabelStraA,
                    SubjFb: this.props.LabelStraB,
                    SubjFc: this.props.LabelStraC,
                    SubjFd: this.props.LabelStraD,
                    SubjFe: this.props.LabelStraE,
                    SubjFf: this.props.LabelStraF,
                    SubjFg: this.props.LabelStraG,
                    SubjFh: this.props.LabelStraH,
                    SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? this.props.LabelStraI : '',
                    SiteID: this.props.newLabelStraI,
                    czzUser: Users.Users[0],
                    userId: responseJson.id,
                    user: Users.Users[0],
                    sjzUser: {
                        USubjID: responseJson.USubjID,
                        SubjIni: this.props.name
                    }
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        animating: false
                    })
                    if (responseJson.isSucceed == 200) {
                        //错误
                        Alert.alert(
                            "提示",
                            responseJson.msg,
                            [
                                {text: '确定'}
                            ]
                        )
                    } else {
                        //错误
                        Alert.alert(
                            "提示",
                            responseJson.msg,
                            [
                                {
                                    text: '确定',
                                    onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                }
                            ]
                        )
                    }
                })
                .catch((error) => {//错误
                    this.setState({
                        animating: false
                    })
                    this.setState({animating: false});
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
        }
    },

    //交叉设计取随机号
    jiachaQusuijihao(text,responseJson){
        //错误
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //移除等待
                        this.setState({animating: true});
                        var UserSite = '';
                        for (var i = 0; i < Users.Users.length; i++) {
                            if (Users.Users[i].UserSite != null) {
                                UserSite = Users.Users[i].UserSite
                            }
                        }
                        //获取中心数据网络请求
                        fetch(settings.fwqUrl + "/app/getRandomNumber", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                StudyID: Users.Users[0].StudyID,
                                SubjFa: this.props.LabelStraA,
                                SubjFb: this.props.LabelStraB,
                                SubjFc: this.props.LabelStraC,
                                SubjFd: this.props.LabelStraD,
                                SubjFe: this.props.LabelStraE,
                                SubjFf: this.props.LabelStraF,
                                SubjFg: this.props.LabelStraG,
                                SubjFh: this.props.LabelStraH,
                                SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? this.props.LabelStraI : '',
                                SiteID: this.props.newLabelStraI,
                                czzUser: Users.Users[0],
                                StudyDCross: text,
                                userId: responseJson.id,
                                user: Users.Users[0],
                                sjzUser: {
                                    USubjID: responseJson.USubjID,
                                    SubjIni: this.props.name
                                }
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({
                                    animating: false
                                })
                                if (responseJson.isSucceed == 200) {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                } else {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {
                                                text: '确定',
                                                onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                            }
                                        ]
                                    )
                                }
                            })
                            .catch((error) => {//错误
                                this.setState({
                                    animating: false
                                })
                                this.setState({animating: false});
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
                    }}])
    },

    //药物剂量取随机号
    yaowujiliangQusuijihao(text,responseJson){
        //错误
        Alert.alert(
            "提示",
            "是否确定为:" + text,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: () => {
                        //移除等待
                        this.setState({animating: true});
                        var UserSite = '';
                        for (var i = 0; i < Users.Users.length; i++) {
                            if (Users.Users[i].UserSite != null) {
                                UserSite = Users.Users[i].UserSite
                            }
                        }
                        //获取中心数据网络请求
                        fetch(settings.fwqUrl + "/app/getRandomNumber", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                StudyID: Users.Users[0].StudyID,
                                SubjFa: this.props.LabelStraA,
                                SubjFb: this.props.LabelStraB,
                                SubjFc: this.props.LabelStraC,
                                SubjFd: this.props.LabelStraD,
                                SubjFe: this.props.LabelStraE,
                                SubjFf: this.props.LabelStraF,
                                SubjFg: this.props.LabelStraG,
                                SubjFh: this.props.LabelStraH,
                                SubjFi: researchParameter.researchParameter.StraSiteYN == '1' ? this.props.LabelStraI : '',
                                SiteID: this.props.newLabelStraI,
                                czzUser: Users.Users[0],
                                DrugDose:text,
                                userId: responseJson.id,
                                user: Users.Users[0],
                                DrugDigits:text,
                                sjzUser: {
                                    USubjID: responseJson.USubjID,
                                    SubjIni: this.props.name
                                }
                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({
                                    animating: false
                                })
                                if (responseJson.isSucceed == 200) {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {text: '确定'}
                                        ]
                                    )
                                } else {
                                    //错误
                                    Alert.alert(
                                        "提示",
                                        responseJson.msg,
                                        [
                                            {
                                                text: '确定',
                                                onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[2])
                                            }
                                        ]
                                    )
                                }
                            })
                            .catch((error) => {//错误
                                this.setState({
                                    animating: false
                                })
                                this.setState({animating: false});
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
                    }
                }
            ]
        )
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
