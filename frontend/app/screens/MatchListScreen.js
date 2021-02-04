import React, { useState, memo, useRef, useCallback } from 'react';
import axios from 'axios';
import qs from 'qs';
import { connect } from "react-redux";

import { Modal, View, Text, ImageBackground, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { TextInput, } from 'react-native-gesture-handler';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { CardStyleInterpolators } from '@react-navigation/stack';

const { width: screenWidth } = Dimensions.get('window');

const MatchListScreen = ({ route, navigation, ...props }) => {
    //Holds user object
    var { matches } = route.params ? route.params : "";
    
    const user = props.auth.user;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({images: [""]});

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const verticalOutput = 56;
    const itemWidth = windowWidth - verticalOutput;

    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    indexRef.current = index;
    const sliderBackground = useRef(new Animated.Value(0)).current;

    const handleBackgroundChange = (slideIndex) => {
        Animated.spring(sliderBackground, {
            toValue: slideIndex,
            useNativeDriver: false,
        }).start();
    };

    const renderPagination = () => (
        <Pagination
            activeDotIndex={index}
            dotsLength={route.params.matches.length }
            dotStyle={styles.paginationDot}
            dotColor={"pink"}
            inactiveDotColor={"gray"}
            containerStyle={styles.pagination}
        />
    );

    const renderSlide = useCallback(function renderSlide({ item }) {
     //   console.log(i);
        return <Slide data={item} />;
    }, []);

    const renderImages = useCallback(function renderSlide({ item }) {
     //   console.log(i);
        return <SlideImage data={item} />;
    }, []);

    const Slide = memo(function Slide ({data}) {
     //   console.log("data: ", data);
        return (
            <View style={styles.item}>
            <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => {
              setModalVisible(true);
              setModalData(data);
            }}>
                <ImageBackground
                    source={{ uri: data.images[0] }}
                    style={styles.imageContainer}
                >
                    <View style={styles.slideView}>
                    <Text style={styles.slideText}>{data.firstName}, {data.age}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => addLikes(data)}>
                        <Text style={styles.buttonText}>LIKE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={() => addDisLikes(data)}>
                        <Text style={styles.buttonText}>DISLIKE</Text>
                    </TouchableOpacity>
                    </View>
                </ImageBackground>

                </TouchableOpacity>
            </View>
        );
    });

    const SlideImage = memo(function SlideImage ({data}) {
     //   console.log("data: ", data);
        return (
            <View style={styles.slide}>
              <Image source={{ uri: data }} style={styles.slideImage}></Image>
            </View>
        );
    });

    const addLikes = (liked) => {
        var exists = false;
        //loop thru own matches array
            //check if they liked u yet
                //if they liked u, set didMatch to true for both
                //if not, 
                    //push their id in your matches array
                    //push your id in their matches array
                    //set didMatch to false for both
        
        for (var i = 0; i < user.matches.length; ++i) {
            if (liked._id === user.matches[i].id) {
                user.matches[i].didMatch = true;
                exists = true;

                for (var j = 0; j < liked.matches.length; ++j) {
                    if (user._id === liked.matches[j].id) {
                        liked.matches[j].didMatch = true;
                    }
                }
                break;
            } 
        }

        if (!exists) {
            var user1 = { 
                id: user._id, 
                didMatch: false
            };
            var user2 = { 
                id: liked._id, 
                didMatch: false
            };

            user.matches.push(user2);
            liked.matches.push(user1);
        }

        var userObj = {
            curr: user,
            match: liked
        }

        //remove liked user from match list
        route.params.matches = route.params.matches.filter((item) => {
            return item !== liked
        })

        //push carousel to next user
       // _carousel.snapToItem(index+1);

        axios.post("https://radiant-woodland-06944.herokuapp.com/api/user/new-match", qs.stringify(userObj), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
      // axios.post("http://localhost:8080/api/user/new-match", qs.stringify(userObj), { headers: { 'content-type': 'application/x-www-form-urlencoded' } }) 
       .then((response) => {
                let obj = {
                    user: response.data
                };
                
            })
        .catch((err) => { console.log("err:", err) })
    }

    const addDisLikes = (liked) => {
        //Adding dislike person into the dislike array

        var user1 = { 
            id: user._id, 
        };
        var user2 = { 
            id: liked._id, 
        };

        user.dislikes.push(user2);
        liked.dislikes.push(user1);
        
        var userObj = {
            curr: user,
            match: liked
        }
        

        axios.post("https://radiant-woodland-06944.herokuapp.com/api/user/new-match", qs.stringify(userObj), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
      // axios.post("http://localhost:8080/api/user/new-match", qs.stringify(userObj), { headers: { 'content-type': 'application/x-www-form-urlencoded' } }) 
       .then((response) => {
            let obj = {
                user: response.data
            };
        })
        .catch((err) => { console.log("err:", err) })
    }

    const filterDislikes = (matchList) => {
    //remove disliked user from match list

        var finalMatches = [];    

        if(user.dislikes)
        {
            for (var i = 0; i < matchList.length; ++i){
                var exist = false;           
                for(var j = 0; j< user.dislikes.length;j++){
                    if(user.dislikes[j].id == matchList[i]._id)
                    {
                        exist = true;
                    }
                }
                if (exist == false)
                    finalMatches.push(matchList[i]); 

                //route.params.matchList = route.params.matchList.filter((item) => {
                //    return item !== dislikes[i]._id
                //})
            }
        }
        return finalMatches
    }

    var newMatches = filterDislikes(matches);

    return (
        <View style={styles.container}>

            <ImageBackground
                style={styles.container}
                source={require('../assets/matchesbackgrounds.png')}>
                    {/* POP UP DETAILED PROFILE */}
                <Modal
                  animationType="slide"
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(false);
                  }}>
                  <View>
                      {/*<Image style={styles.slideImage} source={{ uri: modalData.images[0] }} />*/}
                      <Carousel
                          data={modalData.images}
                          renderItem={renderImages}
                          onBeforeSnapToItem={(index) => setIndex(index)}
                          onScrollIndexChanged={handleBackgroundChange}
                          sliderWidth={windowWidth}
                          itemWidth={itemWidth}
                          // layout={'tinder'}
                          layout={'default'}
                          hasParallaxImages={true}
                          itemWidth={screenWidth - 60}
                          sliderWidth={screenWidth}
                          sliderHeight={screenWidth}
                         // layoutCardOffset={18}
                      />
                  </View>
                  <TouchableOpacity style={{"width": "100%", "height": "100%"}} onPress={() => setModalVisible(false)}>
                    <View style={styles.details}>


                      <View>
                        <Text>{modalData.firstName} {modalData.lastName} - {modalData.age}</Text>
                      </View>
                      <View>
                        <Text>{modalData.bio}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                <Animated.View style={styles.container}>
                <View style={styles.paginationContainer}>
                    <Carousel
                        data={newMatches}
                        renderItem={renderSlide}
                        onBeforeSnapToItem={(index) => setIndex(index)}
                        onScrollIndexChanged={handleBackgroundChange}
                       // extraData={route.params.matches}
                        // layout={'tinder'}
                        layout={'tinder'}
                        layoutCardOffset={9}
                        hasParallaxImages={true}
                        itemWidth={screenWidth - 60}
                        sliderWidth={screenWidth}
                        sliderHeight={screenWidth}
                       ref={(c) => { _carousel = c; }}
                    />
                </View>
                    {renderPagination()}
                </Animated.View>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>BACK</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Math.round(Dimensions.get('window').height),
    },
    background: {
      height: "100%",
      width: "100%"
    },
    backButton: {
        width: "20%",
        backgroundColor: "#ca85ff",
        borderRadius: 20,
        height: "5%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        padding: 10,
        marginTop: "-5%",
        marginBottom: "5%",
    //    marginLeft: "40%"
    },
    buttonText: {
        height: 15,
        color: "white",
        fontSize: 15,
    },
    backBtnText: {
        height: 15,
        color: "white",
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
    addButton: {
        width: "26%",
        backgroundColor: "#ff5e99",
        height: "5%",
        justifyContent: "center",
        alignSelf: "center",
        padding: 20,
        
      //  marginTop: "5%",
    },
    inputText: {
        height: 50,
        color: "black"
    },
    delButton: {
        width: "10%",
        backgroundColor: "#e83c3c",
        padding: "3%",
        marginTop: "-16%",
        marginBottom: "6%",
        alignContent: "center",
    },
    pagination: {
        position: "absolute",
        bottom: 8,
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
    },
    paginationDot: {
        width: 12,
        height: 12,
        borderRadius: 25,
        marginHorizontal: 2,
    },
    paginationContainer: {
        flex: 1,
    },
    slide: {
        backgroundColor: "#fff",
        opacity: 0.75,
        width: "100%",
        height: "65%",
       // borderRadius: 25,
        marginTop: Math.round(Dimensions.get('window').height) * 0.2,
        
    },
    slideImage: {
        height: "50%",
        width: "70%",
        alignSelf: "center",
        marginTop: "25%",
    },
    slideText: {
        fontSize: 24,
        color: "white",
        textTransform: "uppercase",
        alignSelf: "center",
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    item: {
        width: screenWidth - 60,
        height: screenWidth + 60,
        marginTop: screenWidth  * 0.3,
    },
    slideView: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});


const mapStateToProps = state => ({auth: state.auth});

export default connect(mapStateToProps)(MatchListScreen);
