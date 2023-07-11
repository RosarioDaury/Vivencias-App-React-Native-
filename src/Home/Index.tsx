import React, { useCallback, useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet, Platform } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite';
import { IModel, createTable, getAll, deleteItem, deleteAll} from "../Data/Index";
import { useIsFocused } from '@react-navigation/native'

interface Memory {
    Id: Number,
    Name: String,
    Description: String,
}

interface ItemsProps {
    Item: IModel,
    Navigate: Function,
    Delete: Function
}

const dummyData: Memory[] = [
    {
        Id: 1,
        Name: "Vivencia 1",
        Description: "Description for vivencia 1"
    },
    {
        Id: 2,
        Name: "Vivencia 1",
        Description: "Description for vivencia 1"
    },
    {
        Id: 3,
        Name: "Vivencia 1",
        Description: "Description for vivencia 1"
    },
]

const db = SQLite.openDatabase('mydatabase.db');

const Item: React.FC<ItemsProps> = ({Navigate, Item, Delete}) => {
    return(
        <View
            style={Styles.ItemContainer}
        >
            <View style={Styles.ItemTextContainer}>
                <Text style={{color: '#264653', fontWeight: 'bold', fontSize: 18}}>{Item.title}</Text>
                <Text style={{ color: 'gray' }}>{Item.description}</Text>
            </View>

            <View style={Styles.optionsButtonsContainer}>
                <TouchableOpacity
                    style={Styles.DeleteButton}
                    onPress={() => {
                        Delete(String(Item.id))
                    }}
                >
                    <AntDesign name="delete" size={17} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{...Styles.DeleteButton, backgroundColor: '#264653'}}
                    onPress={() => {
                        Navigate('Memory', {
                            Item: Item.id, 
                            title: Item.title, 
                            description: Item.description,
                            date: Item.date,
                            image: Item.image,
                            audio: Item.audio
                        })
                    }}
                >
                    <AntDesign name="eyeo" size={17} color="white" />
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

export const Home: React.FC<any> = ({navigation}) => {
    const [data, setData] = useState<IModel[]>([]);
    const isFocused = useIsFocused()

    const loadData = async () => {
        await createTable(db);
        await getAll(db, setData);
    }

    useEffect(() => {
        if(isFocused){
            loadData();
        }
    }, [isFocused])


    const Navigate = (page: String, props: any) => {
        navigation.navigate(page, props);
    }   

    const DeleteItem = async (id: String) => {
        await deleteItem(db, id);
        loadData();
    }

    const DeleteAll = async () => {
        await deleteAll(db);
        loadData();
    }

    return(
        <View style={Styles.Container}>

            <TouchableOpacity 
                style={{...Styles.Button, marginTop: 40}}
                onPress={() => {
                    navigation.navigate('Create')
                }}
            >
                <AntDesign name="save" size={24} color='#264653' />
                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#264653'}}>Create New Memory</Text>
           </TouchableOpacity>

            <TouchableOpacity 
                style={{...Styles.Button, backgroundColor: '#b56576'}}
                onPress={DeleteAll}
            >
                <AntDesign name="delete" size={24} color="white" />
                <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Delete All Memories</Text>
            </TouchableOpacity>
            
            <FlatList 
                data={data}
                renderItem={({item}) => <Item Navigate={Navigate} Item={item} Delete={DeleteItem}/>}
                style={Styles.ListContainer}
            />
    
        </View>
    )
}

const Styles = StyleSheet.create({
    Container: {
        height: "100%"
    },
    ItemContainer: {
        padding: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: 'black',
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    ItemTextContainer: {
        width: '70%'
    },
    ListContainer: {
        marginTop: 50,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 30,
        borderTopStartRadius: 30,
        borderTopRightRadius: 30
    },
    Button: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: "white",
        padding: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        borderRadius: 10,
        alignSelf: 'center',
        color: '#264653',
    },
    DeleteButton: {
        backgroundColor: "#b56576",
        padding: 10,
        textAlign: "center",
        fontWeight: "bold",
        borderRadius: 10,
        alignSelf: 'center',
        color: 'white'
    },
    optionsButtonsContainer: {
        flexDirection: 'row',
        gap: 5
    }
})
