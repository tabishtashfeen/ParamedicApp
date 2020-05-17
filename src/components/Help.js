import React, { Component } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';

export default class Help extends Component {
    render() {
        const { container, text, card, Textcard, boldText} = styles;
        return (
            <View style={container}>
                <View style={card}><Text style={boldText}>
                    The Following Information will Help you Navigate this Application Better.</Text></View>
                <View style={{
                        flexDirection:"row", 
                        padding:15, 
                        marginHorizontal:20, 
                        borderRadius:5, 
                        elevation:1000, 
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent:"center",
                        borderBottomEndRadius:0,
                        borderBottomStartRadius:0,
                    }}>
                <Image
                source = {require('../assets/pmarker2.png')} 
                style = {{width:45, height:45, borderRadius:45/2, marginLeft:20}}
                />
                <Text style={text}>
                    This is the Symbol for Paramedic. (This can be seen on the map)
                </Text>
                </View>
                <View style={{
                        flexDirection:"row", 
                        padding:15, 
                        marginHorizontal:20, 
                        borderRadius:5, 
                        elevation:1000, 
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent:"center",
                        borderTopEndRadius:0,
                        borderTopStartRadius:0,
                    }}>
                <Image
                source = {require('../assets/hMarker.png')} 
                style = {{width:45, height:45, borderRadius:45/2, marginLeft:20}}
                />
                <Text style={text}>
                    This is the Symbol for Hospital. (This can be seen on the map)
                </Text>
                </View>
                <View style={Textcard}>
                    <View style={{flexDirection:"row", padding: 5}}>
                    <Text style={boldText}>
                        To Get Ambulance: 
                    </Text>
                    <Text style={text}>
                        Tap the Get Ambulance Button.
                    </Text>
                    </View>
                    <View style={{flexDirection:"row", padding: 5}}>
                    <Text style={boldText}>
                        To Find Hospital:
                    </Text>
                    <Text style={text}>
                        Tap the Find Hospital Button.
                    </Text>
                    </View>    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: '900',
        color: '#A70A05',
        marginLeft: 5
    },
    boldText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#A70A05',
        marginLeft: 5,
        fontWeight:"bold"
    },
    card: {
        flexDirection:"row", 
        padding:15, 
        marginHorizontal:20, 
        borderRadius:5, 
        elevation:1000, 
        backgroundColor: "white",
        alignItems: "center",
        justifyContent:"center"
    },
    Textcard: {
        flexDirection:"column", 
        padding:15, 
        marginHorizontal:20, 
        borderRadius:5, 
        elevation:1000, 
        backgroundColor: "white",
        alignItems: "center",
        justifyContent:"center",
    }
})