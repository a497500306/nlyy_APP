
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    ScrollView,
    Alert
} from 'react-native';
//时间操作
var moment = require('moment');
moment().format();

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var settings = require('../../../settings');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var Users = require('../../../entity/Users');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var PatientRM = require('../../受试者随机/MLPatientRM');
var ResearchCore = require('../研究中心/MLResearchCore');
var Warehouse = require('../仓库/MLWarehouse');
var users = require('../../../entity/Users')

var Cxywh = React.createClass({
    getInitialState() {
        return {
            //ListView设置
            animating: true,
            data:null
        }
    },
    getDefaultProps(){
        return {
            datas : null,
        }
    },
    render() {
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'查询药物号'} isBack={true} backFunc={() => {
                        this.props.navigator.pop()
                    }}/>
                    <ScrollView>
                        {/*设置箭头*/}
                        {this.tableCell()}
                    </ScrollView>
                </View>

            );
    },
    tableCell(){
        var cells = []
        console.log(this.props.datas)
        if (this.props.datas.drugs.length != 0){
            cells.push(
                <View key={1} style={styles.zongView}>
                    <View key={2} style={styles.xiantiaoViewStyle}>
                        <View key={3} style={{flex: 1,marginLeft:20,width: 2, height: 50,backgroundColor: 'rgba(183,183,183,1.0)'}}/>
                        <View key={4} style={{position:'absolute', left:18, top:12,width: 6,borderRadius:2.5, height: 6,backgroundColor: 'rgba(183,183,183,1.0)'}} />
                        {/*<View key={key + j + '.' + 4} style={{marginLeft:20,width: 2, height: 150,backgroundColor: 'steelblue'}}/>*/}
                    </View>
                    <View key={5} style={{backgroundColor: 'white',width: width - 42}}>
                        <Text key={6} style={{marginTop:10,fontSize: 16,}}>该药物号还未出仓</Text>
                        <View key={8} style={{backgroundColor: 'rgba(244,244,244,1.0)',marginTop:10,width: width - 42,height: 1}}/>
                    </View>
                </View>
            )
        }else {
            for (var i = 0 ; i < this.props.datas.DYSDrugs.length ; i++){
                var key = (i + 1) * 10;
                var  jj = 1;
                if (this.props.datas.YSZDrugs.length > 0){
                    jj = 2
                }
                if (this.props.datas.YSZDrugs[i].isSign == 1){
                    jj = 3
                }
                if (this.props.datas.drugCKs.length > 0){
                    jj = 4
                }
                for (var j = 0 ; j < jj ; j++){
                    var str = '';
                    var dataStr = '';
                    if (j == 0) {
                        str = '已在' + this.props.datas.DYSDrugs[i].UsedAddress.DepotName + '中分配药物号';
                        dataStr = moment(this.props.datas.DYSDrugs[i].Date).format('YYYY-MM-DD HH:mm:ss')
                    }else if (j == 1) {
                        str = this.props.datas.DYSDrugs[i].UsedAddress.DepotName + '发出成功';
                        dataStr = moment(this.props.datas.DYSDrugs[i].DeliveryDate).format('YYYY-MM-DD HH:mm:ss')
                    }else if (j == 2) {
                        if (this.props.datas.YSZDrugs[i].Address.DepotName != null){
                            str = this.props.datas.YSZDrugs[i].Address.DepotName + '已接受';
                            dataStr = moment(this.props.datas.DYSDrugs[i].SignDate).format('YYYY-MM-DD HH:mm:ss')
                        }else {
                            str = this.props.datas.YSZDrugs[i].Address.SiteNam + '已接受';
                            dataStr = moment(this.props.datas.DYSDrugs[i].SignDate).format('YYYY-MM-DD HH:mm:ss')
                        }
                    }else if (j ==3) {
                        if (i == this.props.datas.DYSDrugs.length - 1){//显示状态
                            if (this.props.datas.drugCKs[0].DDrugNumAYN == 1){

                            }else{
                                
                            }
                            if (this.props.datas.drugCKs[0].DDrugNumAYN == 1){

                            }

                        }else{//显示已激活
                            if (this.props.datas.YSZDrugs[i].Address.DepotName != null){
                                str = this.props.datas.YSZDrugs[i].Address.DepotName + '激活';
                                dataStr = moment(this.props.datas.DYSDrugs[i].SignDate).format('YYYY-MM-DD HH:mm:ss')
                            }else {
                                str = this.props.datas.YSZDrugs[i].Address.SiteNam + '激活';
                                dataStr = moment(this.props.datas.DYSDrugs[i].SignDate).format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    }
                    cells.push(
                        <View key={key + j + '.' + 5} style={styles.zongView}>
                            <View key={key + j + '.' + 1} style={styles.xiantiaoViewStyle}>
                                <View key={key + j + '.' + 2} style={{flex: 1,marginLeft:20,width: 2, height: 50,backgroundColor: 'rgba(183,183,183,1.0)'}}/>
                                <View key={key + j + '.' + 3} style={{position:'absolute', left:18, top:12,width: 6,borderRadius:2.5, height: 6,backgroundColor: 'rgba(183,183,183,1.0)'}} />
                                {/*<View key={key + j + '.' + 4} style={{marginLeft:20,width: 2, height: 150,backgroundColor: 'steelblue'}}/>*/}
                            </View>
                            <View key={key + j} style={{backgroundColor: 'white',width: width - 42}}>
                                <Text key={key + j + '.' + 6} style={{marginTop:10,fontSize: 16,}}>{str}</Text>
                                <Text key={key + j + '.' + 7} style={{color: 'rgba(183,183,183,1.0)',marginTop:6,fontSize: 12,}}>{dataStr}</Text>
                                <View key={key + j} style={{backgroundColor: 'rgba(244,244,244,1.0)',marginTop:10,width: width - 42,height: 1}}/>
                            </View>
                        </View>
                    )
                }
            }
        }
        return cells;
    }
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
    }
});

// 输出组件类
module.exports = Cxywh;
