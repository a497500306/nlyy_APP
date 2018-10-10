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
var researchParameter = require('../../../entity/researchParameter')
var SszjxfsrqSZ = require('./MLSszjxfsrqSZ')
import Icon from 'react-native-vector-icons/FontAwesome';

var SszjxfsrqCXJG = React.createClass({
    getDefaultProps(){
        return {
            data:null
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
            fetch(settings.fwqUrl + "/app/getLookupSuccessBasicsData", {
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
                    <MLNavigatorBar title={'选择受试者'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>

                    {/*设置完了加载的菊花*/}
                    <MLActivityIndicatorView />
                </View>

            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'选择受试者'} isBack={true} backFunc={() => {
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
    renderRow(rowData,sectionID, rowID){
        console.log(rowData)

        if (rowData.isOut == 1) {
            return(
                <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.persons.USubjID} subTitle={"姓名缩写:" + rowData.persons.SubjIni + "   " +((rowData.persons.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.persons.Arm != null ? ('分组:' + rowData.persons.Arm) : "分组:无")) : "")} subTitleColor = {'black'} rightTitle={'已经完成或退出'} rightTitleColor = {'gray'}/>
            )
        }else {
            if (rowData.isSuccess == 1){
                if (rowData.Random == -1){
                    if (rowData.persons.isBasicData == 1){
                        return(
                            <MLTableCell title={'受试者编号:' + rowData.USubjID}
                                         subTitle={"姓名缩写:" + rowData.SubjIni + "   " + ((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:无")) : "")}
                                         subTitleColor={'black'} rightTitle={'筛选中受试者'} rightTitleColor = {'gray'}/>
                        )
                    }else {
                        var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                        return (
                            <MLTableCell isArrow={false} title={'受试者编号:' + rowData.persons.USubjID}
                                         subTitle={"姓名缩写:" + rowData.persons.SubjIni + "   " + ((rowData.persons.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.persons.Arm != null ? ('' + rowData.persons.Arm) : "分组:无")) : "")}
                                         subTitleColor={'black'} rightTitle={grps.length == 1 ? "未给予研究治疗" : '随机号:未取'}/>
                        )
                    }
                }else {
                    var grps = researchParameter.researchParameter.NTrtGrp.split(",");
                    return(
                        <TouchableOpacity onPress={()=>{
                            //错误
                            this.props.navigator.push({
                                component: SszjxfsrqSZ, // 具体路由的版块
                                //传递参数
                                passProps: {
                                    //出生年月
                                    users: rowData.persons,
                                    Random: rowData.persons.Random
                                }
                            })
                        }}>
                            <MLTableCell title={'受试者编号:' + rowData.persons.USubjID} subTitle={"姓名缩写:" + rowData.persons.SubjIni + "   " +((rowData.persons.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + (rowData.persons.Arm == null ? "无" : rowData.persons.Arm)) : "") } subTitleColor = {'black'} rightTitle={grps.length == 1 ? "给予研究治疗":('随机号:' + rowData.persons.Random)} rightTitleColor = {'black'}/>
                        </TouchableOpacity>
                    )
                }
            }else {
                return(
                    <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3) ? ((rowData.Arm != null ? ('' + rowData.Arm) : "分组:不适用")) : "")} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
                )
            }
        }




        // if (rowData.isSuccess == 1) {
        //     if (rowData.users.isOut == 1) {
        //         return(
        //             <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.users.Arm != null ? ('分组:' + rowData.users.Arm) : "分组:无")) : "")} subTitleColor = {'black'} rightTitle={'已经完成或退出'} rightTitleColor = {'gray'}/>
        //         )
        //     }else{
        //         if (rowData.isSuccess == 1) {
        //             if (rowData.Random == -1) {
        //                 return (
        //                     <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2) ? ((rowData.users.Arm != null ? ('' + rowData.users.Arm) : "分组:无")) : "")}
        //                                  subTitleColor={'black'} rightTitle={'随机号:未取'}/>
        //                 )
        //             } else {
        //                 return (
        //                     <TouchableOpacity onPress={()=> {
        //                         //错误
        //                         this.props.navigator.push({
        //                             component: SszjxfsrqSZ, // 具体路由的版块
        //                             //传递参数
        //                             passProps: {
        //                                 //出生年月
        //                                 users: rowData.users,
        //                                 Random: rowData.Random
        //                             }
        //                         })
        //                     }}>
        //
        //                         <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={"姓名缩写:" + rowData.SubjIni + "   " +((rowData.isUnblinding == 1 || researchParameter.researchParameter.BlindSta == 3 || researchParameter.researchParameter.BlindSta == 2)? ('分组:' + rowData.users.Arm) : "") } subTitleColor = {'black'} rightTitle={'随机号:' + rowData.Random} rightTitleColor = {'black'}/>
        //                     </TouchableOpacity>
        //                 )
        //             }
        //         }
        //     }
        // }else{
        //     if (rowData.users.isOut == 1) {
        //         return(
        //             <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'已经完成或者退出'} rightTitleColor = {'gray'}/>
        //         )
        //     }else {
        //         return(
        //             <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
        //         )
        //     }
        // }
        /*********************************/
        /*
        if (rowData.isSuccess == 1) {
            if (rowData.users.isOut == 1) {
                return(
                    <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'已经完成或者退出'} rightTitleColor = {'gray'}/>
                )
            }else {
                if (rowData.Random == -1){
                    return (
                            <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni}
                                         subTitleColor={'black'} rightTitleColor = {'gray'} isArrow = {false}
                                         rightTitle={'随机号:' + (rowData.Random == -1 ? "未取" : rowData.Random)}/>
                    )
                }else{
                    return (
                        <TouchableOpacity onPress={()=> {
                            //错误
                            this.props.navigator.push({
                                component: SszjxfsrqSZ, // 具体路由的版块
                                //传递参数
                                passProps: {
                                    //出生年月
                                    users: rowData.users,
                                    Random: rowData.Random
                                }
                            })
                        }}>
                            <MLTableCell title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni}
                                         subTitleColor={'black'}
                                         rightTitle={'随机号:' + (rowData.Random == -1 ? "未取" : rowData.Random)}/>
                        </TouchableOpacity>
                    )
                }
            }
        }else{
            return(
                <MLTableCell isArrow = {false} title={'受试者编号:' + rowData.USubjID} subTitle={rowData.SubjIni} subTitleColor = {'black'} rightTitle={'筛选失败'} rightTitleColor = {'gray'}/>
            )
        }
        */
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
module.exports = SszjxfsrqCXJG;

