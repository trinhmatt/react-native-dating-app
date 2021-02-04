import React from 'react';
import { connect } from 'react-redux';
import dayjs from "dayjs";

import { View, Text, FlatList, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import * as RootNavigation from '../../routes';
import { Platform } from 'react-native';

class MessengerScreen extends React.Component {
    state = {
        user: this.props.auth.user,
        conversations: this.props.auth.conversations,
        conversationID: "",

        //*****NOTE: CHANGE TO STORE MATCHES IN DB NEXT SPRINT */
        matches: this.props.route.params.matches,
        activeConversations: [],
    }
    componentDidMount() {

      // console.log(this.state.conversations)
        let tmpActive = [];

        console.log(this.state.conversations)


        if (this.state.conversations && this.state.conversations.length > 0) {
            for (let i = 0; i < this.state.matches.length; ++i) {
                for (let j = 0; j < this.state.conversations.length; ++j) {
                    if (this.state.matches[i]._id === this.state.conversations[j].users["0"] || this.state.matches[i]._id === this.state.conversations[j].users["1"]) {
                        let matchData = {
                            convId: this.state.conversations[j]._id,
                            recipientId: this.state.matches[i]._id, 
                            recipientName: this.state.matches[i].firstName,
                            recipientImg: this.state.matches[i].images[0],
                            lastMsg: this.state.conversations[j].messages[0].text,
                        }
                        tmpActive.push(matchData);
                    }
                }
            }
           
        }
        this.setState({activeConversations: tmpActive}, );

        
     }

    //Renders list items
    renderItem = ({ item, separators }) => {
        console.log(item.lastMsg)
        return (
            <ListItem
                style={styles.friendItem}
                leftAvatar={{ source: {uri: item.recipientImg}}}
                title={item.recipientName}
                subtitle={item.lastMsg}
            />
        );
    }

    renderHeader = () => {
        return ( 
            <Text style={styles.friendItem}>ideally have a search bar here</Text>
        );
    }

    render(props) {
        return (
            <View style={styles.container}>
            <ImageBackground
                style={styles.container}
                source={require('../assets/messengerbackground.png')}>
                <View style={styles.friendView}>
                    <FlatList
                        data={this.state.activeConversations}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.convId}
                        ListHeaderComponent={this.renderHeader}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={() => RootNavigation.navigate('Main')}>
                    <Text>BACK</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    friendView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.11,
    },
    friendItem: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.1,
    },
    saveButton: {
        width: "20%",
        backgroundColor: "#ffa3ee",
        borderRadius: 20,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginLeft: "40%"
    },
});

const mapStateToProps = state => ({auth: state.auth});

export default connect(mapStateToProps)(MessengerScreen);