import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Home } from './src/Home/Index';
import { Create } from './src/Create/Index';
import { Banner } from './src/Banner/Index';
import { Memory } from './src/Memory/Index';

const Stack = createNativeStackNavigator();

export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      primary: "#d4a373",
      background: "#264653",
      card: "#fefae0",
      text: "#ffff",
      border: "#faedcd",
      notification: "#ade8f4",
    },
  };

  return (
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Index"
            component={Banner}
          />
          <Stack.Screen
            name="Home"
            component={Home}
          />
           <Stack.Screen
            name="Create"
            component={Create}
          />
          <Stack.Screen
            name='Memory'
            component={Memory}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});
