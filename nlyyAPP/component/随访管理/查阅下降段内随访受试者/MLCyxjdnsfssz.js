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

//时间操作
var moment = require('moment');
moment().format();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLActivityIndicatorView = require('../../MLActivityIndicatorView/MLActivityIndicatorView');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter');
var MLModal = require('../../MLModal/MLModal');
var MLProgressHUD = require('../../MLProgressHUD/MLProgressHUD');
import Icon from 'react-native-vector-icons/FontAwesome';

var Cyxjdnsfssz = React.createClass({
    getDefaultProps(){
        return {
            data:null,
            shuliang:0
        }
    },
    //初始化设置
    getInitialState() {
        return {
            //ListView设置
            dataSource: null,
            animating: true,//是否显示菊花
            tableData:[],
            shuru:'',
            content:"",
            isHud:false,
            srkxswz:['输入短信内容'],
            isModalOpen:false,
            phone:'',
            isBJModalOpen:false
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
            fetch(settings.fwqUrl + "/app/getCyxjdnsfssz", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SiteID : UserSite,
                    StudyID : Users.Users[0].StudyID,
                    Days : this.props.shuliang
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.isSucceed != 400){
                        //移除等待
                        Alert.alert(
                            '提示:',
                            responseJson.msg,
                            [
                                {text: '确定', onPress: () => {
                                    this.props.navigator.pop()
                                }}
                            ]
                        )
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
                    <MLNavigatorBar title={'查阅下阶段内随访受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'查阅下阶段内随访受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ListView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    />
                    <MLSelectionModal tableData={[
                        "研究温馨提示：请按照您主治医生的要求，在规定时间来医院进行检查，此检查对您的康复非常重要，请勿自行终止复查。",
                        "研究温馨提示：定期检查可在疾病复发早期获得诊断从而给予必要治疗，请您在规定时间来医院进行检查。",
                        "研究温馨提示：请根据医嘱在XXXX年XX月XX日来医院进行相关检查，本次检查对您的康复十分重要，如有问题或者当日有其他事务，请及时联系您的主治医生，电话：XXXXXXXXXXX。",
                        "研究温馨提示：近日请根据约定时间来医院进行各项检查，以便更好地康复。",
                        "研究温馨提示：请您在规定的时间来医院，由您的主管医生向您了解治疗后的主观感觉，进行必要的体格检查。"
                    ]} isVisible={this.state.isModalOpen}
                                      onClose={(text) => {
                                          this.setState({isModalOpen:false,isBJModalOpen:true,content:text})
                                      }}
                                      quxiao={(text) => {
                                          this.setState({isModalOpen:false,isBJModalOpen:false,content:""})
                                      }}>></MLSelectionModal>

                    <MLModal content={this.state.content} placeholders={this.state.srkxswz} isVisible={this.state.isBJModalOpen}
                             onClose={(text) => {
                                 this.setState({isBJModalOpen:false,isHud:false});
                                 //网络请求
                                 fetch(settings.fwqUrl + "/app/getFsyysfdx", {
                                     method: 'POST',
                                     headers: {
                                         'Accept': 'application/json; charset=utf-8',
                                         'Content-Type': 'application/json',
                                     },
                                     body: JSON.stringify({
                                         content : text,
                                         phone : this.state.phone
                                     })
                                 })
                                     .then((response) => response.json())
                                     .then((responseJson) => {
                                         console.log(responseJson)
                                         if (responseJson.isSucceed != 400){
                                             //移除等待
                                             this.setState({isModalOpen:false,isHud:false});
                                             //错误
                                             Alert.alert(
                                                 '提示:',
                                                 responseJson.msg,
                                                 [
                                                     {text: '确定'}
                                                 ]
                                             )
                                         }else{
                                             //ListView设置
                                             this.setState({isModalOpen:false,isHud:false});
                                             Alert.alert(
                                                 '提示:',
                                                 responseJson.msg,
                                                 [
                                                     {text: '确定'}
                                                 ]
                                             )
                                         }
                                     })
                                     .catch((error) => {//错误
                                         //移除等待,弹出错误
                                         this.setState({isModalOpen:false,isHud:false});
                                         //错误
                                         Alert.alert(
                                             '提示:',
                                             '请检查您的网络',
                                             [
                                                 {text: '确定'}
                                             ]
                                         )
                                     });
                             }}
                             quxiao={(text) => {
                                 this.setState({isModalOpen:false,isBJModalOpen:false,content:""})
                             }}>></MLModal>
                    <MLProgressHUD text={"正在加载..."} isVisible={this.state.isHud} />
                </View>

            );
        }
    },

    //返回具体的cell
    renderRow(rowData,sectionID, rowID){
        console.log(rowData)
        return(
            <TouchableOpacity style={{marginTop : 10,}} onPress={()=>{
                //错误
                Alert.alert(
                    '提示:',
                    '请选择功能',
                    [
                        {text: '发送预约随访短信', onPress: () => {
                            this.setState({isModalOpen:true,phone:rowData.users.user.SubjMP})
                        }},

                        {text: '取消'}
                    ]
                )
            }}>
                <View style={{
                    backgroundColor:'white',
                    borderBottomColor:'#dddddd',
                    borderBottomWidth:0.5,
                }}>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'中心编号:' + rowData.users.user.SiteID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'受试者编号:' + rowData.users.user.USubjID}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'随机号:' + rowData.users.user.Random}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'性别:' + rowData.users.user.SubjSex}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'姓名缩写:' + rowData.users.user.SubjIni}</Text>
                    <Text style={{
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'是否完成基线访视:' + '是'}</Text>
                    <Text style={{
                        marginBottom : 5,
                        marginTop : 5,
                        marginLeft : 10
                    }}>{'下一次访视是:' + (moment().add(10, "days").format("YYYY-MM-DD"))}</Text>
                </View>
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
module.exports = Cyxjdnsfssz;

