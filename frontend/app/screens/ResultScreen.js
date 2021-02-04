import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';

import { View, Text, ImageBackground, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
    //Holds result data from search function
    const { responseData } = route.params ? route.params : "";
    //Holds current user data
    const { user } = route.params ? route.params : "";

    //Function to add anime title into user's fav anime list
    const addTitle = (anime) => {
        let favObj = { id: anime.mal_id, title: anime.title};
        user.favs.push(favObj);

        if (!user.favObj) {
          user.favObj = {};
        }

        user.favObj[anime.mal_id] = true;
       // console.log(user.favs);
        axios.put("https://radiant-woodland-06944.herokuapp.com/api/user", qs.stringify(user), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
                let obj = {
                    user: response.data
                };
                navigation.navigate("Anime", obj);
            })
            .catch((err) => { console.log("err:", err) })

    }
    //Adds list items to view
    const Item = ({ item }) => (
        <View >
            <View>
            <Text style={styles.resulttext}>{item.title}</Text>
            </View>
            <View>
            <TouchableOpacity style={styles.addButton} onPress={() => addTitle(item)}>
                <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>
            </View>
            <View>
                <Image style={styles.img} source={{uri:item.image_url}} />
            </View>
        </View>
    );
    //Renders list items
    const renderItem = ({ item }) => {
        return <Item item={item} />
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.container}
                source={require('../assets/resultsbackground.png')}>
                <View  style={styles.resultbox}>
                    <FlatList
                        data={route.params.responseData}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                    />
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonText: {
        color: "white"
    },
    resultbox: {
        marginTop: "20%",
        padding: "12%",
        height: "80%",
    },
    resulttext: {
        fontSize: 15,
        padding: "5%",
        fontWeight: "bold",
        marginLeft: "15%",
        marginBottom: "-2%",
        marginTop: "5%"
    },
    addButton: {
        width: "17%",
        backgroundColor: "#000",
        justifyContent: "center",
        alignContent: "center",
        padding: "3%",
        marginTop: "-15%",
        marginBottom: "5%"
    },
    img: {
        height: 80,
        width: 80,
        alignSelf: "center",
    }
});

export default ResultScreen;
