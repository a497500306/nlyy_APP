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
    Modal
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Toast = require('../../node_modules/antd-mobile/lib/toast/index');
import Button from 'apsl-react-native-button';
import ActionSheet from 'react-native-actionsheet';

const buttons = ['取消', '作废', '冻结', '审核通过'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;

const images = [{
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}]

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
        imageUrl : ''
    };

    //属性
    constructor(props){
        super(props);
        this.state = {
            height:0,
            width:0,
            visible:true
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
        Toast.loading('加载图片中...',1160);
        Image.getSize(this.props.imageUrl, (width1, height) => {
            Toast.hide()
            var i = 0 ;
            i = width1/width;
            this.setState({height:height/i})
        });
    }

    //渲染
    render() {
        return(
            <Modal visible={this.state.visible} transparent={true}>
                <ImageViewer imageUrls={images} onClick={()=>{
                    this.setState({
                        visible:false
                    })
                    this.props.navigator.pop()
                }}
                renderHeader = {()=>{
                    return(
                        <View style={{flexDirection:'row',width:width,height:64,backgroundColor:'red'}}>
                            <Button style={{
                                width:60,
                                height:34,
                                marginTop:30,
                                marginLeft:20,
                                // 垂直居中 ---> 设置侧轴的对齐方式
                                alignItems:'center',
                                // 设置主轴的对齐方式
                                justifyContent:'center',
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: 'white',
                                color:'white'
                            }}
                                    textStyle={{
                                        color: 'white',
                                        fontSize:15
                                    }}
                                    onPress={()=>{
                                this.setState({
                                    visible:false
                                })
                                this.props.navigator.pop()
                            }}>
                                {'返 回'}
                            </Button>
                            <Button style={{
                                width:60,
                                height:34,
                                marginTop:30,
                                marginLeft:width - 60 - 20 - 20 - 60,
                                // 垂直居中 ---> 设置侧轴的对齐方式
                                alignItems:'center',
                                // 设置主轴的对齐方式
                                justifyContent:'center',
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: 'white',
                            }}
                                    textStyle={{
                                        color: 'white',
                                        fontSize:15
                                    }}
                                    onPress={()=>this.show(this)}>
                                {'操 作'}
                            </Button>
                        </View>
                    )
                }}
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

                        }else if (sss == 2){//点击查看资料

                        }
                    }}
                />
            </Modal>
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
        )
    };
}

//样式
const styles = StyleSheet.create({

});