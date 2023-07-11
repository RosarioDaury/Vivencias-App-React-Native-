import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, TextComponent } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';

const db= SQLite.openDatabase('mydatabase.db');

export const Memory: React.FC<any> = (props) => {
    const [sound, setSound] = useState<any>();
    const [thereIsAudio, setThereIsAudio] = useState<boolean>();
    const [thereIsImage, setThereIsImage] = useState<boolean>();
    const isFocused = useIsFocused()

    useEffect(() => {
        if(isFocused){
            const {audio, image} = props.route.params;
            audio ? setThereIsAudio(true) : setThereIsAudio(false);
            image ? setThereIsImage(true) : setThereIsImage(false);
        }
    }, [isFocused])

    async function playSound() {
        const sound = new Audio.Sound();

        await sound.loadAsync({
            uri: props.route.params.audio
        });
        await sound.playAsync();
        setSound(sound);
    }

    const stopSound = async () => {
        sound.pauseAsync()
        setSound(null)
    }

    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);

    return(
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('Home')
                    }}
                >
                    <AntDesign name="arrowleft" size={30} color="#264653" />
                </TouchableOpacity>
                <Text style={styles.text}>{props.route.params.title}</Text>
            </View>
            
            <View style={styles.contentContainer}>
                <Text style={styles.date}>
                    {props.route.params.date}
                </Text>

                
                
                {thereIsImage
                    ?
                        <Image source={{uri:props.route.params.image, width: 300,height: 300 }} style={styles.image}/>
                    :      
                        <Text style={styles.notMediatext}>There is not Image</Text>         
                }

                <Text style={styles.description}>
                    {props.route.params.description}
                </Text>


                {thereIsAudio
                    ?
                        <TouchableOpacity
                            onPress={() => {
                                sound
                                    ?
                                        stopSound()
                                    :
                                        playSound()
                            }}
                            style={styles.audio}
                        >
                            {
                                sound 
                                ?
                                    <Entypo name="controller-stop" size={30} color="#264653" />
                                :
                                    <AntDesign name="play" size={30} color="#264653" />
                            }
                        </TouchableOpacity>
                    :      
                        <Text style={styles.notMediatext}>There is not Audio</Text>         
                }

                
            </View>
        </View>
    )
} 


const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 50
    },
    text: {
        color: '#264653',
        fontSize: 20,
        fontWeight: 'bold'
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#264653',
        borderTopStartRadius: 30,
        borderTopRightRadius: 30
    },
    date: {
        marginTop: 20,
        width: '100%',
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        borderRadius: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    description: {
        marginVertical: 10,
        width: '80%',
        alignSelf: 'center',
        backgroundColor: 'white',
        color: '#264653',
        padding: 10,
        fontSize: 18
    }, 
    image: {
        marginTop: 20,
        alignSelf: 'center'
    },
    audio: {
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: 'white',
        color: '#264653',
        paddingVertical: 10,
        paddingHorizontal: 30,
        textAlign: 'center',
        borderRadius: 30,
    },
    notMediatext: {
        width: '70%',
        alignSelf: 'center',
        padding: 10,
        color: '#264653',
        textAlign: 'center',
        backgroundColor: 'white'
    }
})