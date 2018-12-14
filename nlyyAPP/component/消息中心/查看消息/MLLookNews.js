import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Platform,
    PermissionsAndroid,
    ScrollView,
    Alert,
    DeviceEventEmitter
} from 'react-native';

var uuid = require('uuid');
import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';
var settings = require('../../../settings');
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLQuestion = require('../../图片管理模块/质疑/MLQuestion');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
import ActionSheet from 'react-native-actionsheet';
import Sound from 'react-native-sound';                        // 播放声音组件
import {AudioRecorder, AudioUtils} from 'react-native-audio';
// let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
// 目录/data/user/0/com.opms_rn/files/test.aac
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Button = require('apsl-react-native-button');
var WingBlank = require('../../../node_modules/antd-mobile/lib/wing-blank/index');
var WhiteSpace = require('../../../node_modules/antd-mobile/lib/white-space/index');
// var Button = require('../../../node_modules/antd-mobile/lib/button/index');
var Popup = require('../../../node_modules/antd-mobile/lib/popup/index');
var List = require('../../../node_modules/antd-mobile/lib/list/index');

var netTool = require('../../../kit/net/netTool'); //网络请求

var ImagePicker = require('react-native-image-picker');

import MLPhotoView from '../../MLPhotoView/MLPhotoView';

var buttons = ['取消', '拍照', '相册中选择'];
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


var MLLookNews = React.createClass({
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('updateMoKuai',this.updateModelData);
        this.getData()
        
    },

    // 更新数据
    updateModelData(){
        Toast.loading('请稍后...',60);
        fetch(settings.fwqUrl + "/app/getUserModeulesData", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : this.state.data.CRFModeule.id
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Toast.hide()
                if (responseJson.isSucceed == 400){
                    let data = this.state.data
                    data.CRFModeule = responseJson.data
                    this.setState({
                        data : data
                    })
                }
            })
            .catch((error) => {//错误

            });
    },

    //标记已读
    getData(){
        fetch(settings.fwqUrl + "/app/getNewsHaveRead", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : this.props.data.id
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                DeviceEventEmitter.emit('updateNews');
            })
            .catch((error) => {//错误

            });
    },

    getDefaultProps(){
        return {
            data:null
        }
    },

    show() {
        this.timer = setTimeout(
            () => { this.ActionSheet.show(); },
            500
        );
        return;
        /*
        Popup.show(
            <List renderHeader={() => `选择您的功能`}>
                <List.Item
                    justify = 'center'
                    onClick={() => {
                        Popup.hide()
                        this.upImage(1,this)
                    }}

                >
                    <View style={{justifyContent:'center',alignItems:'center'}} >
                    <Text textAlign = 'center' width={width} style={{fontSize: 20}}>相机</Text>
                    </View>
                </List.Item>
                <List.Item
                    justify = 'center'
                    onClick={() => {
                        Popup.hide()
                        this.upImage(2,this)
                    }}
                >
                    <View style={{justifyContent:'center',alignItems:'center'}} >
                        <Text textAlign = 'center' width={width} style={{fontSize: 20}}>相册</Text>
                    </View>
                </List.Item>
                <List.Item
                    onClick={() => {
                        Popup.hide()
                    }}
                >
                    <View style={{justifyContent:'center',alignItems:'center'}} >
                        <Text textAlign = 'center' width={width} style={{fontSize: 20}}>取消</Text>
                    </View></List.Item>
            </List>
        , { animationType: 'slide-up', maskClosable: false })
        */
    },
    _handlePress(index) {
    },

    getInitialState() {
        return {
            currentTime: 0.0,                                                   //开始录音到现在的持续时间
            recording: false,                                                   //是否正在录音
            stoppedRecording: false,                                            //是否停止了录音
            finished: false,                                                    //是否完成录音
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',          //路径下的文件名
            hasPermission: undefined,
            zhanghao:'',//输入的文字'
            isPlaying:false,
            data : this.props.data
        }
        this.prepareRecordingPath = this.prepareRecordingPath.bind(this);     //执行录音的方法
        this.checkPermission = this.checkPermission.bind(this);               //检测是否授权
        this.record = this.record.bind(this);                                 //录音
        this.stop = this.stop.bind(this);                                     //停止
        this.play = this.play.bind(this);                                     //播放
        this.pause = this.pause.bind(this);                                   //暂停
        this.finishRecording = this.finishRecording.bind(this);
    },
    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",            //录音质量
            AudioEncoding: "aac",           //录音格式
            AudioEncodingBitRate: 32000     //比特率
        });
    },
    checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': '获取录音权限',
            'message': '正请求获取麦克风权限用于录音,是否准许'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                // alert(result);     //结果: granted ,    PermissionsAndroid.RESULTS.GRANTED 也等于 granted
                return (result === true || PermissionsAndroid.RESULTS.GRANTED)
            })
    },
    async record() {
        // 如果正在录音
        if (this.state.recording) {
            alert('正在录音中!');
            return;
        }

        //如果没有获取权限
        if (!this.state.hasPermission) {
            alert('没有获取录音权限!');
            return;
        }

        //如果暂停获取停止了录音
        if(this.state.stoppedRecording){
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    },

    async stop() {
        // 如果没有在录音
        if (!this.state.recording) {
            alert('没有录音, 无需停止!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this.finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }

    },

    async play() {
        // 如果在录音 , 执行停止按钮
        if (this.state.recording) {
            await this.stop();
        }

        Toast.loading('正在播放录音...',1000);
        console.log('播放录音')
        console.log(this.state.data.voiceUrls)
        // 使用 setTimeout 是因为, 为避免发生一些问题 react-native-sound中
        setTimeout(() => {
            var sound = new Sound(this.props.data.voiceUrls, '', (error) => {
                if (error) {
                    Toast.hide();
                    Toast.fail('播放失败');
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        Toast.hide();
                        console.log('successfully finished playing');
                    } else {
                        Toast.hide();
                        Toast.fail('播放失败');
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    },

    async pause() {
        if (!this.state.recording) {
            alert('没有录音, 无需停止!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false});

        try {
            const filePath = await AudioRecorder.pauseRecording();

            // 在安卓中, 暂停就等于停止
            if (Platform.OS === 'android') {
                this.finishRecording(true, filePath);
            }
        } catch (error) {
            console.error(error);
        }
    },

    finishRecording(didSucceed, filePath) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    },
    render(){
        console.log('传递的数据');
        console.log(this.state.data);
        var markTypeStr = ""
        if (this.state.data.CRFModeule != null){
            var rightTitle = '';
            var TitleColor = ''
            if (this.state.data.CRFModeule.imageType == 0){
                rightTitle = '点击上传图片';
                TitleColor = 'red';
            }else if (this.state.data.CRFModeule.imageType == 1){
                rightTitle = '等待核查(' + this.state.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.state.data.CRFModeule.imageType == 2){
                rightTitle = '正在核查(' + this.state.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.state.data.CRFModeule.imageType == 3){
                rightTitle = '冻结(' + this.state.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.state.data.CRFModeule.imageType == 6){
                rightTitle = '质疑处理中(' + this.state.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.state.data.CRFModeule.imageType == 4){
                return (<View/>)
            }else if (this.state.data.CRFModeule.imageType == 5){
                return (<View/>)
            }
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'消息'} isBack={true} rightTitle={"回复"} backFunc={() => {
                        Toast.hide();
                        this.props.navigator.pop()
                    }} newFunc={()=>{
                        Toast.hide();
                        this.getLogin()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        Toast.hide();
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} right2Title={'标记'} right2Func={()=>{
                        this.cellOnLongPress()
                    }}/>
                    <ScrollView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    >
                        <TouchableOpacity onPress={()=> {
                            this.clickModel()
                            return
                            if (this.state.data.CRFModeule.imageUrls.length == 0){
                                //错误
                                Alert.alert(
                                    '提示:',
                                    '没有发现任何图片',
                                    [
                                        {text: '确定'}
                                    ]
                                )
                                return;
                            }
                            var images = [];
                            for (var i= 0 ; i < this.state.data.CRFModeule.imageUrls.length ; i++){
                                var json = {
                                    url : this.state.data.CRFModeule.imageUrls[i]
                                }
                                images.push(json)
                            }
                            // 页面的切换
                            this.props.navigator.push({
                                component: MLPhotoView, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                                //传递参数
                                passProps: {
                                    //出生年月
                                    images: images
                                }
                            });
                        }}>
                            <MLTableCell title={this.state.data.CRFModeule.CRFModeulesName + (this.state.data.CRFModeule.CRFModeulesNum + 1)} rightTitle={rightTitle} rightTitleColor = {TitleColor}/>
                        </TouchableOpacity>
                        <View style={{top:10,height: 170}}>
                            {/* <MLTableCell title={"发送人：" + this.state.data.addUsers.UserNam} isArrow = {false}/> */}
                            <TextInput
                                value={this.state.data.text}
                                editable={false}
                                onChangeText={this.onZhanghao}//获取输入
                                style={{
                                    color:'black',
                                    height: 150,
                                    width:width,
                                    paddingRight:10,
                                    paddingLeft:10,
                                    backgroundColor: 'white',
                                    fontSize: 16,
                                    textAlign:'left',
                                    textAlignVertical:'top',
                                    alignSelf:'flex-start',
                                    justifyContent:'flex-start',
                                    alignItems:'flex-start',
                                }}
                                multiline={true}
                                placeholder={(this.props.replyData != null ? '请输入你的回复...' : '请输入你的质疑...')}
                            />
                        </View>
                        {this.state.data.voiceUrls != '' ? [<View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
                            <Button
                                style={{
                                    width:(width/3)-20,
                                    height:40,
                                    borderColor: 'rgba(0,136,212,1.0)',
                                    backgroundColor: "rgba(0,136,212,1.0)",
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    marginTop:10,
                                    marginLeft:10
                                }}
                                isLoading={this.state.recording}
                                isDisabled={this.state.recording}
                                textStyle={{
                                    color: 'white',
                                    fontSize:15
                                }}
                                onPress={this.play.bind(this)}>
                                播放录音
                            </Button>
                        </View>] : [<View/>]}
                    </ScrollView>
                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择您的操作？"
                        options={buttons}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={(sss)=>{
                            this._handlePress(this)
                            this.upImage(sss,this)
                        }}
                    />
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={'消息'} isBack={true} rightTitle={"回复"} backFunc={() => {
                        Toast.hide();
                        this.props.navigator.pop()
                    }} newFunc={()=>{
                        Toast.hide();
                        this.getLogin()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        Toast.hide();
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }} right2Title={'标记'} right2Func={()=>{
                        this.cellOnLongPress()
                    }}/>
                    <ScrollView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    >
                        <View style={{top:10,height: 170}}>
                            {/* <MLTableCell title={"发送人：" + this.state.data.addUsers.UserNam} isArrow = {false}/> */}
                            <TextInput
                                value={this.state.data.text}
                                editable={false}
                                onChangeText={this.onZhanghao}//获取输入
                                style={{
                                    color:'black',
                                    height: 150,
                                    width:width,
                                    paddingRight:10,
                                    paddingLeft:10,
                                    backgroundColor: 'white',
                                    fontSize: 16,
                                    textAlign:'left',
                                    textAlignVertical:'top',
                                    alignSelf:'flex-start',
                                    justifyContent:'flex-start',
                                    alignItems:'flex-start',
                                }}
                                multiline={true}
                                placeholder={(this.props.replyData != null ? '请输入你的回复...' : '请输入你的质疑...')}
                            />
                        </View>
                        {this.state.data.voiceUrls != '' ? [<View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
                            <Button
                                style={{
                                    width:(width/3)-20,
                                    height:40,
                                    borderColor: 'rgba(0,136,212,1.0)',
                                    backgroundColor: "rgba(0,136,212,1.0)",
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    marginTop:10,
                                    marginLeft:10
                                }}
                                isLoading={this.state.recording}
                                isDisabled={this.state.recording}
                                textStyle={{
                                    color: 'white',
                                    fontSize:15
                                }}
                                onPress={this.play.bind(this)}>
                                播放录音
                            </Button>
                        </View>] : [<View/>]}
                    </ScrollView>
                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择您的操作？"
                        options={buttons}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={(sss)=>{
                            this._handlePress(this)
                            this.upImage(sss,this)
                        }}
                    />
                </View>
            );
        }

    },

    //图片上传
    upImage(sss,self){
        this._handlePress(this)
        if (sss == 1){//点击修改备注
            console.log('点击相机');
            if (Platform.OS != 'ios'){
                console.log('点击安卓拍照');
                ImagePicker1.openCamera({
                    cropping: false,
                    multiple: false
                }).then(image => {
                    console.log('received image', image);
                    Toast.loading('请稍后...',60);

                    /******************/
                    //要上传的空间
                    var keyStr = uuid.v4() + '.png';
                    var putPolicy = new Auth.PutPolicy2(
                        {scope: "nlyy-app:" + keyStr}
                    );
                    var uptoken = putPolicy.token();
                    let formData = new FormData();
                    let file = {uri: image.path, type: 'multipart/form-data', name: keyStr};
                    formData.append('key',keyStr);
                    formData.append('token',uptoken);
                    formData.append("file", file);
                    fetch(Conf.UP_HOST, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            let json = {
                                id: self.state.data.CRFModeule.id,
                                imageUrl: settings.imageUrl + responseJson.key,
                                StudyID: Users.Users[0].StudyID,
                                Subjects: self.state.data.CRFModeule.Subjects,
                                CRFModeulesName: self.state.data.CRFModeule.CRFModeulesName,
                                uploadUserPhone:Users.Users[0].UserMP,
                                uploadName:self.state.data.CRFModeule.CRFModeulesName + (self.state.data.CRFModeule.CRFModeulesNum + 1),
                            }
                            fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(json)
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    Toast.success('添加成功...',1);
                                    self.updateModelData()
                                })
                                .catch((error) => {//错误
                                    Toast.fail('网络连接失败!!!!',1);
                                });
                        })
                        .catch((error) => {
                            Toast.fail('网络连接失败!!!!!',1);
                        });
                }).catch(e => alert(e));
            }else {
                //启动相机：
                options.quality = 0.5;
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
                        Toast.loading('请稍后...',60);
                        let source = { uri: response.uri };
                        console.log('相册 = ', source);

                        // You can also display the image using data:
                        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                        this.setState({
                            avatarSource: source
                        });

                        /******************/
                        //要上传的空间
                        var keyStr = uuid.v4() + '.png';
                        var putPolicy = new Auth.PutPolicy2(
                            {scope: "nlyy-app:" + keyStr}
                        );
                        var uptoken = putPolicy.token();
                        let formData = new FormData();
                        let file = {uri: source.uri, type: 'multipart/form-data', name: keyStr};
                        formData.append('key',keyStr);
                        formData.append('token',uptoken);
                        formData.append("file", file);
                        fetch(Conf.UP_HOST, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                let json = {
                                    id: self.state.data.CRFModeule.id,
                                    imageUrl: settings.imageUrl + responseJson.key,
                                    StudyID: Users.Users[0].StudyID,
                                    Subjects: self.state.data.CRFModeule.Subjects,
                                    CRFModeulesName: self.state.data.CRFModeule.CRFModeulesName,
                                    uploadUserPhone:Users.Users[0].UserMP,
                                    uploadName:self.state.data.CRFModeule.CRFModeulesName + (self.state.data.CRFModeule.CRFModeulesNum + 1),
                                }
                                    console.log("测试111")
                                    console.log(json)
                                fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json; charset=utf-8',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(json)
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        Toast.success('添加成功...',1);
                                        self.updateModelData()
                                    })
                                    .catch((error) => {//错误
                                        Toast.fail('网络连接失败.',1);
                                    });
                            })
                            .catch((error) => {
                                console.log(error)
                                Toast.fail('网络连接失败..',1);
                            });
                    }
                });
            }
        }else if (sss == 2){//点击相册
            if (Platform.OS != 'ios'){
                ImagePicker1.openPicker({
                    cropping: false,
                    multiple: false
                }).then(image => {
                    Toast.loading('请稍后...',60);

                    /******************/
                    //要上传的空间
                    var keyStr = uuid.v4() + '.png';
                    var putPolicy = new Auth.PutPolicy2(
                        {scope: "nlyy-app:" + keyStr}
                    );
                    var uptoken = putPolicy.token();
                    let formData = new FormData();
                    let file = {uri: image.path, type: 'multipart/form-data', name: keyStr};
                    formData.append('key',keyStr);
                    formData.append('token',uptoken);
                    formData.append("file", file);
                    fetch(Conf.UP_HOST, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            let json = {
                                id: self.state.data.CRFModeule.id,
                                imageUrl: settings.imageUrl + responseJson.key,
                                StudyID: Users.Users[0].StudyID,
                                Subjects: self.state.data.CRFModeule.Subjects,
                                CRFModeulesName: self.state.data.CRFModeule.CRFModeulesName,
                                uploadUserPhone:Users.Users[0].UserMP,
                                uploadName:self.state.data.CRFModeule.CRFModeulesName + (self.state.data.CRFModeule.CRFModeulesNum + 1),
                            }
                            fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json; charset=utf-8',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(json)
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    Toast.success('添加成功...',1);
                                    self.updateModelData()
                                })
                                .catch((error) => {//错误
                                    Toast.fail('网络连接失败...',1);
                                });
                        })
                        .catch((error) => {
                            Toast.fail('网络连接失败....',1);
                        });
                })
            }else {
                console.log('点击相册');
                options.quality = 0.5;
                // Open Image Library:
                ImagePicker.launchImageLibrary(options, (response) => {
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
                        Toast.loading('请稍后...', 60);
                        let source = {uri: response.uri};
                        console.log('相册 = ', source);

                        // You can also display the image using data:
                        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                        this.setState({
                            avatarSource: source
                        });


                        /******************/
                        //要上传的空间
                        var keyStr = uuid.v4() + '.png';
                        var putPolicy = new Auth.PutPolicy2(
                            {scope: "nlyy-app:" + keyStr}
                        );
                        var uptoken = putPolicy.token();
                        let formData = new FormData();
                        let file = {uri: source.uri, type: 'multipart/form-data', name: keyStr};
                        formData.append('key',keyStr);
                        formData.append('token',uptoken);
                        formData.append("file", file);
                        fetch(Conf.UP_HOST, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                let json = {
                                    id: self.state.data.CRFModeule.id,
                                    imageUrl: settings.imageUrl + responseJson.key,
                                    StudyID: Users.Users[0].StudyID,
                                    Subjects: self.state.data.CRFModeule.Subjects,
                                    CRFModeulesName: self.state.data.CRFModeule.CRFModeulesName,
                                    uploadUserPhone:Users.Users[0].UserMP,
                                    uploadName:self.state.data.CRFModeule.CRFModeulesName + (self.state.data.CRFModeule.CRFModeulesNum + 1),
                                }
                                console.log("测试2222")
                                console.log(json)
                                fetch(settings.fwqUrl + "/app/getAddImageUrls", {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json; charset=utf-8',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(json)
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        Toast.success('添加成功...', 1);
                                        self.updateModelData()
                                    })
                                    .catch((error) => {//错误
                                        Toast.fail('网络连接失败.....', 1);
                                    });
                            })
                            .catch((error) => {
                                console.log('11122233111error');
                                console.log(error)
                                Toast.fail('网络连接失败!', 1);
                            });
                    }
                });
            }
        }
    },

    //点击回复
    getLogin(){
        // 页面的切换
        this.props.navigator.push({
            component: MLQuestion, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
            //传递参数
            passProps: {
                //出生年月
                replyData: this.state.data,
                data:this.state.data.CRFModeule,
                isReply:true
            }
        });
    },
    // 长按回调
    cellOnLongPress(rowData){
        var array = ["请选择你想做的","已解决","不需要解决","取消标记","取消"];
        Popup.show(
            <View>
                <List renderHeader={this.renderHeader}
                      className="popup-list"
                >
                    {array.map((i, index) => (
                        <List.Item key={index}
                                   style = {{
                                       textAlign:'center'
                                   }}
                                   onClick={()=>{
                                       if (index == array.length - 1 || index == 0){
                                           Popup.hide();
                                           return;
                                       }
                                       
                                       var url = "/app/getMarkType"
                                       Toast.loading('请稍候...',60);
                                    netTool.post(settings.fwqUrl + url,{messageIDNum : this.state.data.messageIDNum , markType : index})
                                    .then((responseJson) => {
                                        DeviceEventEmitter.emit('updateNews');
                                        Toast.hide()
                                        let data = this.state.data
                                        data.markType = index
                                        this.setState({
                                            data : data
                                        })
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            responseJson.msg,
                                            [
                                                {text: '确定'}
                                            ],
                                            {cancelable : false}
                                        )
                                    })
                                    .catch((error)=>{
                                        Toast.hide()
                                        //错误
                                        Alert.alert(
                                            '提示:',
                                            '请检查您的网络111',
                                            [
                                                {text: '确定'}
                                            ]
                                        )
                                    })
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
                                    color:(index == array.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                }}>{i}</Text>
                            </View>
                        </List.Item>
                    ))}
                </List>
            </View>,
            {maskClosable: true,animationType: 'slide-up' }
        )
    },

    // 更新数据
    updateModelData(){
        DeviceEventEmitter.emit('updateNews');
        Toast.loading('请稍后...',60);
        fetch(settings.fwqUrl + "/app/getUserModeulesData", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : this.state.data.CRFModeule.id
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Toast.hide()
                if (responseJson.isSucceed == 400){
                    let data = this.state.data
                    data.CRFModeule = responseJson.data
                    this.setState({
                        data : data
                    })
                }
            })
            .catch((error) => {//错误

            });
    },

    clickModel(){
        var isYijinShenhe = false;
        var shenheStr = "核查无误";
        var isShenhe = false;
        for (var i = 0 ; i < Users.Users.length ;i++){
            if (
                Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" ||
                Users.Users[i].UserFun == "H2" || Users.Users[i].UserFun == "H5" ||
                Users.Users[i].UserFun == "M1" || Users.Users[i].UserFun == "M8" ||
                Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5" ||
                Users.Users[i].UserFun == "M7"

            ){
                isShenhe = true
            }
        }
        for (var j = 0 ; j < this.state.data.CRFModeule.ReviewPhones.length ; j++){
            if (Users.Users[0].UserMP == this.state.data.CRFModeule.ReviewPhones[j]){
                isYijinShenhe = true;
                shenheStr = '撤销核查'
            }
        }
        var gongneng = {
            "查看图片" : {text: '查看图片', onPress: () => {
                var images = [];
                if (this.state.data.CRFModeule.imageUrls.length == 0){
                    Alert.alert(
                        '提示:',
                        '未上传图片',
                        [
                            {text: '确定'}
                        ]
                    )
                    return;
                }
                for (var i= 0 ; i < this.state.data.CRFModeule.imageUrls.length ; i++){
                    var json = {
                        url : this.state.data.CRFModeule.imageUrls[i]
                    }
                    images.push(json)
                }
                var isDelete = false;
                for (var mm = 0 ; mm < Users.Users.length ; mm++){
                    if (Users.Users[mm].UserFun == "H2" || Users.Users[mm].UserFun == "H3" ||
                        Users.Users[mm].UserFun == "H5" || Users.Users[mm].UserFun == "S1"
                    ) {
                        isDelete = true;
                    }
                }
                //图片状态,0:没有上传图片,1:等待审核,2:正在审核,3:审核通过,4:冻结,5:作废,6:质疑中
                if (this.state.data.CRFModeule.imageType == 2 || this.state.data.CRFModeule.imageType == 3 || this.state.data.CRFModeule.imageType == 4){
                    isDelete = false;
                }
                // 页面的切换
                this.props.navigator.push({
                    component: MLPhotoView, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                    //传递参数
                    passProps: {
                        //出生年月
                        images: images,
                        isDelete:isDelete,
                        data:this.state.data.CRFModeule
                    }
                });
            }},
            "查看被质疑的图片" : {text: '查看被质疑的图片', onPress: () => {
                if (this.state.data.CRFModeule.questionImageUrls.length == 0){
                    Alert.alert(
                        '提示:',
                        '未上传图片',
                        [
                            {text: '确定'}
                        ]
                    )
                    return;
                }
                var images = [];
                for (var i= 0 ; i < this.state.data.CRFModeule.questionImageUrls.length ; i++){
                    var json = {
                        url : this.state.data.CRFModeule.questionImageUrls[i]
                    }
                    images.push(json)
                }
                // 页面的切换
                this.props.navigator.push({
                    component: MLPhotoView, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                    //传递参数
                    passProps: {
                        //出生年月
                        images: images
                    }
                });
            }},
            "撤销质疑" : {text: '撤销质疑', onPress:()=>{
                if (this.state.data.CRFModeule.questionImageUrls.length == 0){
                    Alert.alert(
                        '提示:',
                        '没有任何上传内容，不能撤销质疑',
                        [
                            {text: '确定'}
                        ]
                    )
                }else{
                    Toast.loading('请稍后...',60);
                    fetch(settings.fwqUrl + "/app/getRevokedAddQuestion", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id : this.state.data.CRFModeule.id,
                            StudyID : Users.Users[0].StudyID
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.isSucceed == 400) {
                                Toast.success('撤销成功...', 1);
                                this.updateModelData()
                            }else{
                                Toast.fail(responseJson.msg,1);
                            }
                        })
                        .catch((error) => {//错误
                            Toast.fail('网络连接失败!!',1);
                        });
                }
            }},
            "质疑":{text: '质疑', onPress: () => {
                if (this.state.data.CRFModeule.imageUrls.length == 0){
                    Alert.alert(
                        '提示:',
                        '没有任何上传内容，不能质疑',
                        [
                            {text: '确定'}
                        ]
                    )
                }else {
                    // 页面的切换
                    this.props.navigator.push({
                        component: MLQuestion, // 具体路由的版块http://codecloud.b0.upaiyun.com/wp-content/uploads/20160826_57c0288325536.png
                        //传递参数
                        passProps: {
                            //出生年月
                            data: this.state.data.CRFModeule
                        }
                    });
                }
            }},
            "继续上传" : {text: '继续上传', onPress: () => {
                this.show(this)
            }},
            "重新上传" : {text: '重新上传', onPress: () => {
                this.show(this)
            }},
            "重新提交核查" : {text: '重新提交核查', onPress: () => {
                Toast.loading('请稍后...',60);
                fetch(settings.fwqUrl + "/app/getQuestionRevoked", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json; charset=utf-8',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id : this.state.data.CRFModeule.id,
                        StudyID : Users.Users[0].StudyID,
                        Subjects: this.state.data.CRFModeule.Subjects,
                        CRFModeulesName : this.state.data.CRFModeule.CRFModeulesName
                    })
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.isSucceed == 400) {
                            Toast.success('添加成功...', 1);
                            this.updateModelData()
                        }else{
                            Toast.fail(responseJson.msg,1);
                        }
                    })
                    .catch((error) => {//错误
                        Toast.fail('网络连接失败!!!',1);
                    });
            }},
            "shenheStr" : {text: shenheStr, onPress: () => {
                if (this.state.data.CRFModeule.imageUrls.length == 0){
                    Alert.alert(
                        '提示:',
                        '没有任何上传内容，不能核查',
                        [
                            {text: '确定'}
                        ]
                    )
                    return;
                }
                if (isYijinShenhe == false){
                    Toast.loading('请稍后...',60);
                    //审核无误
                    //发送登录网络请求
                    fetch(settings.fwqUrl + "/app/getReviewCorrect", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            StudyID : Users.Users[0].StudyID,
                            Subjects : this.state.data.CRFModeule.Subjects,
                            CRFModeulesName : this.state.data.CRFModeule.CRFModeulesName,
                            id : this.state.data.CRFModeule.id,
                            ReviewPhones:Users.Users[0].UserMP
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            if (responseJson.isSucceed != 400){
                                Toast.hide()
                                //移除等待
                                this.setState({animating:false});
                                Alert.alert(
                                    '提示:',
                                    responseJson.msg,
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }else{
                                Toast.success('核查成功...',1);
                                //ListView设置
                                this.updateModelData()
                            }
                        })
                        .catch((error) => {//错误
                            Toast.hide()
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
                }else{
                    //撤销审核无误
                    //审核无误
                    //发送登录网络请求Toast.hide()
                    Toast.loading('请稍后...',60);
                    fetch(settings.fwqUrl + "/app/getRevokedReviewCorrect", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            StudyID : Users.Users[0].StudyID,
                            Subjects : this.state.data.CRFModeule.Subjects,
                            CRFModeulesName : this.state.data.CRFModeule.CRFModeulesName,
                            id : this.state.data.CRFModeule.id,
                            ReviewPhones:Users.Users[0].UserMP
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            if (responseJson.isSucceed != 400){
                                Toast.hide()
                                //移除等待
                                this.setState({animating:false});
                                Alert.alert(
                                    '提示:',
                                    responseJson.msg,
                                    [
                                        {text: '确定'}
                                    ]
                                )
                            }else{
                                Toast.success('撤销成功...',1);
                                //ListView设置
                                this.updateModelData()
                            }
                        })
                        .catch((error) => {//错误
                            Toast.hide()
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
                }
            }},
        }

        if (this.state.data.CRFModeule.imageType == 0){
            var isShow = false;
            for (var i = 0 ; i < Users.Users.length ; i++){
                if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                    Users.Users[i].UserFun == "H5"){
                    isShow = true;
                }
            }
            if (isShow == true){
                this.show(this)
            }
        }else if (this.state.data.CRFModeule.imageType == 1){
            var isShenhe = false;
            var isYijinShenhe = false;
            var shenheStr = "核查无误";
            var isShow = false;
            for (var i = 0 ; i < Users.Users.length ;i++){
                if (
                    Users.Users[i].UserFun == "M8" || Users.Users[i].UserFun == "M4" ||
                    Users.Users[i].UserFun == "M7"
                ){
                    isShenhe = true
                }
                if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                    Users.Users[i].UserFun == "H5"){
                    isShow = true;
                }
            }
            for (var j = 0 ; j < this.state.data.CRFModeule.ReviewPhones.length ; j++){
                if (Users.Users[0].UserMP == this.state.data.CRFModeule.ReviewPhones[j]){
                    isYijinShenhe = true;
                    shenheStr = '撤销核查'
                }
            }
            if (isShenhe == true){
                var alerts = [
                    gongneng.查看图片,
                    gongneng.shenheStr,
                    {text: '取消'}
                ]
                if (isShow == true){
                    alerts.splice(0, 0, gongneng.继续上传)
                }
                //判断是否显示质疑
                var isShowzhiyi = false;
                for (var i = 0 ; i < Users.Users.length ; i++){
                    if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                        Users.Users[i].UserFun == "M5" || Users.Users[i].UserFun == "M4"){
                        isShowzhiyi = true;
                    }
                }
                if (isShowzhiyi == true){
                    alerts.splice(0, 0, gongneng.质疑);
                }
                //错误
                // Alert.alert(
                //     "提示:",
                //     "选择功能",
                //     alerts
                // )

                this.ssssxxx(alerts,this.state.data.CRFModeule)
            }else{
                var alerts = [
                    gongneng.查看图片,
                    {text: '取消'}
                ]
                if (isShow == true){
                    alerts.splice(0, 0, gongneng.继续上传)
                }
                //判断是否显示质疑
                var isShowzhiyi = false;
                for (var i = 0 ; i < Users.Users.length ; i++){
                    if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                        Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                        isShowzhiyi = true;
                    }
                }
                if (isShowzhiyi == true){
                    alerts.splice(0, 0, gongneng.质疑);
                }
                //错误
                // Alert.alert(
                //     "提示:",
                //     "选择功能",
                //     alerts
                // )

                this.ssssxxx(alerts,this.state.data.CRFModeule)
            }
        }else if (this.state.data.CRFModeule.imageType == 2){//直接查看图片
            console.log('点击正在核查')
            console.log(this.state.data.CRFModeule.ReviewPhones)
            var isShenhe = false;
            var isYijinShenhe = false;
            var shenheStr = "核查无误";
            for (var i = 0 ; i < Users.Users.length ;i++){
                if (Users.Users[i].UserFun == "M8" || Users.Users[i].UserFun == "M4" ||
                    Users.Users[i].UserFun == "M7"){
                    isShenhe = true
                }
            }
            for (var j = 0 ; j < this.state.data.CRFModeule.ReviewPhones.length ; j++){
                if (Users.Users[0].UserMP == this.state.data.CRFModeule.ReviewPhones[j]){
                    isYijinShenhe = true;
                    shenheStr = '撤销核查'
                }
            }
            var alerts = [
                gongneng.查看图片,
                gongneng.shenheStr,
                {text: '取消'}
            ]
            //判断是否显示质疑
            var isShowzhiyi = false;
            for (var i = 0 ; i < Users.Users.length ; i++){
                if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                    Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                    isShowzhiyi = true;
                }
            }
            if (isShowzhiyi == true){
                alerts.splice(0, 0, gongneng.质疑);
            }
            if (isShenhe == true){
                //错误
                this.ssssxxx(alerts,this.state.data.CRFModeule)
            }else{
                var alerts = [
                    gongneng.查看图片,
                    {text: '取消'}
                ]
                //判断是否显示质疑
                var isShowzhiyi = false;
                for (var i = 0 ; i < Users.Users.length ; i++){
                    if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                        Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                        isShowzhiyi = true;
                    }
                }
                if (isShowzhiyi == true){
                    alerts.splice(0, 0, gongneng.质疑);
                }
                //错误
                this.ssssxxx(alerts,this.state.data.CRFModeule)
            }
        }else if (this.state.data.CRFModeule.imageType == 3){//直接查看图片
            var isShenhe = false;
            var isShow = false;
            var isYijinShenhe = false;
            var shenheStr = '';
            var alerts = [
                gongneng.查看图片,
                {text: '取消'}
            ]
            for (var i = 0 ; i < Users.Users.length ;i++){
                if (
                    Users.Users[i].UserFun == "M8" || Users.Users[i].UserFun == "M4" ||
                    Users.Users[i].UserFun == "M7"
                ){
                    isShenhe = true
                }
                if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                    Users.Users[i].UserFun == "H5"){
                    isShow = true;
                }
            }
            for (var j = 0 ; j < this.state.data.CRFModeule.ReviewPhones.length ; j++){
                if (Users.Users[0].UserMP == this.state.data.CRFModeule.ReviewPhones[j]){
                    isYijinShenhe = true;
                    shenheStr = '撤销核查'
                    alerts.splice(0, 0, gongneng.shenheStr)
                }
            }
            //判断是否显示质疑
            var isShowzhiyi = false;
            for (var i = 0 ; i < Users.Users.length ; i++){
                if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                    Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                    isShowzhiyi = true;
                }
            }
            if (isShowzhiyi == true){
                alerts.splice(0, 0, gongneng.质疑);
            }
            this.ssssxxx(alerts,this.state.data.CRFModeule)
        }else if (this.state.data.CRFModeule.imageType == 6){
            var alerts = [
                gongneng.查看图片,
                // gongneng.查看被质疑的图片,
                {text: '取消'}
            ]
            var isShow = false;
            for (var i = 0 ; i < Users.Users.length ;i++){
                if (Users.Users[i].UserFun == "S1" || Users.Users[i].UserFun == "H3" || Users.Users[i].UserFun == "H2" ||
                    Users.Users[i].UserFun == "H5"){
                    isShow = true;
                }
            }
            if (isShow == true){
                // alerts.splice(0, 0, gongneng.重新提交核查);
                alerts.splice(0, 0, gongneng.继续上传)
            }
            var sssxxx = false
            for (var i = 0 ; i < Users.Users.length ; i++){
                if (Users.Users[i].UserFun == "M7" || Users.Users[i].UserFun == "M8" ||
                    Users.Users[i].UserFun == "M4" || Users.Users[i].UserFun == "M5"){
                    sssxxx = true;
                }
            }
            if (sssxxx == true){
                alerts.splice(0, 0, gongneng.撤销质疑);
            }
            this.ssssxxx(alerts,this.state.data.CRFModeule)
        }
    },

    ssssxxx(array,rowData){
        console.log('sssssssss')
        array.splice(0, 0, {text:'请选择功能'});
        Popup.show(
            <View>
                <List renderHeader={this.renderHeader}
                      className="popup-list"
                >
                    {array.map((i, index) => (
                        <List.Item key={index}
                                   style = {{
                                       textAlign:'center'
                                   }}
                                   onClick={()=>{
                                       if (index == array.length - 1 || index == 0){
                                           Popup.hide();
                                           return;
                                       }
                                       Popup.hide();

                                       Toast.loading('请稍后...', 0.5);
                                       this.timer = setTimeout(
                                           () => {
                                               i.onPress(); },
                                           500
                                       );
                                   }}
                        >
                            <View style={{
                                width:width - 30,
                                alignItems:'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{
                                    fontSize:index == 0 ? 12 : 16,
                                    color:(index == array.length - 1 ? 'red' : (index == 0 ? 'gray':'black'))
                                }}>{i.text}</Text>
                            </View>
                        </List.Item>
                    ))}
                </List>
            </View>,
            {maskClosable: true,animationType: 'slide-up' }
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
module.exports = MLLookNews;
