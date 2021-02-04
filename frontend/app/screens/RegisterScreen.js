import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Alert } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import qs from 'qs';

//Navigation stuff
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const RegisterScreen = ({navigation}) => {
    //State property to hold username and password from UI
    const [username, setUsername] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [password2, setPassword2] = useState(' ');
    const [firstName, setFirstName] = useState(' ');
    const [lastName, setLastName] = useState(' ');
    const [age, setAge] = useState(' ');
    const [email, setEmail] = useState(' ');
    const [bio, setBio] = useState(' ');

    //Alert button
    const createAlert = (title, message) => {
      return Alert.alert(
        title,
        message,
        [ {text: "Ok", onPress: () => console.log("ok press"), style: 'cancel'} ]
      )
    }

    //Geolocation function
    function getLocation() {
      return new Promise( (resolve, reject) => {

        function success(position) {
          let location = {};
          const latitude  = position.coords.latitude;
          const longitude = position.coords.longitude;

          location.latitude = latitude;
          location.longitude = longitude;

          resolve(location);
      }

      function error() {
        console.log("Cannot find location");
        reject();
      }

    if(!navigator.geolocation) {
        console.log("Location object does not exist");
      } else {
        console.log("Locating...");
        navigator.geolocation.getCurrentPosition(success, error);
      }
      })


    }

    return (
        <View style={styles.container}>

            <ImageBackground
                style={styles.container}
                source={require('../assets/registerbackground.png')}>

                <View style={styles.usernameView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="Username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={text => setUsername({text: text.trim()})} />
                </View>
                <View style={styles.passwordView} >
                    <TextInput
                    secureTextEntry
                    blurOnSubmit={false}
                    onSubmitEditing={()=> Keyboard.dismiss()}
                    style={styles.inputText}
                    placeholder="Password"
                    onChangeText={text => setPassword({text: text.trim()})} />
                </View>
                <View style={styles.passwordView} >
                    <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Re-Enter Password"
                    onChangeText={text => setPassword2({text: text.trim()})} />
                </View>
                <View style={styles.firstNameView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="First Name"
                    autoCorrect={false}
                    onChangeText={text => setFirstName({text: text.trim()})} />
                </View>
                <View style={styles.lastNameView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="Last Name"
                    autoCorrect={false}
                    onChangeText={text => setLastName({text: text.trim()})} />
                </View>
                <View style={styles.ageView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="Age"
                    onChangeText={text => setAge({text: text.trim()})} />
                </View>
                <View style={styles.emailView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={text => setEmail({text: text.trim()})} />
                </View>
                <View style={styles.bioView} >
                    <TextInput
                    style={styles.inputText}
                    placeholder="Bio"
                    onChangeText={text => setBio({text: text.trim()})} />
                </View>
                <TouchableOpacity
                  style={styles.regButton}
                  onPress={() => {

                    let failCheck = false;

                    //Validate credentials
                    axios.get(`https://radiant-woodland-06944.herokuapp.com/api/find/${username.text}`)
                      .then( (response) => {

                        if (response.data._id) {

                          createAlert("Error", "Username already exists");
                          failCheck = true;

                        } else if (password.text.indexOf(password2.text) !== 0) {

                          createAlert("Error", "Passwords must match");
                          failCheck = true;

                        } else if (parseInt(age.text) < 18) {

                          createAlert("Error", "Must be 18 or older")
                          failCheck = true;

                        } else if (!email.text || email.text.indexOf("@") < 0) {

                          createAlert("Error", "Must enter a valid email")
                          failCheck = true;

                        } else if (!bio.text) {

                          createAlert("Error", "Must provide a bio")
                          failCheck = true;

                        }

                        //If credentials pass, create user
                        if (!failCheck) {
                          //GEOLOCATION FN
                          getLocation().then( (location) => {
                              //Initialize user object
                            const user = {
                              username: username.text,
                              password: password.text,
                              firstName: firstName.text,
                              lastName: lastName.text,
                              age: age.text,
                              email: email.text,
                              bio: bio.text,
                              image: " ",
                              favs: [],
                              matchDistance: 0,
                              location
                            };

                            //Send user to API
                            axios.post("https://radiant-woodland-06944.herokuapp.com/register", qs.stringify(user), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
                            .then( (response) => {
                                //CREATION SUCCESSFUL
                              const userData = {user: response.data};
                                navigation.navigate("Anime", userData);

                            })
                            .catch( (err) => {

                              //Email check is done on backend
                                //May change this after
                              if (err.indexOf("already registered") > 0) {
                                createAlert("Error", "Email already registered")
                              }
                            })
                            }).catch(() => {
                              console.log("Uh oh");
                            })

                        }

                      })
                      .catch( (err) => {
                        console.log(err);
                      })

                  }}>
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.testButton} onPress={() => {
                     function success(position) {
                        const latitude  = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        console.log(latitude + " " + longitude);
                      }

                      function error() {
                        console.log("error");
                      }

                    if(!navigator.geolocation) {
                        console.log("nno");
                      } else {
                        console.log("trying");
                        navigator.geolocation.getCurrentPosition(success, error);
                      }
                 }}>
                    <Text style={styles.buttonText}>TEST OTHER</Text>
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
        marginTop: "3%",
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
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "37%",
        marginLeft: "10%"
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
    ageView: {
        width: "20%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "3%",
        marginLeft: "10%"
    },
    emailView: {
        width: "55%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "-11%",
        marginLeft: "34%"
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
        color: "black"
    },
    forgotPassword: {
        color: "black",
        fontSize: 12,
        alignSelf: "center",
        marginTop: 10
    },
    backButton: {
        width: "20%",
        backgroundColor: "#81c2f0",
        borderRadius: 20,
        height: "10%",
        justifyContent: "center",
        padding: 20,
        marginTop: "-6%",
        marginLeft: "40%"
    },
    regButton: {
        width: "25%",
        backgroundColor: "#c281f0",
        borderRadius: 20,
        height: "10%",
        justifyContent: "center",
        padding: 20,
        marginTop: "3%",
        marginLeft: "37%"
    },
    buttonText: {
        height: 15,
        color: "white"
    }
});

export default RegisterScreen;
