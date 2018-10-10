import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
    PanResponder,
    Animated,
    Modal,
    DeviceEventEmitter,
    ActivityIndicator,
    Alert
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
// var ImageViewer1 = require('../../react-native-image-zoom-viewer1/index');
var settings = require('../../settings');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Users = require('../../entity/Users');
import Button from 'apsl-react-native-button';
import ActionSheet from 'react-native-actionsheet';
var Toast = require('../../node_modules/antd-mobile/lib/toast/index');

const buttons = ['取消', '作废(删除)', '返回'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;

const images = [{
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}]

var imageUrl = null

export default class MLPhotoView extends Component {
    show() {
        this.ActionSheet.show();
    }
    _handlePress(index) {
    }
    // 缩放大小
    // private scale = 1
    // private animatedScale = new Animated.Value(1)
    // private zoomLastDistance = null
    // private zoomCurrentDistance = 0
    //传入值
    static defaultProps = {
        images : [],
        isDelete:false,
        data:null
    };

    //属性
    constructor(props){
        super(props);
        this.state = {
            height:0,
            width:0,
            visible:true,
            images:this.props.images
        }
    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: ()=> true,
            onPanResponderGrant: ()=>{
                console.log('onPanResponderGrant')
            },
            onPanResponderMove: (evt,gs)=>{
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    // 单指移动 or 翻页
                } else {
                    // 找最小的 x 和最大的 x
                    let minX = 0
                    let maxX = 0
                    if (evt.nativeEvent.changedTouches[0].locationX > evt.nativeEvent.changedTouches[1].locationX) {
                        minX = evt.nativeEvent.changedTouches[1].pageX
                        maxX = evt.nativeEvent.changedTouches[0].pageX
                    } else {
                        minX = evt.nativeEvent.changedTouches[0].pageX
                        maxX = evt.nativeEvent.changedTouches[1].pageX
                    }

                    let minY = 0
                    let maxY = 0
                    if (evt.nativeEvent.changedTouches[0].locationY > evt.nativeEvent.changedTouches[1].locationY) {
                        minY = evt.nativeEvent.changedTouches[1].pageY
                        maxY = evt.nativeEvent.changedTouches[0].pageY
                    } else {
                        minY = evt.nativeEvent.changedTouches[0].pageY
                        maxY = evt.nativeEvent.changedTouches[1].pageY
                    }

                    const widthDistance = maxX - minX
                    const heightDistance = maxY - minY
                    const diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance)
                    console.log('minX:' + minX + 'maxX:' + maxX + 'minY:' + minY + 'maxY' + maxY)
                    console.log('diagonalDistance' + diagonalDistance)
                }
            },
            onPanResponderRelease: (evt,gs)=>{

                console.log('onPanResponderRelease,evt')
            }
        })
    }

    //耗时操作,网络请求
    componentDidMount(){
        // Image.getSize(this.props.images, (width1, height) => {
        //     Toast.hide()
        //     var i = 0 ;
        //     i = width1/width;
        //     this.setState({height:height/i})
        // });
        if (this.state.images.length == 0) {
            //错误
            Alert.alert(
                '提示:',
                '没有发现任何图片',
                [
                    {
                        text: '确定', onPress: () => {
                        this.setState({
                            visible: false
                        })

                        this.props.navigator.pop()
                    }
                    }
                ]
            )
        }
    }

    //渲染
    render() {
        console.log('图片地址')
        console.log(this.state.images)
        if (this.state.images.length == 0){
            return(
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,1.0)',
                }}/>
                    );
        }else{
            return(
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,1.0)',
                }}>
                    <Modal visible={this.state.visible} transparent={true} onRequestClose={() => {}}>
                        <ImageViewer
                            saveToLocalByLongPress={false}
                            imageUrls={this.state.images}
                            onClick={(data,url)=>{
                                if (this.props.isDelete == true ){
                                    this.show(this)
                                }else{
                                    this.setState({
                                        visible:false
                                    })

                                    this.props.navigator.pop()
                                }
                            }}
                            loadingRender={()=>{
                                return([
                                    <View>
                                        <ActivityIndicator
                                            animating={this.state.animating}
                                            style={[styles.centering, {height: 30}]}
                                            size="small"
                                            color="white"
                                        />
                                    </View>
                                ])
                            }}
                            onChange={(index)=>{
                                console.log('滑动时触发')
                                imageUrl = this.state.images[index].url
                            }}/>
                        <ActionSheet
                            ref={(o) => this.ActionSheet = o}
                            title="选择您的操作？"
                            options={buttons}
                            cancelButtonIndex={CANCEL_INDEX}
                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                            onPress={(sss)=>{
                                this._handlePress(this)

                                if (sss == 1){//点击删除
                                    this.setState({
                                        visible:false
                                    })
                                    var imageU = (imageUrl == null ? this.state.images[0].url : imageUrl)
                                    console.log('删除的图片地址');
                                    console.log(imageU)
                                    fetch(settings.fwqUrl + "/app/getDeleteImageUrls", {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json; charset=utf-8',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            StudyID : Users.Users[0].StudyID,
                                            dataID : this.props.data.id,
                                            imageUrl : imageU
                                        })
                                    })
                                        .then((response) => response.json())
                                        .then((responseJson) => {
                                            if (responseJson.isSucceed == 400){
                                                var images = this.state.images;
                                                var index = 0;
                                                for (var i = 0; i < images.length; i++) {
                                                    if (images[i].url == imageU){
                                                        index = i;
                                                    }
                                                }
                                                images.splice(index, 1);
                                                imageUrl = null
                                                DeviceEventEmitter.emit('updateMoKuai');
                                                if (images.length == 0) {
                                                    this.setState({
                                                        visible:false
                                                    })

                                                    this.props.navigator.pop();
                                                    return;
                                                }
                                                this.setState({
                                                    images:images,
                                                    visible:true
                                                })
                                            }else{
                                                Alert.alert(
                                                    '提示:',
                                                    responseJson.msg,
                                                    [
                                                        {text: '确定'}
                                                    ]
                                                )
                                                return;
                                            }
                                        })
                                        .catch((error) => {//错误
                                            if (images.length == 0) {
                                                imageUrl = null
                                                DeviceEventEmitter.emit('updateMoKuai');
                                                this.setState({
                                                    visible:false
                                                })

                                                this.props.navigator.pop();
                                                return;
                                            }
                                            Toast.fail('网络连接失败...',2);
                                        });
                                }else if (sss == 2){//点击退出
                                    this.setState({
                                        visible:false
                                    })

                                    this.props.navigator.pop()
                                }
                            }}
                        />
                    </Modal>
                </View>
            )
        }

            /*
            <View backgroundColor={'black'} style={{flex: 1}}>
                <ScrollView style={{
                    width:width ,
                    height:height,
                }}>
                    <Image style={{width:width , height:this.state.height,"top": (height - this.state.height)/2,}} source={[
                        {uri: this.props.imageUrl, width: width, height: this.state.height}]}
                           {...this._panResponder.panHandlers}
                    />
                </ScrollView>
            </View>
            */
    };
}

//样式
const styles = StyleSheet.create({

});