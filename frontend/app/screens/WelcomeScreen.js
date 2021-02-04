import React, { useState } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import qs from 'qs';
import { login } from '../actions/auth-action';

import { View, Text, ImageBackground, StyleSheet,TouchableOpacity, Dimensions } from 'react-native';
import { TextInput,  } from 'react-native-gesture-handler';

const WelcomeScreen = (props) => {
    //State property to hold username and password from UI
    const [username, setUsername] = useState(' ');
    const [password, setPassword] = useState(' ');
    
    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.container}
                source={require('../assets/welcomebackground.png')}>
                <View style={styles.usernameView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="Username"
                    autoCapitalize="none"
                    autoCorrect={false}
                     onChangeText={text => setUsername({text})}
                    />
                </View>
                <View style={styles.passwordView} >
                    <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password"
                    onChangeText={text => setPassword({text})}
                    />
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                        const user = {username: username.text, password: password.text};
                        console.log('something')
                        props.login(user);
                    }}
                    >
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.regButton} onPress={() => navigation.navigate('Register')}>
                     <Text style={styles.buttonText}>SIGN UP</Text>
                 </TouchableOpacity>
            </ImageBackground>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    usernameView: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "7.5%",
        justifyContent: "center",
        padding: 20,
        marginTop: Math.round(Dimensions.get('window').height) * 0.65,
        marginLeft: "10%"
    },
    passwordView: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "7.5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "3%",
        marginLeft: "10%"
    },
    inputText: {
        height: 50,
        color: "black"
    },
    forgotPassword: {
        color: "black",
        fontSize: 12,
        alignSelf: "center",
        marginTop: "3%"
    },
    loginButton: {
        width: "20%",
        backgroundColor: "#f2b1e4",
        borderRadius: 20,
        height: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: "3%",
        marginLeft: "40%"
    },
    regButton: {
        width: "25%",
        backgroundColor: "#c281f0",
        borderRadius: 20,
        height: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: "3%",
        marginLeft: "37%"
    },
    testButton: {
        width: "30%",
        backgroundColor: "#fcbe1e",
        borderRadius: 20,
        height: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: "1%",
        marginLeft: "7%"
    },
    buttonText: {
        height: 15,
        color: "white"
    }
});

const mapDispatchToProps = dispatch => ({login: (user) => dispatch(login(user))});
const mapStateToProps = state => ({auth: state.auth});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
