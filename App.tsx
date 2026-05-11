/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import React from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { HomeScreen } from './src/Screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/Routes/RootStackParamList';
import { NavigationContainer } from '@react-navigation/native';
import { PhotoPreviewScreen } from './src/Screens/PhotoPreviewScreen';
import PixelEraserScreen from './src/Screens/PixelEraserScreen';
import { ImageContextProvider } from './src/Context/ImageContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack=createNativeStackNavigator<RootStackParamList>();
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ImageContextProvider>
        <NavigationContainer>
            <Stack.Navigator>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
                  <Stack.Screen name="PixelEraser" component={PixelEraserScreen} />
            </Stack.Navigator>
        </NavigationContainer>
      </ImageContextProvider>   
    </SafeAreaProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
