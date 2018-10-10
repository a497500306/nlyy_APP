/**
 * Created by Rolle on 2017/5/25.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Platform
} from 'react-native';
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var ImagePicker = require('react-native-image-picker');

import ImagePicker1 from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

var settings = require("../../../settings");
var buttons = ['取消', '拍照', '相册中选择'];
if (Platform.OS !== 'ios'){
    buttons = ['取消', '相册中选择'];
}
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
var friendId = 0;
var seveRowData = {};
var options = {
    title: 'Select Avatar',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    mediaType:'photo',
    quality:0.4
};
var MLMoKuaiNewUpdateList = React.createClass({
    show() {
        this.ActionSheet.show();
    },
    _handlePress(index) {
    },
    getInitialState() {
        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            tableData:[],
            //ListView设置
            dataSource: ds.cloneWithRows([]),
            avatarSource:null
        }
    },

    render() {
        // console.log('更新属性' + this.props.initialProps.weChatUser + "123")
        return (
            <View style={styles.container}>
                <MLNavigatorBar title={'按模块上传'} isBack={true} newTitle={"plus-circle"} backFunc={() => {
                    this.props.navigator.pop()
                }} newFunc={()=>{
                    this.show(this)
                }} leftTitle={'首页'} leftFunc={()=>{
                    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                }}/>
                <ListView
                    dataSource={this.state.dataSource}//数据源
                    renderRow={this.renderRow}
                />
                <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    title="选择您的操作？"
                    options={buttons}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={(sss)=>{
                        this._handlePress(this)
                        if (sss == 1){//点击修改备注
                            console.log('点击相机');
                            if (Platform.OS != 'ios'){
                                console.log('点击安卓相册');
                                ImagePicker1.openPicker({
                                    cropping: false,
                                    multiple: false
                                }).then(image => {
                                    console.log('图片地址');
                                    console.log(image.path);
                                    let formData = new FormData();
                                    let file = {uri: image.path, type: 'multipart/form-data', name: 'image.png'};
                                    formData.append("images",file);
                                    fetch(settings.fwqUrl + "/app/imageUpdata",{
                                        method:'POST',
                                        headers:{
                                            'Content-Type':'multipart/form-data',
                                        },
                                        body:formData,
                                    })
                                        .then((response) => response.json())
                                        .then((responseJson) => {
                                            console.log('成功??');
                                            console.log(responseJson);
                                        })
                                        .catch((error) => {
                                            console.log('错误??');
                                            console.log(error);
                                        });
                                })
                            }else {
                                options.quality = 0.5;
                                //启动相机：
                                ImagePicker.launchCamera(options, (response) => {
                                    if (response.didCancel) {
                                        console.log('User cancelled image picker');
                                    }
                                    else if (response.error) {
                                        console.log('ImagePicker Error: ', response.error);
                                    }
                                    else if (response.customButton) {
                                        console.log('User tapped custom button: ', response.customButton);
                                    }
                                    else {
                                        let source = {uri: response.uri};
                                        console.log('Response = ', source);

                                        // You can also display the image using data:
                                        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                                        this.setState({
                                            avatarSource: source
                                        });
                                    }
                                });
                                ImagePicker.showImagePicker(options, (response) => {


                                });
                            }
                        }else if (sss == 2){//点击查看资料
                            console.log('点击相册');
                            // Open Image Library:
                            ImagePicker.launchImageLibrary(options, (response)  => {
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                }
                                else if (response.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                }
                                else if (response.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                }
                                else {
                                    let source = { uri: response.uri };
                                    console.log('相册 = ', source);

                                    // You can also display the image using data:
                                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                                    this.setState({
                                        avatarSource: source
                                    });

                                    let formData = new FormData();
                                    let file = {uri: source.uri, type: 'multipart/form-data', name: 'image.png'};
                                    formData.append("images",file);
                                    fetch(settings.fwqUrl + "/app/imageUpdata",{
                                        method:'POST',
                                        headers:{
                                            'Content-Type':'multipart/form-data',
                                        },
                                        body:formData,
                                    })
                                        .then((response) => response.json())
                                        .then((responseJson) => {
                                            console.log('成功??');
                                            console.log(responseJson);
                                        })
                                        .catch((error) => {
                                            console.log('错误??');
                                            console.log(error);
                                        });
                                }
                            });
                        }
                    }}
                />
            </View>
        );
    },

    //返回具体的cell
    renderRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity onPress={()=> {
            }}>
                <MLTableCell title={'图片' + rowID}/>
            </TouchableOpacity>
        )
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(233,234,239,1.0)',
    },
});

// 输出组件类
module.exports = MLMoKuaiNewUpdateList;