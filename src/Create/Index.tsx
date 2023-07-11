import React, {useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, StatusBar, Button, TouchableOpacity, Image  } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Shadow } from 'react-native-shadow-2';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Imodel, saveItem } from "../Data/Index";
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

export const Create: React.FC<any> = ({navigation} ) => {
    const [date, setDate] = useState(new Date());
    const [payload, setPayload] = useState<Imodel>({title: '', description: '', date: new Date().toDateString(), image: '', audio: ''})
    const [recording, setRecording] = useState<any>();
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);

    const cameraRef = useRef<any>();

    async function startRecording() {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        setIsRecording(true);
        const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  
    async function stopRecording() {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      await Audio.setAudioModeAsync(
        {
          allowsRecordingIOS: false,
        }
      );
      const uri = recording.getURI();
      handleTextChange(uri, 'audio')
    }
  
    const handleTextChange = (e: any, name: string) => {
        setPayload({...payload, [name]: e})
    }

    const onChangeDate = ({type}: any, selectedDate: any) => {
        const date = new Date(selectedDate).toDateString();
        handleTextChange(date, 'date');
    }

    const handleShowCamera = async () => {
        await Camera.requestCameraPermissionsAsync();
        setShowCamera(true)
    }

    const takePic = async () => {
        let options = {
          quality: 1,
          base64: true,
          exif: false
        };
    
        let newPhoto = await cameraRef.current.takePictureAsync(options);
        handleTextChange(newPhoto.uri, 'image');
    };

    const handleSave = async () => {
        const {title, description, date, image, audio} = payload

        if(!title || !description || !date) {
            return
        }
        await saveItem(db, payload);
        navigation.navigate('Home');  
    }

    const canSave = () => {
        const {title, description, date, image, audio} = payload;
        if(!title || !description || !date) {
            return true
        }
        return false
    }

    const handleReset = async () => {
        setPayload({title: '', description: '', date: new Date().toDateString(), image: '', audio: ''})
    }

    if(showCamera){
        return (<Camera style={styles.camera} ref={cameraRef}>
            {payload.image
                ? 
                    <View style={{...styles.buttonContainer, flexDirection: 'column'}}>
                        <Image source={{uri:String(payload.image), width: 100,height: 150 }} style={styles.buttonContainer}/>
                    </View>

                : null
            }

            <View style={styles.buttonContainer}>
                <View style={styles.buttonContainer}>
                    <Button title="Back" onPress={() => setShowCamera(false)} />
                </View>

                <TouchableOpacity
                    onPress={takePic}
                    style={styles.buttonContainer}
                >
                    <MaterialIcons name="camera" size={50} color="white" />
                </TouchableOpacity>
            </View>
    
            <StatusBar/>
        </Camera>)
    }

    return(
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Home')
                    }}
                >
                    <AntDesign name="arrowleft" size={30} color="#264653" />
                </TouchableOpacity>
                <Text style={styles.text}>New Memory</Text>
            </View>
            <View style={styles.inputsContainer}>

                <TextInput 
                    placeholder="Title" 
                    style={styles.inputs} 
                    value={String(payload.title)}
                    onChangeText={(e) => 
                    {
                        handleTextChange(e, 'title')
                    }}
                />

                <TextInput 
                    placeholder="Description" 
                    style={styles.inputs}
                    value={String(payload.description)}
                    onChangeText={(e) => 
                        {
                            handleTextChange(e, 'description')
                        }}
                />

                <DateTimePicker
                    mode='date'
                    display="spinner"
                    value={new Date(String(payload.date))}
                    onChange={onChangeDate}
                />
                        
                <TouchableOpacity 
                    style={styles.buttons}
                    onPress={handleShowCamera}
                >
                    <Entypo name="camera" size={24} color="white" />
                    <Text style={styles.buttonText}>Take Photo {payload.image ? "(Photo Saved)" :"(Empty)"}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.buttons}
                    onPress={() => {
                            isRecording
                            ?
                                stopRecording()
                            :
                                startRecording()
                        }
                    }
                >
                    <MaterialIcons name="audiotrack" size={24} color="white" />
                    {
                        isRecording
                        ? <Text style={styles.buttonText}>Stop Recording</Text>
                        : <Text style={styles.buttonText}>Record Audio {payload.audio ? "(Audio Saved)" :"(Empty)"}</Text>
                    }
                </TouchableOpacity>

            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.buttonsActions} onPress={handleSave} disabled={canSave()}>
                    <AntDesign name="save" size={24} color='#264653' />
                    <Text style={styles.buttonTextActions}>Save Memory</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonsActions} onPress={handleReset}>
                    <Entypo name="erase" size={24} color='#264653' />
                    <Text style={styles.buttonTextActions}>Reset</Text>
                </TouchableOpacity>

            </View>
            
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 90
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 40
    },
    text: {
        color: '#264653',
        fontSize: 20,
        fontWeight: 'bold'
    },
    inputsContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    inputs: {
        color: '#264653',
        borderBottomWidth: 1,
        borderColor: '#264653',
        marginBottom: 20,
        padding: 10,
        width: '80%',
        alignSelf: 'center',
        fontSize: 18
    },
    buttons: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        backgroundColor: '#264653',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    actionsContainer: {
        flex: 1,
        backgroundColor: '#264653',
        paddingTop: 30,
        paddingHorizontal: 30,
        borderTopStartRadius: 25,
        borderTopRightRadius: 25,
        marginTop: 40,
    },
    buttonsActions: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonTextActions: {
        color: '#264653',
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignSelf: 'flex-end',
        marginBottom: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
})