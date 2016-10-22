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
    ScrollView

} from 'react-native';

import Chart from 'react-native-chart';

var Users = require('../../../entity/Users');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');

const data = [
    [0, 1],
    [1, 3],
    [3, 7],
    [4, 20],
];
var Cysxlsfb = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'查阅筛选例数分布'} isBack={true} backFunc={() => {
                    this.props.navigator.pop()
                }}/>
                <ScrollView>
                    <ScrollView horizontal = {true} style={{height: 300,}}>
                        <Chart
                            style={styles.chart}
                            data={data}
                            type="bar"
                            showDataPoint={true}
                        />
                    </ScrollView>
                </ScrollView>
            </View>
        );
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
    },
    chart: {
        width: 200,
        height: 200,
    },
});

// 输出组件类
module.exports = Cysxlsfb;

