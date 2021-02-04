import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { connect } from "react-redux";

import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, } from 'react-native-gesture-handler';

function ProfileScreen({ route, navigation, ...props }) {
    //Holds user object
    const user = props.auth.user;

    function saveUser() {
        axios.put("https://radiant-woodland-06944.herokuapp.com/api/user", qs.stringify(user), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
                navigation.navigate("Main", { user: response.data });
            })
            .catch((err) => { console.log("err:", err) })
    }

    return (
        <View style={styles.container}>

            <ImageBackground
                style={styles.container}
                source={require('../assets/profilebackground.png')}>
                <View >
                    <Image style={styles.imageView} source={{ uri: user.images[0] }} />
                </View>
                {/* USERNAME HEADER */}
                <View >
                    <Image style={styles.usernameView} source={require('../assets/headerimage.jpg')} />
                    <Text style={styles.usernameText}>{user.username}</Text>
                </View>
                {/* <View style={styles.distView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder={user.matchDistance.toString()}
                        onChangeText={text => user.matchDistance = parseInt(text)} />
                </View> */}
                <View style={styles.firstNameView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder={user.firstName}
                        onChangeText={text => user.firstName = text.trim()} />
                </View>

                <View style={styles.lastNameView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder={user.lastName}
                        onChangeText={text => user.lastName = text.trim()} />
                </View>
                <View style={styles.bioView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder={user.bio}
                        onChangeText={text => user.bio = text.trim()} />
                </View>
                <TouchableOpacity style={styles.animeButton} onPress={() => navigation.navigate('Anime', { user })}>
                    <Text style={styles.buttonText}>UPDATE ANIME LIST</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={() => navigation.navigate("Image", { user })}>
                    <Text style={styles.buttonText}>UPLOAD IMAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={() => {
                    saveUser();
                }}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </ImageBackground>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    firstNameView: {
        width: "37%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "-1%",
        marginLeft: "10%"
    },
    distView: {
        width: "37%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "-10%",
        marginLeft: "10%"
    },
    lastNameView: {
        width: "37%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "-11%",
        marginLeft: "52%"
    },
    usernameView: {
        width: "80%",
        backgroundColor: "#fff",
        // borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        alignSelf: "center",
        padding: 20,
        marginTop: "-25%",
     //   marginLeft: "10%",
        marginBottom: "5%"
    },
    imageView: {
        width: "65%",
        height: "45%",
        backgroundColor: "#fff",
      //  justifyContent: "center",
        alignSelf: "center",
      //  padding: 60,
        marginTop: "25%",
      //  marginLeft: "27%"
    },
    passwordView: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "3%",
        marginLeft: "10%"
    },
    bioView: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "10%",
        justifyContent: "center",
        padding: 20,
        marginTop: "3%",
        marginLeft: "10%"
    },
    inputText: {
        height: 50,
        color: "black",
    },
    usernameText: {
        padding: "10%",
        color: "#fff",
        alignSelf: "center",
        marginTop: "-24%",
        fontSize: 20,
        textTransform: "uppercase"
    },
    backButton: {
        width: "20%",
        backgroundColor: "#81c2f0",
        borderRadius: 20,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "5%",
        marginLeft: "50%"
    },
    saveButton: {
        width: "21%",
        backgroundColor: "#54ebe1",
        borderRadius: 20,
        height: "5%",
        justifyContent: "center",
        alignSelf: "center",
        padding: 20,
        marginTop: "10%",
      //  marginLeft: "40%"
    },
    animeButton: {
        width: "46%",
        backgroundColor: "#ffc552",
     //   borderRadius: 20,
        height: "5%",
        justifyContent: "center",
       // alignSelf: "center",
        padding: 20,
        marginTop: "8%",
        marginLeft: "5%",
    },
    imageButton: {
        width: "38%",
        backgroundColor: "#e675ff",
    //    borderRadius: 20,
        height: "5%",
        justifyContent: "center",
   //     alignSelf: "center",
        padding: 20,
        marginTop: "-10.5%",
        marginLeft: "57%",
    },
    buttonText: {
        height: 15,
        color: "white"
    },
    profile: {
        height: "50%",
        width: "70%",
        resizeMode: "contain"
    }
});

const mapStateToProps = state => ({auth: state.auth});

export default connect(mapStateToProps)(ProfileScreen);

