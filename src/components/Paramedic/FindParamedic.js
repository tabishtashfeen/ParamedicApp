import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, PermissionsAndroid, AsyncStorage, Vibration, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Geolocation from 'react-native-geolocation-service';
import * as geolib from 'geolib';
import PushNotification from "react-native-push-notification";

export default class FindParamedic extends Component {

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
              paramedics: [],
              sendAgain: true,
              checkRequestStatus: false,
              index: 0,
              accepted: '',     
              paraId: ''         
        };
        this.acceptTimer = null;
    }

    async componentDidMount() {
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
            message: "Request Accepted, Paramedic is on his way", // (required)
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
        
        fetch(`http://192.168.10.2/Paramedic/api/NoParamedic?id=${this.state.user.pId}&pId=${this.state.paraId}`)
        .then( res => res.json() )
        .then( res => {            
            this.setState({
                accepted: 'NoParamedic',
                loading: false
            });
            alert('Sorry, can\'t find any available paramedic.'); 
        })                                
    }

    checkrequest(paramedics){
        fetch(`http://192.168.10.2/Paramedic/api/RequestChecker?rId=${this.state.request.rId}`)
        .then(res => res.json())
        .then(res => {
            if(res) {
                if(res.status === "Accepted"){                    
                        this.setState({
                            paramedicDetails: res,                            
                            loading: false,                            
                            accepted: "Accepted",
                            checkRequestStatus: true
                        });                        
                        this.paramedicOnRoute();
                        clearInterval(this.acceptTimer);
                        clearInterval(this.inner);
                        this.props.navigation.navigate('FindParamedicNext', { 
                        data: { 
                            lat: this.state.region.latitude, 
                            long: this.state.region.longitude,
                            index: this.state.index,                            
                            NOP: this.state.NOP,
                            pId: this.state.paraId,
                            paramedicDetails: res,
                            request: this.state.request
                        },
                        user: {
                            cId: this.state.user.pId
                        }
                    })                   
                } else if (this.state.accepted === "Requested"){
                    //    if(this.state.complete !== true){
                    //         this.outer = setInterval(() => this.checkrequest(), 5000);                    
                    //     } else {
                    //         clearInterval(this.outer);
                    //     }                                                                                     
                            this.inner = setInterval(() => {
                                if (this.state.accepted === "Requested") {
                                    this.noParamedic();
                                } else {
                                    clearInterval(this.inner);
                                } 
                            }, 60000);                     
                    }
            }
        })
    }

    requestAPI(paramedics){
        this.setState({
            loading: true
        });
        if(this.state.accepted === "Sending"){
            fetch(`http://192.168.10.2/Paramedic/api/RequestParamedic?id=${this.state.user.pId}&pId=${this.state.paraId}&clat=${this.state.region.latitude}&clng=${this.state.region.longitude}&status=${"Requested"}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    accepted:"Requested",
                    request: res,
                    checkRequestStatus: true
                });                
                this.acceptTimer = setInterval(() => {
                    if(this.state.checkRequestStatus) {
                        this.checkrequest(paramedics)
                    } else {
                        clearInterval(this.acceptTimer);
                    }
                    }, 5000)
            }).catch();
        } else{
            this.setState({
                loading: false
            });
        }
    }

    onButtonPress (){
        this.setState({
            loading: true
        })
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
                        accepted: "Sending",
                        loading: false
                    })
                    let paramedics = this.state.paramedics.sort((a, b) => a.distance > b.distance);
                    this.setState({ paraId: paramedics[0].pId })
                    // this.props.navigation.navigate('FindParamedicNext', { 
                    //     data: { 
                    //         lat: this.state.region.latitude, 
                    //         long: this.state.region.longitude,
                    //         index: this.state.index,                            
                    //         NOP: this.state.NOP,
                    //         pId: paramedics[0].pId,
                    //     },
                    //     user: {
                    //         cId: this.state.user.pId
                    //     }
                    // })
                    this.requestAPI(paramedics);
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
        const { container, bottomButtons, loader, paramedicModal, showDetailStyle } = styles;
        const { loading, modal, paramedicDetails, makePath, arrived, image, eta } = this.state;
        const { latitude, longitude } = this.state.region;
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
                    {(makePath) ? 
                    <PolylineDirection 
                    origin = {{ latitude: latitude, longitude: longitude }}
                    destination = {{ latitude: paramedicDetails.pLat, longitude: paramedicDetails.pLong }}
                    apiKey='AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                    strokeWidth={4}
                    strokeColor="#A70A05"
                    />: null}
                    {(paramedicDetails !== null)?
                    <Marker
                    coordinate={{ "latitude": paramedicDetails.pLat,   
                    "longitude": paramedicDetails.pLong }}
                    title= {"Paramedic"}
                    onPress= {()=> this.setState({modal:true})}
                    >                        
                    <Image source={require('../../assets/pmarker2.png')} style={{height: 40, width:40, }} /> 
                    </Marker>
                    :null}
                    </MapView>
                    <Modal animationType="fade"   isVisible={loading} onRequestClose={() => this.setState({loading:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={loader}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                    <ActivityIndicator size="large" color="#A70A05" />
                    <Text style={{ color: '#A70A05',  fontSize: 12 }}>Finding Paramedic </Text>
                    </Modal>
                <View style={bottomButtons}>
                    <TouchableOpacity 
                    style={{ alignItems: 'center', justifyContent: 'center' }} 
                    onPress={ () => this.onButtonPress() }
                    >
                        <Image source={require('../../assets//ambulance.png')} style={{ height: 50, width: 50 }} />
                        <Text style={{color:'#A70A05',fontWeight:'bold'}}>
                            GET AMBULANCE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.props.navigation.navigate('ParaFindHospital', { location: { latitude: this.state.region.latitude, longitude: this.state.region.longitude }})}
                    >
                        <Image source={require('../../assets/search.png')} style={{ height: 50, width: 50 }} />
                        <Text style={{color:'#A70A05',fontWeight:'bold', marginLeft: 4}}>
                            FIND HOSPITAL
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
const buttonTheme = {
    colors: {
        primary:"#A70A05",
        accent:"#A70A05"
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
    },
    showDetailStyle: {
        width: Dimensions.get('screen').width * .65,
        height: Dimensions.get('screen').height * .14,
        position: 'absolute',
        alignSelf: 'center',
        top: Dimensions.get('screen').height * .35,
        backgroundColor: 'white',
        shadowColor: 'black',
        borderRadius: 5,
        shadowOffset: {
            height: 5,
            width: 2
        },
        elevation:4,
        shadowOpacity: 0.5,
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'column',
        opacity:0.9 
    },
    paramedicModal: {
        width: Dimensions.get('screen').width * .65,
        position: 'absolute',
        bottom: Dimensions.get('window').height * .04,
        left: Dimensions.get('screen').width * .11,
        backgroundColor: 'white',
        height: 150,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 2
        },
        elevation:4,
        shadowOpacity: 0.5,
        justifyContent: "space-evenly",
        opacity:0.9
        
    },
    loader: {
        width: Dimensions.get('screen').width * .32,
        height: Dimensions.get('screen').height * .10,
        position: 'absolute',
        alignSelf: 'center',
        top: Dimensions.get('screen').height * .25,
        backgroundColor: 'white',
        shadowColor: 'black',
        borderRadius: 5,
        shadowOffset: {
            height: 5,
            width: 2
        },
        elevation:4,
        shadowOpacity: 0.5,
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'column',
        opacity:0.9
    },
})