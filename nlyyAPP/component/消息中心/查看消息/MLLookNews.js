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
var settings = require('../../../settings');
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
var MLQuestion = require('../../图片管理模块/质疑/MLQuestion');
var MLTableCell = require('../../MLTableCell/MLTableCell');
var researchParameter = require('../../../entity/researchParameter')
var Toast = require('../../../node_modules/antd-mobile/lib/toast/index');
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

import MLPhotoView from '../../MLPhotoView/MLPhotoView';

var MLLookNews = React.createClass({
    componentDidMount(){
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
    getInitialState() {
        return {
            currentTime: 0.0,                                                   //开始录音到现在的持续时间
            recording: false,                                                   //是否正在录音
            stoppedRecording: false,                                            //是否停止了录音
            finished: false,                                                    //是否完成录音
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',          //路径下的文件名
            hasPermission: undefined,
            zhanghao:'',//输入的文字'
            isPlaying:false
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
        console.log(this.props.data.voiceUrls)
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
        console.log(this.props.data);
        if (this.props.data.CRFModeule != null){
            var rightTitle = '';
            var TitleColor = ''
            if (this.props.data.CRFModeule.imageType == 0){
                rightTitle = '点击上传图片';
                TitleColor = 'red';
            }else if (this.props.data.CRFModeule.imageType == 1){
                rightTitle = '等待核查(' + this.props.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.props.data.CRFModeule.imageType == 2){
                rightTitle = '正在审核(' + this.props.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.props.data.CRFModeule.imageType == 3){
                rightTitle = '冻结(' + this.props.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.CRFModeule.imageType == 6){
                rightTitle = '质疑处理中(' + this.props.data.CRFModeule.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.CRFModeule.imageType == 4){
                return (<View/>)
            }else if (this.props.data.CRFModeule.imageType == 5){
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
                    }}/>
                    <ScrollView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    >
                        <TouchableOpacity onPress={()=> {
                            if (this.props.data.CRFModeule.imageUrls.length == 0){
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
                            for (var i= 0 ; i < this.props.data.CRFModeule.imageUrls.length ; i++){
                                var json = {
                                    url : this.props.data.CRFModeule.imageUrls[i]
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
                            <MLTableCell title={this.props.data.CRFModeule.CRFModeulesName + (this.props.data.CRFModeule.CRFModeulesNum + 1)} rightTitle={rightTitle} rightTitleColor = {TitleColor}/>
                        </TouchableOpacity>
                        <View style={{top:10,height: 170}}>
                            <TextInput
                                value={this.props.data.text}
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
                                placeholder={'请输入你的质疑...'}
                            />
                        </View>
                        {this.props.data.voiceUrls != '' ? [<View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
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
                    }}/>
                    <ScrollView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    >
                        <View style={{top:10,height: 170}}>
                            <TextInput
                                value={this.props.data.text}
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
                                placeholder={'请输入你的质疑...'}
                            />
                        </View>
                        {this.props.data.voiceUrls != '' ? [<View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
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
                </View>
            );
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
                replyData: this.props.data,
                data:this.props.data.CRFModeule,
                isReply:true
            }
        });
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
