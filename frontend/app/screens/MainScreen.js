import axios from 'axios';
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { TextInput,  } from 'react-native-gesture-handler';
import qs from 'qs';
import * as RootNavigation from '../../routes';
import { connect } from "react-redux";


function MainScreen({ route, navigation, ...props }) {

    //Holds user object
    const user = props.auth.user;

    function checkDistance(d1, d2) {
      var R = 6371.0710; // Radius of the Earth in km
      var rlat1 = d1.latitude * (Math.PI/180); // Convert degrees to radians
      var rlat2 = d2.latitude * (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (d1.longitude-d2.longitude) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
    }

    function getMatches() {
        //Grab all users, distance is checked on backend
        //https://radiant-woodland-06944.herokuapp.com
        const queryObj = {currLoc: user.location, dist: user.matchDistance, curr: user._id};
        axios.post("https://radiant-woodland-06944.herokuapp.com/api/get-users-distance", qs.stringify(queryObj), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
        .then( (response) => {

          //console.log(response);
          let matches = [];

          for (let i = 0; i < response.data.length; i++) {
            //console.log(response.data[i].username);
            for (const anime in user.favObj) {
              if (response.data[i]._id !== user._id && response.data[i].favObj[anime]) {
                matches.push(response.data[i]);
              }
            }
          }

          //navigation.navigate("MatchList", {matches, user});
          RootNavigation.navigate('MatchList', {matches});

        })
        .catch( (err) => {
          console.log(err);
        })
    }

    function checkMatches() {
      console.log('click')
      //Grab all users
      axios.get("https://radiant-woodland-06944.herokuapp.com/api/getAllUsers")
      .then((response) => {
        console.log('inside resp')
          let allUsers = response.data;
          let matches = [];
          let matchObj = {};
         // Match users based on location & anime titles/id
          user.matches.forEach((userlikes) => {
              if (userlikes.didMatch) {
                  matchObj[userlikes.id] = true;
              }
          })
          allUsers.forEach((allItem) => {
              if (matchObj[allItem._id]) {
                  matches.push(allItem);
              }
          })
          //console.log(matches);
          //Navigate to match list screen w/ new array as param
          RootNavigation.navigate('CheckMatches', {matches});
      })
      .catch((err) => {
          console.log("err:" + err);
      })
  }
  //************NOTE: CHANGE TO STORE MATCH NAME, PICTURE IN DB NEXT SPRINT
  function checkMessages() {
    //Grab all users
    axios.get("https://radiant-woodland-06944.herokuapp.com/api/getAllUsers")
    .then((response) => {
      console.log('inside resp')
        let allUsers = response.data;
        let matches = [];
        let matchObj = {};
       // Match users based on location & anime titles/id
        user.matches.forEach((userlikes) => {
            if (userlikes.didMatch) {
                matchObj[userlikes.id] = true;
            }
        })
        allUsers.forEach((allItem) => {
            if (matchObj[allItem._id]) {
                matches.push(allItem);
            }
        })
        //console.log(matches);
        //Navigate to match list screen w/ new array as param
        RootNavigation.navigate('Messenger', {matches});
    })
    .catch((err) => {
        console.log("err:" + err);
    })
  }

    return (
        <View style={styles.container}>

            <ImageBackground
                style={styles.container}
                source={require('../assets/mainbackground.png')}>
                 <TouchableOpacity
                    onPress={() => RootNavigation.navigate('Profile')}>
                    <Image
                    style={styles.profileImg}
                    source={require('../assets/profileimage.png')}
                     />
                </TouchableOpacity>
                <TouchableHighlight
                  //  onPress={() => navigation.navigate('MatchList', {user})}
                  onPress={() => getMatches()}
                    >
                    <Image style={styles.firstbtnView} source={require('../assets/findmatchbtn.png')} />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => checkMatches()}>
                    <Image style={styles.secondbtnView} source={require('../assets/checkmatches.png')} />
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => checkMessages()}>
                    <Image style={styles.secondbtnView} source={require('../assets/messenger.png')} />
                </TouchableHighlight>
                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                       // console.log(socket);
                       // socket.emit("send message", {id: socket.id, message: "test"})
                       socket.emit('init', { senderId: user._id });
                    //    socket.on('message', message => {
                    //        const newMsg = {
                    //            text: message.text,
                    //            userId: message.senderId,
                    //            _id: message.msgId,
                    //        };

                    //    });
                 }}>
                    <Text style={styles.buttonText}>test socket</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                     axios.get("https://radiant-woodland-06944.herokuapp.com/logout")
                     .then(() => {
                        navigation.navigate("Welcome");
                     })
                 }}>
                    <Text style={styles.buttonText}>LOGOUT</Text>
                </TouchableOpacity>

            </ImageBackground>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoutButton: {
        width: "26%",
        backgroundColor: "#ffa3ee",
        borderRadius: 35,
        alignSelf: "center",
        padding: 10,
       // marginTop: Math.round(Dimensions.get('window').height) * -0.35,
       marginTop: '5%',
    },
    buttonText: {
        height: 15,
        color: "white",
        alignSelf: 'center'
    },
    firstbtnView: {
        marginTop: Math.round(Dimensions.get('window').height) * 0.15,
       // marginLeft: Math.round(Dimensions.get('window').width) * 0.03,
       marginLeft: '2.5%',
        // height: '30%',
        // width: '110%',
    },
    secondbtnView: {
      //  marginTop: Math.round(Dimensions.get('window').height) * -0.1,
        marginTop: '5%',
        marginLeft: Math.round(Dimensions.get('window').width) * -0.07,
        marginLeft: '2.5%',
        // height: '45%',
        // width: '110%',
    },
    thirdbtnView: {
      //  marginTop: Math.round(Dimensions.get('window').height) * -0.26,
        marginLeft: Math.round(Dimensions.get('window').width) * -0.07,
        // height: '55%',
        // width: '110%',
    },
    profileImg: {
        marginTop: "5%",
        marginLeft: "80%"
    }
});

const mapStateToProps = state => ({auth: state.auth});

export default connect(mapStateToProps)(MainScreen);

