import React, {useCallback, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 

export const Banner: React.FC<any> = ({navigation}) => {
    const handleFetchCatFacts = useCallback( async () => {
        console.log('LOGGER')
     }, []);
 
     useEffect(() => {
        handleFetchCatFacts()
     }, [])

    return(
    <View style={styles.Container}>
        <Entypo name="book" size={70} color="white" />

        <View>
            <Text style={styles.Text}> Your Memories App</Text>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Home')
                }}
                style={styles.Button}
            >
                <Text style={styles.ButtonText}>Enter</Text>
            </TouchableOpacity>
        </View>
       
    </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        marginTop: 70,
        flex: 1,
        alignItems: 'center',
        gap: 50
    },
    Text: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 25
    },
    Button: {
        marginTop: 20,
        backgroundColor: "white",
        padding: 10,
        textAlign: "center",
        borderRadius: 10,
        width: "40%",
        alignSelf: 'center'
    },
    ButtonText: {
        fontWeight: "bold",
        fontSize: 20
    }
})  