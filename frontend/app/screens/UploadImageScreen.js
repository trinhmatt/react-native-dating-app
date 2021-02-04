import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput,  } from 'react-native-gesture-handler';
import axios from 'axios';
import qs from 'qs';
import * as ImagePicker from 'expo-image-picker';

//Navigation stuff
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const UploadImage = ({route, navigation}) => {
     const {user} = route.params ? route.params : "";
    //State property to hold username and password from UI
     const [images, setImages] = useState([]);

    const pickImage = async () => {
      let imagesCopy = images;

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        allowsEditing: false,
        aspect: [4, 3],
      });

      const uri = "data:image/jpg;base64," + result.base64;

      if (!result.cancelled) {
        imagesCopy.push(uri);
        setImages(imagesCopy);
      }
    };
//https://radiant-woodland-06944.herokuapp.com
    const uploadImage = () => {
      const imageStr = images;
      axios.post(`https://radiant-woodland-06944.herokuapp.com/images/${user._id}`, qs.stringify(images), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
      .then( (response) => {
          //CREATION SUCCESSFUL
        const userData = {user: response.data};
          navigation.navigate("Profile", userData);

      })
      .catch( (err) => {
        console.log(err);
      })
    }
    return (
        <View style={styles.container}>

            <ImageBackground
                style={styles.container}
                source={require('../assets/uploadbackground.png')}>
                <View>
                 <Image style={styles.imageView}  source={{uri: user.images[0]}}/>
                </View>
                <TouchableOpacity style={styles.selectButton} onPress={() => {
                  //console.log("click")
                  pickImage()
                }}>
                    <Text style={styles.buttonText}>SELECT IMAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={() => {
                  //console.log("upload")
                  uploadImage()
                }}>
                    <Text style={styles.buttonText}>UPLOAD IMAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>RETURN TO PROFILE</Text>
                </TouchableOpacity>
            </ImageBackground>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        width: "47.5%",
        backgroundColor: "#54ebe1",
        height: "-10%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        padding: 15,
        marginTop: "5%"
    },
    selectButton: {
        width: "37%",
        backgroundColor: "#faa3ff",
        height: "-15%",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: "-10%",
        marginLeft: "11%"
    },
    uploadButton: {
        width: "38%",
        backgroundColor: "#ffa3cb",
        height: "-15%",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: "-12.1%",
        marginLeft: "50%"
    },
    buttonText: {
        height: 15,
        color: "white"
    },
    imageView: {
        width: "75%",
        backgroundColor: "#fff",
        height: "55%",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: "35%",
    },
});

export default UploadImage;
