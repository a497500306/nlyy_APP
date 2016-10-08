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
    ScrollView,
    ListView
} from 'react-native';

var Home = require('../MLHome/MLHome');
var UserData = require('../../entity/UserData');
var MLNavigatorBar = require('../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../MLTableCell/MLTableCell');
var Users = require('../../entity/Users');

var SelectionStudy = React.createClass({

    getDefaultProps(){
        return {
            phone:"123",
        }
    },

    componentDidMount() {
        //这里获取从FirstPageComponent传递过来的参数: id
        this.setState({
            phone: this.props.phone
        });
    },

    getInitialState() {
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});

        return {
            //ListView设置
            dataSource: ds.cloneWithRows(UserData.data),

            phone:"",
            animating: false,//是否显示菊花
        }
    },

    // 复杂的操作:定时器\网络请求
    componentDidMount(){
        //获取用户列表数据
       console.log(UserData.data)
    },

    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'选择研究'} isBack={false}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                {/*<ScrollView>*/}
                    {/*{this.tableCell()}*/}
                {/*</ScrollView>*/}
            </View>
        );
    },
    // 跳转到二级界面
    pushToDetail(){
        // 页面的切换
        this.props.navigator.push({
            component: Home, // 具体路由的版块
        });
    },

    //返回具体的cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                //设置数据
                Users.Users = rowData,
                    console.log(rowData)
                    console.log(Users.Users)
                // 页面的切换
                this.props.navigator.push({
                    component: Home, // 具体路由的版块
                });
            }}>
                 <MLTableCell title={rowData.SponsorS} subTitle={rowData.StudNameS}/>
            </TouchableOpacity>
        )
    },

    tableCell(){
        var cells = [];
        for (var i = 0 ; i < UserData.data.length ; i++){
            cells.push(<MLTableCell key={i} title={UserData.data[i].SponsorS} subTitle={UserData.data[i].StudNameS} data={UserData.data[i]}/>)
        }
        return cells
    },
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
    }
});

// 输出组件类
module.exports = SelectionStudy;
