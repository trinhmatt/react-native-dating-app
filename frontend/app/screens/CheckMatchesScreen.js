import React, { useState, memo, useRef, useCallback } from 'react';
import axios from 'axios';
import qs from 'qs';
import { connect } from "react-redux";
import * as RootNavigation from '../../routes';

import { Modal, View, Text, ImageBackground, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { TextInput, } from 'react-native-gesture-handler';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

const CheckMatchesScreen = ({ route, navigation, ...props }) => {
    //Holds user object
    const { matches } = route.params ? route.params : "";
    // const { user } = route.params ? route.params : "";
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
                    <TouchableOpacity style={styles.addButton} onPress={() => RootNavigation.navigate('Chat', {data})}>
                        <Text style={styles.buttonText}>CHAT</Text>
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

    

    return (
        <View style={styles.container}>

            <ImageBackground
                style={styles.container}
                source={require('../assets/checkbackground.png')}>

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
                        data={route.params.matches}
                        renderItem={renderSlide}
                        onBeforeSnapToItem={(index) => setIndex(index)}
                        onScrollIndexChanged={handleBackgroundChange}
                        sliderWidth={windowWidth}
                        itemWidth={itemWidth}
                        // layout={'tinder'}
                        layout={'default'}
                       // layoutCardOffset={18}
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
        width: "25%",
        backgroundColor: "#ff5e99",
        height: "5%",
        justifyContent: "center",
        alignSelf: "center",
        padding: 20,
        marginTop: "8%",
        borderRadius: 25,
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
        backgroundColor: "#fcd9fb",
        opacity: 0.90,
        width: "100%",
        height: "70%",
        borderRadius: 25,
        marginTop: "30%",
    },
    slideImage: {
        height: "50%",
        width: "70%",
        alignSelf: "center",
        marginTop: "30%",
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

export default connect(mapStateToProps)(CheckMatchesScreen);

