import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';

import { View, Text, ImageBackground, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, } from 'react-native-gesture-handler';

const AnimeScreen = ({ route, navigation }) => {
    //Holds user's search text
    const [searchText, setSearchText] = useState(' ');
    //Holds user object
    const { user } = route.params ? route.params : "";
    //Strings for Jikan Anime API
    const str1 = "https://api.jikan.moe/v3/search/anime?q=";
    const str2 = "&limit=5";

    //Function that deletes anime item
    const deleteTitle = (anime) => {
        let favObj = { id: anime._id, title: anime.title};
        user.favObj[anime.id] = false;
        //Remove anime title from favorites list array by matching id
        let removeIndex = user.favs.map((item) => { return item._id; }).indexOf(favObj.id);
        user.favs.splice(removeIndex,1);
        // console.log(user.favs);
       // console.log("obj: " + favObj.id);
      // console.log(user.location.latitude);
        axios.put("https://radiant-woodland-06944.herokuapp.com/api/user", qs.stringify(user), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
                let obj = {
                    user: response.data
                };
                navigation.navigate("Anime", obj);
            })
            .catch((err) => { console.log("err:", err) })

    }
    //Places list items into view
    const Item = ({ item }) => (
        <View >
        <View >
            <Text style={styles.resulttext}>{item.title}</Text>
        </View>
        <View>
        <TouchableOpacity style={styles.delButton} onPress={() => deleteTitle(item)}>
            <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        </View>
        </View>
    );
    //Renders list items
    const renderItem = ({ item }) => {
        return <Item item={item} />

    }
    //Function that performs anime title search from Jikan Anime API
    function doSearch(text) {
        axios.get(str1 + text + str2)
            .then((response) => {
                //Holds object to pass to params of Result Screen
                let obj = {
                    responseData: response.data.results,
                    user
                };
                navigation.navigate("Result", obj);
            })
            .catch((err) => { console.log("err:", err) });
    }
    //Function to save user profile and hold user object
    function saveProfile() {
        navigation.navigate("Main", {user});
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.container}
                source={require('../assets/animebackground.png')}>
                <View style={styles.searchView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Search"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={text => setSearchText({ text })}
                    />
                </View>
                <TouchableOpacity style={styles.enterButton} onPress={() => doSearch(searchText.text)}>
                    <Text style={styles.buttonText}>ENTER</Text>
                </TouchableOpacity>
                <View style={styles.resultbox}>
                    <FlatList
                        data={route.params.user.favs}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={() => saveProfile()} >
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
    saveButton: {
        width: "20%",
        backgroundColor: "#ffa3ee",
        borderRadius: 20,
        height: "5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "-2%",
        marginLeft: "40%"
    },
    buttonText: {
        height: 15,
        color: "white"
    },
    searchView: {
        width: "60%",
        backgroundColor: "#fff",
        borderRadius: 25,
        height: "7.5%",
        justifyContent: "center",
        padding: 20,
        marginTop: "24%",
        marginLeft: "10%"

    },
    enterButton: {
        width: "20%",
        backgroundColor: "#000",
        height: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: "-10%",
        marginLeft: "75%"
    },
    inputText: {
        height: 50,
        color: "black"
    },
    resultbox: {
        marginTop: "20%",
        padding: "12%",
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        height: "63%",
    },
    resulttext: {
        fontSize: 15,
        padding: "5%",
        fontWeight: "bold",
        marginLeft: "15%",
        marginBottom: "-2%",
        marginTop: "5%"
    },
    delButton: {
        width: "10%",
        backgroundColor: "#e83c3c",
        padding: "3%",
        marginTop: "-16%",
        marginBottom: "6%",
        alignContent: "center",
    },
});

export default AnimeScreen;
