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
    DeviceEventEmitter,
    AsyncStorage
} from 'react-native';
var settings = require('../../../settings');
var Users = require('../../../entity/Users');
var MLNavigatorBar = require('../../MLNavigatorBar/MLNavigatorBar');
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
var MLMoban = require('../../消息中心/模板/MLMoban')

import MLPhotoView from '../../MLPhotoView/MLPhotoView';

var MLQuestion = React.createClass({

    componentWillUnmount(){
        this.subscription.remove();
        this.subscription1.remove();
    },
    getDefaultProps(){
        return {
            data:null,
            name:'',
            replyData:null,
            isReply:false
        }
    },
    getInitialState() {

        var tableData = [];
        tableData = [0,1,2]

        //ListView设置
        var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        return {
            //ListView设置
            dataSource: ds.cloneWithRows(tableData),
            currentTime: 0.0,                                                   //开始录音到现在的持续时间
            recording: false,                                                   //是否正在录音
            stoppedRecording: false,                                            //是否停止了录音
            finished: false,                                                    //是否完成录音
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',          //路径下的文件名
            hasPermission: undefined,
            zhanghao:'',//输入的文字,
            isPlaying:false,
            moban:[],
            text:'',
            replyData:null
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

        console.log('调用了权限获取')
            const rationale = {
                'title': '获取录音权限',
                'message': '正请求获取麦克风权限用于录音,是否准许'
            };
            return PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
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
        // 使用 setTimeout 是因为, 为避免发生一些问题 react-native-sound中
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    Toast.hide();
                    Toast.fail('播放失败');
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                        Toast.hide()
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
    componentDidMount () {
        // 页面加载完成后获取权限
        this.checkPermission().then((hasPermission) => {
            this.setState({ 
                hasPermission ,
                replyData : this.props.replyData
            });

            //如果未授权, 则执行下面的代码
            if (!hasPermission) return;
            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                if (Platform.OS === 'ios') {
                    this.finishRecording(data.status === "OK", data.audioFileURL);
                }
            };

        })
        this.subscription = DeviceEventEmitter.addListener('updateMoban',this.updateMoban);
        this.subscription1 = DeviceEventEmitter.addListener('selectMoban',this.selectMoban);
        var self = this;
        AsyncStorage.getItem(Users.Users[0].UserMP,function (err, result) {
            console.log('321321')
            var dataJson = JSON.parse(result);
            if (result != null){
                self.setState({
                    moban:dataJson.data
                })
            }
        })

        // console.log(this.props.navigator)
        // console.log(audioPath)
    },
    //选择模板
    selectMoban(data){
        console.log('收到通知')
        console.log(data)
        this.setState({
            text:data,
            zhanghao:data
        })
    },
    updateMoban(){
        var self = this;
        AsyncStorage.getItem(Users.Users[0].UserMP,function (err, result) {
            console.log('321321')
            var dataJson = JSON.parse(result);
            if (result != null){
                self.setState({
                    moban:dataJson.data
                })
            }
        })
    },
    render() {
        if (this.props.data != null){
            var rightTitle = '';
            var TitleColor = ''
            if (this.props.data.imageType == 0){
                rightTitle = '点击上传图片';
                TitleColor = 'red';
            }else if (this.props.data.imageType == 1){
                rightTitle = '等待核查(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.props.data.imageType == 2){
                rightTitle = '正在审核(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.props.data.imageType == 3){
                rightTitle = '冻结(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.imageType == 6){
                rightTitle = '质疑处理中(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.imageType == 4){
                rightTitle = '质疑处理中(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.imageType == 5){
                rightTitle = '质疑处理中(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'black';
            }
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={(this.state.replyData != null ? '回复' : '质疑')} isBack={true} rightTitle={"发送"} backFunc={() => {
                        Toast.hide();
                        this.props.navigator.pop()
                    }} newFunc={()=>{
                        Toast.hide();
                        this.getLogin()
                    }} leftTitle={'首页'} leftFunc={()=>{
                        Toast.hide();
                        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
                    }}/>
                    {/*<WingBlank size="lg"style={{paddingTop: 20}}>*/}
                    {/*<WhiteSpace size="md" />*/}
                    {/*<Button type="primary" size="large" onClick={this.record}>录音</Button>*/}
                    {/*<WhiteSpace size="md" />*/}
                    {/*<Button type="primary" size="large" onClick={this.stop}>停止录音</Button>*/}
                    {/*<WhiteSpace size="md" />*/}
                    {/*<Button type="primary" size="large" onClick={this.pause}>暂停录音</Button>*/}
                    {/*<WhiteSpace size="md" />*/}
                    {/*<Button type="primary" size="large" onClick={this.play}>播放录音</Button>*/}
                    {/*</WingBlank>*/}
                    <ScrollView
                        dataSource={this.state.dataSource}//数据源
                        renderRow={this.renderRow}
                    >
                        <TouchableOpacity onPress={()=> {
                            var images = [];
                            for (var i= 0 ; i < this.props.data.imageUrls.length ; i++){
                                var json = {
                                    url : this.props.data.imageUrls[i]
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
                            <MLTableCell title={this.props.data.CRFModeulesName + (this.props.data.CRFModeulesNum + 1)} rightTitle={rightTitle} rightTitleColor = {TitleColor}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            paddingTop:10
                        }} onPress={()=> {
                            // 页面的切换
                            this.props.navigator.push({
                                component: MLMoban,
                            });
                        }}>
                            <MLTableCell title={'快捷模板'} rightTitle={this.state.moban.length} rightTitleColor = {'gray'}/>
                        </TouchableOpacity>
                        <View style={{height: 170}}>
                            <TextInput
                                onChangeText={this.onZhanghao}//获取输入
                                style={{
                                    height: 150,
                                    width:width,
                                    paddingRight:10,
                                    paddingLeft:10,
                                    backgroundColor: 'white',
                                    fontSize: 16,
                                    color:'black',
                                    textAlign:'left',
                                    textAlignVertical:'top',
                                    alignSelf:'flex-start',
                                    justifyContent:'flex-start',
                                    alignItems:'flex-start',
                                }}
                                multiline={true}
                                placeholder={'请输入你的质疑...'}
                                defaultValue={this.state.text}
                            />
                        </View>
                        <View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
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
                                onPress={this.record.bind(this)}>
                                开始录音
                            </Button>
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
                                isDisabled={!this.state.recording}
                                textStyle={{
                                    color: 'white',
                                    fontSize:15
                                }}
                                onPress={this.stop.bind(this)}>
                                结束录音
                            </Button>
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
                                isDisabled={!this.state.stoppedRecording}
                                isLoading={this.state.isPlaying}
                                textStyle={{
                                    color: 'white',
                                    fontSize:15
                                }}
                                onPress={this.play.bind(this)}>
                                播放录音
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            );
        }else {
            return (
                <View style={styles.container}>
                    <MLNavigatorBar title={(this.state.replyData != null ? '回复' : '质疑')} isBack={true} rightTitle={"发送"} backFunc={() => {
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
                        <TouchableOpacity style={{
                            paddingTop:10
                        }} onPress={()=> {
                            // 页面的切换
                            this.props.navigator.push({
                                component: MLMoban,
                            });
                        }}>
                            <MLTableCell title={'快捷模板'} rightTitle={this.state.moban.length} rightTitleColor = {'gray'}/>
                        </TouchableOpacity>
                        <View style={{height: 170}}>
                            <TextInput
                                onChangeText={this.onZhanghao}//获取输入
                                style={{
                                    height: 150,
                                    width:width,
                                    paddingRight:10,
                                    paddingLeft:10,
                                    backgroundColor: 'white',
                                    fontSize: 16,
                                    color:'black',
                                    textAlign:'left',
                                    textAlignVertical:'top',
                                    alignSelf:'flex-start',
                                    justifyContent:'flex-start',
                                    alignItems:'flex-start',
                                }}
                                multiline={true}
                                placeholder={'请输入你的质疑...'}
                                defaultValue={this.state.text}
                            />
                        </View>
                        <View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
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
                                onPress={this.record.bind(this)}>
                                开始录音
                            </Button>
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
                                isDisabled={!this.state.recording}
                                textStyle={{
                                    color: 'white',
                                    fontSize:15
                                }}
                                onPress={this.stop.bind(this)}>
                                结束录音
                            </Button>
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
                                isDisabled={!this.state.stoppedRecording}
                                isLoading={this.state.isPlaying}
                                textStyle={{
                                    color: 'white',
                                    fontSize:15
                                }}
                                onPress={this.play.bind(this)}>
                                播放录音
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    },
    //返回具体的cell
    renderRow(rowData){
        if (rowData == 0){
            var rightTitle = '';
            var TitleColor = ''
            if (this.props.data.imageType == 0){
                rightTitle = '点击上传图片';
                TitleColor = 'red';
            }else if (this.props.data.imageType == 1){
                rightTitle = '等待核查(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.props.data.imageType == 2){
                rightTitle = '正在审核(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'gray';
            }else if (this.props.data.imageType == 3){
                rightTitle = '冻结(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.imageType == 6){
                rightTitle = '质疑处理中(' + this.props.data.imageUrls.length + ')';
                TitleColor = 'black';
            }else if (this.props.data.imageType == 4){
                return (<View/>)
            }else if (this.props.data.imageType == 5){
                return (<View/>)
            }
            return (
                <TouchableOpacity onPress={()=> {
                    var images = [];
                    for (var i= 0 ; i < this.props.data.imageUrls.length ; i++){
                        var json = {
                            url : this.props.data.imageUrls[i]
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
                <MLTableCell title={this.props.data.CRFModeulesName + (this.props.data.CRFModeulesNum + 1)} rightTitle={rightTitle} rightTitleColor = {TitleColor}/>
                </TouchableOpacity>
            )
        }else if (rowData == 1){
            return (
                <View style={{top:10,height: 120}}>
                    <TextInput
                        onChangeText={this.onZhanghao}//获取输入
                        style={{
                            height: 100,
                            width:width,
                            paddingRight:10,
                            paddingLeft:10,
                            backgroundColor: 'white',
                            fontSize: 16,
                            color:'black',
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
            )
        }else if (rowData == 2){
            return (
                <View style={{height: 70,width:width,flexDirection:'row',justifyContent:'center'}}>
                    <Button
                        style={{
                            width:(width/2)-20,
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
                        onPress={this.record.bind(this)}>
                        开始录音
                    </Button>
                    <Button
                        style={{
                            width:(width/2)-20,
                            height:40,
                            borderColor: 'rgba(0,136,212,1.0)',
                            backgroundColor: "rgba(0,136,212,1.0)",
                            borderRadius: 5,
                            borderWidth: 1,
                            marginTop:10,
                            marginLeft:10
                        }}
                        isDisabled={!this.state.recording}
                        textStyle={{
                            color: 'white',
                            fontSize:15
                        }}
                        onPress={this.stop.bind(this)}>
                        结束录音
                    </Button>
                </View>
            )
        }
    },
    //确定
    getLogin(){
        console.log('发送')
        console.log(this.state.replyData)
        if (this.state.zhanghao.length == 0 && this.state.finished == false){
            //错误
            Alert.alert(
                "提示:",
                "请输入任何语音或文字",
                [
                    {text: '确定'},
                ])
            return;
        }
        Toast.loading('请稍后...',60);
        if (this.state.finished == true) {
            let formData = new FormData();
            console.log('321321321')
            let file = {
                uri: Platform.OS == "ios" ? this.state.audioPath : ("file://" + this.state.audioPath),
                type: 'multipart/form-data',
                name: 'test.aac'
            };
            formData.append("voice", file);
            fetch(settings.fwqUrl + "/app/voiceUpdata", {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    fetch(settings.fwqUrl + "/app/getAddQuestion", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "StudyID": Users.Users[0].StudyID,    //研究编号
                            "addUsers": Users.Users[0], //添加这条数据的医生
                            "Users": (this.state.replyData != null ? this.state.replyData.addUsers : this.props.data.Users), //质疑的医生
                            "CRFModeule": this.props.data,//研究数据
                            "voiceUrls": responseJson.url,//语音路径
                            "text": this.state.zhanghao,//内容
                            "isReply" : this.props.isReply,
                            "GroupUsers" : (this.state.replyData != null ? this.state.replyData.GroupUsers : null),
                            "messageIDNum" : (this.state.replyData != null ? this.state.replyData.messageIDNum : null),
                            "markType" : (this.state.replyData != null ? this.state.replyData.markType : null),
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            Toast.hide();
                            if (responseJson.isSucceed != 400) {
                                //错误
                                Alert.alert(
                                    "提示:",
                                    responseJson.msg,
                                    [
                                        {
                                            text: '确定', onPress: () => {

                                        }
                                        },
                                    ])
                                return;
                            }
                            DeviceEventEmitter.emit('updateMoKuai');
                            //错误
                            Alert.alert(
                                "提示:",
                                "发送成功",
                                [
                                    {
                                        text: '确定', onPress: () => {
                                        this.props.navigator.pop()
                                    }
                                    },
                                ])
                            return;
                        })
                        .catch((error) => {//错误
                            Toast.fail('网络连接失败1...', 2);
                        });
                }).catch((error) => {
                console.log('错误是');
                console.log(error);
                Toast.fail('网络连接失败2...', 2);
            });
        }else{
            fetch(settings.fwqUrl + "/app/getAddQuestion", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "StudyID": Users.Users[0].StudyID,    //研究编号
                    "addUsers": Users.Users[0], //添加这条数据的医生
                    "Users": (this.state.replyData != null ? this.state.replyData.addUsers : this.props.data.Users), //质疑的医生
                    "CRFModeule": this.props.data,//研究数据
                    "voiceUrls": '',//语音路径
                    "text": this.state.zhanghao,//内容
                    "isReply" : this.props.isReply,
                    "GroupUsers" : (this.state.replyData != null ? this.state.replyData.GroupUsers : null),
                    "messageIDNum" : (this.state.replyData != null ? this.state.replyData.messageIDNum : null),
                    "markType" : (this.state.replyData != null ? this.state.replyData.markType : null),
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    Toast.hide();
                    if (responseJson.isSucceed != 400) {
                        //错误
                        Alert.alert(
                            "提示:",
                            responseJson.msg,
                            [
                                {
                                    text: '确定', onPress: () => {

                                }
                                },
                            ])
                        return;
                    }
                    DeviceEventEmitter.emit('updateMoKuai');
                    //错误
                    Alert.alert(
                        "提示:",
                        "发送成功",
                        [
                            {
                                text: '确定', onPress: () => {
                                this.props.navigator.pop()
                            }
                            },
                        ])
                    return;
                })
                .catch((error) => {//错误
                    Toast.fail('网络连接失败3...', 2);
                });
        }
    },
    //输入账号时
    onZhanghao(text){
        this.setState({zhanghao: text});
    },
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
module.exports = MLQuestion;