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
var researchParameter = require('../../../entity/researchParameter')
import Icon from 'react-native-vector-icons/FontAwesome';

var QuhlsLB = React.createClass({
    getDefaultProps(){
        return {
            userData:null
        }
    },

    //初始化设置
    getInitialState() {
        //ListView设置
        var tableData = this.props.userData.Drug;
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            animating: true,//是否显示菊花
            tableData:[],
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'取药物号历史'} isBack={true} backFunc={() => {
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
    renderRow(rowData,sectionID, rowID){
        console.log(rowData)
        console.log(this.props.userData)
        return(
            <MLTableCell title={'受试者编号:' + this.props.userData.USubjID} subTitle={'药物号:' + rowData} subTitleColor = {'black'} rightTitle={moment(this.props.userData.DrugDate[rowID]).format('YYYY-MM-DD HH:mm:ss')} rightTitleColor = {'black'} isArrow={false}/>
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
module.exports = QuhlsLB;

