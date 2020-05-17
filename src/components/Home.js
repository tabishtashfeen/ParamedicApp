// import React, { Component } from 'react';
import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, PermissionsAndroid, AsyncStorage, } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as geolib from 'geolib';
import PushNotification from "react-native-push-notification";
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from "./common/handleAndroidBackButton";
import {exitAlert} from "./common/exitAlert";

                   
{/* API for Searching Locations https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk&input=hospitals&location=33.5969,73.0528&radius=2000 */}
{/* API for Get Details From PlaceId https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJZYyLM7mU3zgRRhfMi90XDRM&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk */}
{/* API for Location Details From latlng https://maps.googleapis.com/maps/api/geocode/json?latlng=33.5969,73.0528&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk */}


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 33.5969,
                longitude: 73.0528,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              request: null,
              user: null,
              paramedicDetails: null,
              showModal: false,
              loading: false,
              modal: false,
              makePath: false,
              arrived: false,
              complete: false,
              image: null,
              interval: 1,
              eta: null,
              paramedics: [ ],
              sendAgain: true,
              checkRequestStatus: false,
              index: 0,
              status: null,
              accepted: " ",
              NOP: 0,
              paraId: null
        };
    }

    async componentDidMount() {
        handleAndroidBackButton(exitAlert);
        var userData = await AsyncStorage.getItem('userData')
        var user = JSON.parse(userData)
        if(user){
            this.setState({user})
        }
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Location Permission",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition((position) => {
                    var lat = parseFloat(position.coords.latitude)
                    var long = parseFloat(position.coords.longitude)
              
                    var region = {
                      latitude: lat,
                      longitude: long,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }
              
                    this.setState({region: region})
                  },
                  (error) => alert(JSON.stringify(error)),
                  {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
            } else {
              console.log("Camera permission denied");
            }
          } catch (err) {
            console.warn(err);
          }
    }

    paramedicOnRoute() {
        PushNotification.localNotification({
            color: "#A70A05",
            // title: "Paramedic", // (optional)
            message: "Request Accepted, Paramedic is on his way.", // (required)
            soundName: "default",
          });
    }
    
    calculateDistance = (lat, lng, pLat, pLng) => {
        var dist = geolib.getDistance({ latitude: lat, longitude: lng }, {
          latitude: pLat,
          longitude: pLng
        });           
        dist = dist / 1000;             
        return dist;
      }
    
    onRegionChange(region) {
        region => this.setState({ region });
    }
    
    noParamedic(){
        
        fetch(`http://192.168.10.2/Paramedic/api/NoParamedic?id=${this.state.user.cId}&pId=${this.state.paraId}`)
        .then( res => res.json() )
        .then( res => {            
            this.setState({
                accepted: 'NoParamedic'
            })
            console.log(this.state.accepted," Function NoParamedic")
        })                        
        alert('Sorry, can\'t find any available paramedic.'); 
    }

    onButtonPress (){
        fetch(`http://192.168.10.2/Paramedic/api/GetAllParademics`)
        .then( res => res.json() )
        .then( res => {
                if(res.length > 0) {
                    let data = [];
                    res.forEach((paramedic) => {
                        const distance = this.calculateDistance(this.state.region.latitude, this.state.region.longitude, paramedic.pLat, paramedic.pLong);                
                        data.push({pId: paramedic.pId, distance: distance});                
                    });
                    this.setState({
                        NOP: data.length,
                        paramedics: data,
                        accepted: "Sending"
                    })
                    let paramedics = this.state.paramedics.sort((a, b) => a.distance > b.distance);
                    this.props.navigation.navigate('findAmbulance', { 
                        data: { 
                            lat: this.state.region.latitude, 
                            long: this.state.region.longitude,
                            index: this.state.index,                            
                            NOP: this.state.NOP,
                            pId: paramedics[0].pId,
                        },
                        user: {
                            cId: this.state.user.cId
                        }
                    })
                } else {
                    alert('Sorry, can\'t find any available paramedic.');
                    this.setState({
                        loading:false,
                        checkRequestStatus: false
                    })
                }
       })
        .catch()    
    }

    render() {
        const { container, bottomButtons} = styles;
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                
                <MapView
                    style={{
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width
                    }}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    showsUserLocation
                >
                    </MapView>
                    <View style={bottomButtons}>
                    <TouchableOpacity 
                    style={{ alignItems: 'center', justifyContent: 'center' }} 
                    onPress={ () => this.onButtonPress()}
                    >
                        <Image source={require('../assets/ambulance.png')} style={{ height: 50, width: 50 }} />
                        <Text style={{color:'#A70A05',fontWeight:'bold'}}>
                            GET AMBULANCE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.props.navigation.navigate('FindHospital', { location: { latitude: this.state.region.latitude, longitude: this.state.region.longitude }})}
                    >
                        <Image source={require('../assets/search.png')} style={{ height: 50, width: 50 }} />
                        <Text style={{color:'#A70A05',fontWeight:'bold', marginLeft: 4}}>
                            FIND HOSPITAL
                        </Text>
                    </TouchableOpacity>
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
    bottomButtons: {
        width: Dimensions.get('window').width * .9,
        position: 'absolute',
        bottom: Dimensions.get('window').height * .05,
        left: Dimensions.get('window').width * .06,
        backgroundColor: 'white',
        height: 100,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 2
        },
        elevation:4,
        shadowOpacity: 0.5,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: 'center',
    }
})