import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

//Navigation stuff
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './routes';

import { StyleSheet } from 'react-native';

//Screen components
import WelcomeScreen from "./app/screens/WelcomeScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import MainScreen from "./app/screens/MainScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import AnimeScreen from "./app/screens/AnimeScreen";
import ResultScreen from "./app/screens/ResultScreen";
import MatchListScreen from "./app/screens/MatchListScreen";
import UploadImageScreen from "./app/screens/UploadImageScreen";
import CheckMatchesScreen from "./app/screens/CheckMatchesScreen";
import ChatScreen from "./app/screens/ChatScreen";
import MessengerScreen from './app/screens/MessengerScreen';

const Stack = createStackNavigator();
import store from './store/store'


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Anime" component={AnimeScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Image" component={UploadImageScreen} />
          <Stack.Screen name="MatchList" component={MatchListScreen} />
          <Stack.Screen name="CheckMatches" component={CheckMatchesScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Messenger" component={MessengerScreen} />
        </Stack.Navigator>
       </NavigationContainer>
      </Provider>
    );
  }
}

//AppRegistry.registerComponent('main', () => App);

// export default function App() {
//   return  (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
//         <Stack.Screen name="Welcome" component={WelcomeScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Main" component={MainScreen} />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="Anime" component={AnimeScreen} />
//         <Stack.Screen name="Result" component={ResultScreen} />
//         <Stack.Screen name="Image" component={UploadImageScreen} />
//         <Stack.Screen name="MatchList" component={MatchListScreen} />
//         <Stack.Screen name="CheckMatches" component={CheckMatchesScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
