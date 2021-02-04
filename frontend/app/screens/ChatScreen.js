import React from 'react';
import { connect } from 'react-redux';
import dayjs from "dayjs";

import { io } from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text, KeyboardAvoidingView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import * as RootNavigation from '../../routes';
import { Platform } from 'react-native';

import { conversationService } from "../services/conversation-service";
import { updateConversation } from '../actions/auth-action';


class ChatScreen extends React.Component {
    state = {
        msgs: [],
        msg: "",
        user: this.props.auth.user,
        conversations: this.props.auth.conversations,
        reciepient: this.props.route.params.data,
        conversationID: ""
    }
    componentDidMount() {
        let msgs = [];
        let doesExist = false;
        let conversationID = "";

        if (this.state.conversations && this.state.conversations.length > 0) {


            for (let i = 0; i < this.state.conversations.length; i++) {
                const firstUserCheck = this.state.conversations[i].users["0"] === this.state.user._id || this.state.conversations[i].users["1"] === this.state.user._id;
                const secondUserCheck = this.state.conversations[i].users["0"] === this.state.reciepient._id || this.state.conversations[i].users["1"] === this.state.reciepient._id;

                if (firstUserCheck && secondUserCheck) {

                    msgs = this.state.conversations[i].messages;
                    conversationID = this.state.conversations[i]._id
                    doesExist = true;
                }

            }
        }

       // console.log(doesExist);

       // console.log(msgs);
        // for (let i = 0; i < msgs.length; ++i) {
        //     if (this.props.route.params.data._id === msgs[i].user._id) {
        //         msgs[i].user.avatar = this.props.route.params.data.images[0];
        //     }
        // }

        if (!doesExist) {
            const users = {
                "0": this.state.user._id,
                "1": this.state.reciepient._id
            }
            conversationService.createConv(users)
                .then((response) => console.log(response))
        }

        const socket = io("http://localhost:8080");
        socket.on("connect", () => {
            console.log("connected");
            this.setState({ socket, msgs, conversationID }, () => {
                this.state.socket.on("from server", (msg => {

                    this.receiveMsg(msg);

                }))
            })
        })

    }

    receiveMsg = (receivedMsgs = []) => {
        for (let i = 0; i < this.state.conversations.length; i++) {
            if (this.state.conversations[i]._id === this.state.conversationID) {
                this.state.conversations[i].messages = receivedMsgs;
                this.props.updateConversation(this.state.conversations);
            }
        }
        this.setState({ msgs: receivedMsgs });
    }

    onSend = ((newMsgs = []) => {

        //this.state.msgs = old messages 
        //newMsgs = new message 
        //combine them and then sort them by time 
        const msgs = this.state.msgs.concat(newMsgs).sort((a, b) => {
            const msgA = dayjs(a.createdAt);
            return msgA.isBefore(dayjs(b.createdAt)) ? 1 : -1;
        });

        //All user conversations are stored in this.state.conversations
        //Loop through to find the one we are in right now 
        //Once found, replaces the messages with the new ones 
        //Then update the redux store so that when the user comes back, the messages are still there
        for (let i = 0; i < this.state.conversations.length; i++) {
            if (this.state.conversations[i]._id === this.state.conversationID) {
                this.state.conversations[i].messages = msgs;
                this.props.updateConversation(this.state.conversations);
            }
        }


        //update the state with the new messages so they can see the new message in real time
        this.setState({ msgs }, () => {

            //send messages to server with the conversation ID 
            //the server will update the conversation in the DB so when the user logs back in
            //the messages are still there
            this.state.socket.emit("send message", { msgs, conversationID: this.state.conversationID });
        })
    })
    render(props) {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.headerView}>
                    <ImageBackground style={styles.header} source={require('../assets/headerimage.jpg')}>
                        <Icon
                        raised
                            name='keyboard-backspace'
                            iconStyle={{color: 'black'}}
                            containerStyle={styles.icon}
                            onPress={() => RootNavigation.navigate('Main')} />
                        <Text style={styles.headerText}> {this.props.route.params.data.firstName}</Text>
                    </ImageBackground>
                </View>
                <View style={styles.container}>

                    <GiftedChat
                        messages={this.state.msgs}
                        onSend={msgs => this.onSend(msgs)}
                        user={{ _id: this.state.user._id }}
                    />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: Dimensions.get('window').height * 0.12,
        width: Dimensions.get('window').width,
    },
    headerView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        position: 'absolute',
        fontSize: 30,
        color: 'white',
        alignSelf: 'center',
        marginTop: '6%',
    },
    icon: {
        position: 'absolute',
        marginTop: '5%',
    },
});

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
    updateConversation: (conversations) => dispatch(updateConversation(conversations))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
