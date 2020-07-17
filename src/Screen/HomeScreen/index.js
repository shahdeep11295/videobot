import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableHighlight,
    ScrollView,
} from 'react-native';
import Voice from 'react-native-voice';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import { scale, verticalScale } from '../Scale';

class HomeScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            pitch: '',
            error: '',
            end: '',
            started: '',
            results: [],
            partialResults: [],
            //video
            currentTime: 0,
            data: false,
            val: false,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: false,
            playerState: PLAYER_STATES.PLAYING,
            screenType: 'content',
            video: ''
        }
        //Setting callbacks for the process status
        Voice.onSpeechStart = this.onSpeechStart;
        Voice.onSpeechEnd = this.onSpeechEnd;
        Voice.onSpeechError = this.onSpeechError;
        Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    }

    componentWillUnmount() {
        //destroy the process after switching the screen 
        Voice.destroy().then(Voice.removeAllListeners);
    }

    onSpeechStart = e => {
        //Invoked when .start() is called without error
        console.log('onSpeechStart: ', e);
        this.setState({
            started: '√',
        });
    };

    onSpeechEnd = e => {
        //Invoked when SpeechRecognizer stops recognition
        console.log('onSpeechEnd: ', e);
        if ((this.state.partialResults.toString()).includes("dog") || (this.state.partialResults.toString()).includes("dogs") || (this.state.partialResults.toString()).includes("DOGS") || (this.state.partialResults.toString()).includes("DOG") === true) {
            this.setState({ end: '√',val:false})
        } else if ((this.state.partialResults.toString()).includes("cat") || (this.state.partialResults.toString()).includes("cats") || (this.state.partialResults.toString()).includes("CATS") || (this.state.partialResults.toString()).includes("CAT") === true) {
            this.setState({ end: '√',val:false })
        } else {
            this.setState({ end: '√',val:true })
        }
    };

    onSpeechError = e => {
        //Invoked when an error occurs. 
        console.log('onSpeechError: ', e);
        this.setState({
            error: JSON.stringify(e.error),
        });
    };

    onSpeechResults = e => {
        //Invoked when SpeechRecognizer is finished recognizing
        console.log('onSpeechResults: ', e);
        this.setState({
            results: e.value,
        });
        console.log('value', this.state.results);
    };

    onSpeechPartialResults = e => {
        //Invoked when any results are computed
        console.log('onSpeechPartialResults: ', e);
        this.setState({
            partialResults: e.value,
        });
        console.log('value', this.state.partialResults)
        if ((this.state.partialResults.toString()).includes("dog") || (this.state.partialResults.toString()).includes("dogs") || (this.state.partialResults.toString()).includes("DOGS") || (this.state.partialResults.toString()).includes("DOG") === true) {
            var rVideosdog = [require("../../assets/dogs/dog1.mp4"), require("../../assets/dogs/dog2.mp4"), require("../../assets/dogs/dog3.mp4"), require("../../assets/dogs/dog4.mp4"), require("../../assets/dogs/dog5.mp4"), require("../../assets/dogs/dog6.mp4")]
            var randomIntdog = Math.floor(Math.random() * rVideosdog.length)
            var rvideodog = rVideosdog[randomIntdog]
            this.setState({ video: rvideodog, data: true })
        } else if ((this.state.partialResults.toString()).includes("cat") || (this.state.partialResults.toString()).includes("cats") || (this.state.partialResults.toString()).includes("CATS") || (this.state.partialResults.toString()).includes("CAT") === true) {
            var rVideoscat = [require("../../assets/cats/cat2.mp4"), require("../../assets/cats/cat3.mp4"), require("../../assets/cats/cat4.mp4"), require("../../assets/cats/cat5.mp4")]
            var randomIntcat = Math.floor(Math.random() * rVideoscat.length)
            var rvideocat = rVideoscat[randomIntcat]
            this.setState({ video: rvideocat, data: true })
        } else {
            this.setState({ data: false, isLoading: false })
        }
    };

    onSpeechVolumeChanged = e => {
        //Invoked when pitch that is recognized changed
        console.log('onSpeechVolumeChanged: ', e);
        this.setState({
            pitch: e.value,
        });
    };

    _startRecognizing = async () => {
        //Starts listening for speech for a specific locale
        this.setState({
            pitch: '',
            error: '',
            end: '',
            started: '',
            results: [],
            partialResults: [],
            //video
            currentTime: 0,
            data: false,
            val: false,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: false,
            playerState: PLAYER_STATES.PLAYING,
            screenType: 'content',
            video: ''
        });

        try {
            await Voice.start('en-US');
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        //Stops listening for speech
        try {
            await Voice.stop();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        //Cancels the speech recognition
        try {
            await Voice.cancel();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _destroyRecognizer = async () => {
        //Destroys the current SpeechRecognizer instance
        try {
            await Voice.destroy();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
        this.setState({
            pitch: '',
            error: '',
            end: '',
            started: '',
            results: [],
            partialResults: [],
            //video
            currentTime: 0,
            data: false,
            val: false,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: false,
            playerState: PLAYER_STATES.PLAYING,
            screenType: 'content',
            video: ''
        });
    };

    //video functions
    onSeek = seek => {
        //Handler for change in seekbar
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        //Handler for Video Pause
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    };

    onReplay = () => {
        //Handler for Replay
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };

    onLoad = data => this.setState({ duration: data.duration, isLoading: false });

    onLoadStart = data => this.setState({ isLoading: true });

    onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });

    onError = () => alert('Oh! ', error);

    exitFullScreen = () => {
        alert('Exit full screen');
    };

    enterFullScreen = () => { };

    onFullScreen = () => {
        if (this.state.screenType == 'cover')
            this.setState({ screenType: 'cover' });
        else this.setState({ screenType: 'cover' });
    };
    renderToolbar = () => (
        <View>
            <Text> toolbar </Text>
        </View>
    );
    onSeeking = currentTime => this.setState({ currentTime });

    render() {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={styles.container}>
                    {this.state.data ?
                        <View style={{ marginTop: verticalScale(20), width: scale(322), height: scale(200), justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                            <Video
                                onEnd={this.onEnd}
                                onLoad={this.onLoad}
                                onLoadStart={this.onLoadStart}
                                onProgress={this.onProgress}
                                paused={this.state.paused}
                                ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                resizeMode="cover"
                                onFullScreen={this.state.isFullScreen}
                                source={this.state.video}
                                style={styles.mediaPlayer}
                                volume={100}
                            />
                            <View style={styles.mediaPlayer}>
                                <MediaControls
                                    duration={this.state.duration}
                                    isLoading={this.state.isLoading}
                                    mainColor="#333"
                                    isFullScreen={true}
                                    onFullScreen={this.onFullScreen}
                                    onPaused={this.onPaused}
                                    onReplay={this.onReplay}
                                    onSeek={this.onSeek}
                                    onSeeking={this.onSeeking}
                                    playerState={this.state.playerState}
                                    progress={this.state.currentTime}
                                /></View>
                        </View>
                        :
                        <View style={{ marginTop: verticalScale(20), width: scale(322), height: scale(200), justifyContent: "center", alignItems: "center", backgroundColor: "red", flexDirection: "row", borderRadius: 10 }}>
                            <Image
                                style={{ width: scale(100), height: scale(100), }}
                                source={require("../../assets/icon.png")}
                                resizeMode='stretch'
                            />
                            {this.state.val ?
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        fontSize: scale(20)
                                    }}>please try again</Text>
                                : null}
                        </View>
                    }

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: verticalScale(10),
                            marginTop:verticalScale(20)
                        }}>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                color: '#B0171F',
                            }}>{`Started: ${this.state.started}`}</Text>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                color: '#B0171F',
                            }}>{`End: ${this.state.end}`}</Text>
                    </View>
                    <TouchableHighlight
                        onPress={this._startRecognizing}
                        style={{ marginVertical: verticalScale(50), borderRadius: 400 }}>
                        <Image
                            style={styles.button}
                            source={require("../../assets/microphone.png")}
                        />
                    </TouchableHighlight>
                    <Text style={styles.instructions}>
                        Tap on mike
          </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#B0171F',
                            marginBottom: 1,
                            fontSize: scale(20),
                            fontWeight: '700',
                        }}>
                        Result
          </Text>
                    <ScrollView>
                        {this.state.partialResults.map((result, index) => {
                            return (
                                <Text
                                    key={`partial-result-${index}`}
                                    style={{
                                        textAlign: 'center',
                                        color: '#B0171F',
                                        fontSize: scale(20),
                                        marginBottom: 1,
                                        fontWeight: '700',
                                    }}>
                                    {result}
                                </Text>
                            );
                        })}
                    </ScrollView>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'space-between',
                            position: 'absolute',
                            backgroundColor: 'red',
                            bottom: 0,
                        }}>

                        <TouchableHighlight
                            onPress={this._stopRecognizing}
                            style={{ flex: 1, backgroundColor: 'red', marginLeft: scale(35) }}>
                            <View style={{ flexDirection: "row", }}>
                                <Image
                                    style={styles.button2}
                                    source={require("../../assets/stop.png")}
                                />
                                <Text style={styles.action}>Stop</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={this._cancelRecognizing}
                            style={{ flex: 1, backgroundColor: 'red', }}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    style={styles.button2}
                                    source={require("../../assets/cancel.png")}
                                />
                                <Text style={styles.action}>Cancel</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={this._destroyRecognizer}
                            style={{ flex: 1, backgroundColor: 'red', }}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    style={styles.button2}
                                    source={require("../../assets/trash.png")}
                                />
                                <Text style={styles.action}>Destroy</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: scale(50),
        height: scale(50),
    },
    button2: {
        width: scale(20),
        height: scale(20),
        alignSelf: "center"
    },
    toolbar: {
        marginTop: verticalScale(30),
        backgroundColor: 'white',
        padding: scale(10),
        borderRadius: 5,
    },
    mediaPlayer: {
        position: 'absolute',
        width: scale(322),
        height: scale(200),
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: scale(20),
        textAlign: 'center',
        margin: scale(10),
    },
    action: {
        width: '100%',
        marginLeft: scale(10),
        color: 'white',
        paddingVertical: verticalScale(8),
        marginVertical: verticalScale(5),
        fontWeight: 'bold',
    },
    instructions: {
        textAlign: 'center',
        fontSize: scale(15),
        color: '#333333',
        marginBottom: verticalScale(5),
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
        marginTop: verticalScale(30),
    },
});
export default HomeScreen;