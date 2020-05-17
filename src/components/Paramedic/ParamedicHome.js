import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, Alert, Switch, AsyncStorage, PermissionsAndroid, Vibration } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Communications from 'react-native-communications';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from "react-native-push-notification";
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from "../common/handleAndroidBackButton";
import {exitAlert} from "../common/exitAlert";


export default class ParamedicHome extends Component {

    callerScreens = () => 
        Alert.alert(
             "Caller Page",
             "Are you sure?",
             [
                 {
                     text: "Cancel",                     
                     style:"cancel",
                     onPress: () => console.log("Cancel Pressed")
                 },
                 {
                     text:" OK",
                     onPress: () => this.setState({findHospital: true}),
                 },                 
             ],
             {
                 cancelable: false
             }
        )
    constructor(props) {
        super(props);
        this.state = {
              region: {
                latitude: 1,
                longitude: -2,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              findHospital: false,
              selectedOption: false,
              available: true,
              callerLocation: '',
              detailsModal: false,
              callerDetails: { },
              image: null,
              paramedic: null,
              makePath: false,
              acceptModal: false,
              modal: false,
              arrived: false,
              loading: false,
              eta: null
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        handleAndroidBackButton(exitAlert);
        var userData = await AsyncStorage.getItem("userData") 
        var user = JSON.parse(userData)
        if(user) {
            this.setState({
                paramedic: user
            })

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
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
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

    componentWillUnmount() {

    }
    handleBackButtonClick() {

    }

    requestFound() {
        PushNotification.localNotification({
            color: "#A70A05",
            title: "Caller In Need!", // (optional)
            message: "Open App to Accept their Request.", // (required)
            soundName: "default",
          });
    }
    arrivedAtLocation() {
        PushNotification.localNotification({
            color: "#A70A05",
            // title: "Paramedic", // (optional)
            message: "Arrived at Destination.", // (required)
            soundName: "default",
          });
    }

    getRequest() {
        fetch(`http://192.168.10.2/Paramedic/api/GetRequests?pId=${this.state.paramedic.pId}`)
            .then(res => res.json())
            .then( res => {
                    if(res !== null) {
                        this.requestFound(); 
                        this.setState({
                            callerLocation: res
                    })
                    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.callerLocation.cLat},${this.state.callerLocation.cLong}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`)
                    .then(res => res.json())
                    .then(res => {
                        if(res !== null) {
                            this.setState({
                                callerLocation: {...this.state.callerLocation, locationName: res.results[0].formatted_address}
                            })
                        } else {
                            this.setState({
                                callerLocation: {...this.state.callerLocation, locationName: "Address"}
                            })
                        }
                    }).catch("Cannot Find Location Name")
                    fetch(`http://192.168.10.2/Paramedic/api/callerDetails?rId=${res.rId}`)
                    .then(res => res.json())
                    .then(res => {
                        if (res) {
                            this.setState({
                                callerDetails: res,
                                image: res.image,
                                loading: false,
                                modal: true
                            })
                        }               
                    })
                    } else {
                        this.timer = setInterval(() => {
                            if(this.state.arrived !== true) {
                                this.getRequest();
                            }
                        }, 10000)
                    }
                    })
    }

    onSwitchFlip(){
        Vibration.vibrate();
        if(!this.state.selectedOption)
        {
            let details = {
                pLat: this.state.region.latitude,
                pLong: this.state.region.longitude,
                available: true,                
            }
            fetch(`http://192.168.10.2/Paramedic/api/Available?id=${this.state.paramedic.pId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(details)
            })
            .then(res => res.json())
            .then( res => {
                console.log("Avaible Function")
                this.setState({
                    paramedic: {...this.state.paramedic, available: true},
                })
                this.getRequest();    
            })
        } else {
            let details = {
                pLat: 0,
                pLong: 0,
                available: false
            }           
            fetch(`http://192.168.10.2/Paramedic/api/Available?id=${this.state.paramedic.pId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(details)
        })
        .then(res => res.json())
        .then( res => {
            console.log("Stopped")
            this.setState({
                modal: false,
                loading: false,
                paramedic: {...this.state.paramedic, available: false}
            })
        })
    }
        this.setState({
            selectedOption: !this.state.selectedOption
        })
    }
    
    acceptRequest(){
        fetch(`http://192.168.10.2/Paramedic/api/AcceptRequest?pId=${this.state.paramedic.pId}&rId=${this.state.callerLocation.rId}`)
        .then(res => res.json)
        .then(res => {
            this.setState({
                modal:false,
                detailsModal: true,
                makePath: true,
                acceptModal: true,
                available: false
            })
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${this.state.region.latitude},${this.state.region.longitude}&destinations=${this.state.callerLocation.cLat},${this.state.callerLocation.cLong}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`)
            .then(res => res.json())
            .then(res => {
                console.log(console.log(res.rows[0].elements[0].duration.text))
                this.setState({
                    eta: res.rows[0].elements[0].duration.text
                })
            })
        })
    }

    arrived(){
        this.setState({detailsModal:false, makePath:false, acceptModal: false, arrived: true})
        fetch(`http://192.168.10.2/Paramedic/api/Arrived?rId=${this.state.callerLocation.rId}`)
        .then(res => res.json)
        .then(res => {
            console.log(res);
            this.arrivedAtLocation();
            this.setState({
                arrived: true,
                available: true,
                selectedOption: false
            });
        })
    }

    render() {
        const { container, requestModal, showDetailStyle } = styles;
        const { callerDetails, callerLocation, modal, detailsModal, makePath, acceptModal, arrived, available, eta} = this.state;
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
                    destination = {{ latitude: callerLocation.cLat, longitude: callerLocation.cLong }}
                    apiKey='AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                    strokeWidth={4}
                    strokeColor="#A70A05"
                    />: null}
                    {(callerLocation !== null && acceptModal)?
                    <Marker
                    coordinate={{ "latitude": callerLocation.cLat,   
                    "longitude": callerLocation.cLong }}
                    title= {"Caller"}
                    onPress= {()=> this.setState({detailsModal:true})}
                    />
                    :null}                   
                </MapView>
                {(available)? <View 
                                style={{                        
                                    position: 'absolute', 
                                    top: Dimensions.get('window').height * .02,
                                    left: Dimensions.get('window').width * .65,
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    opacity: 0.80,
                                    paddingHorizontal: 10,
                                    borderRadius:10,
                                    alignItems: 'center',
                                }}>
                                <Text style={{ color: '#A70A05', fontWeight: '700', fontSize: 15 }}>Available</Text>
                                <Switch
                                    ios_backgroundColor='white'
                                    thumbColor='#A70A05'
                                    trackColor={{true: '#A70A05', false: 'grey'}}
                                    value={this.state.selectedOption}
                                    onValueChange={() => this.onSwitchFlip() }                            
                                />
                            </View>: null
                }
            <Modal animationType="fade"   isVisible={modal} onRequestClose={() => this.setState({modal:false})}    
                animationType="slide"
                propagateSwipe
                style={requestModal}
                hasBackdrop={false}
                coverScreen={false}
                >
                    <View style={{flexDirection:"column", padding:20, width:'100%'}}>
                        
                            <View style={{flexDirection:"row", width:'100%', paddingTop:20}}>
                            <Image source={(callerDetails.image === null) ? require('../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + callerDetails.image}}  
                                style={{
                                    width: 70, height: 70, backgroundColor:'lightgrey', borderRadius: 70/2
                                }}  />
                            <View style={{flexDirection:"column", width:'100%'}}>
                                <View style={{flexDirection:'column', alignContent:"center"}}>
                                    <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 20 }}>{callerDetails.firstName} {callerDetails.lastName}</Text>
                                    <Text style={{ color: '#A70A05', fontSize: 14, marginLeft: 20, width:'80%' }}>{callerLocation.locationName}</Text>  
                                    <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 20 }}>{callerDetails.phoneNo}</Text>
                                </View>
                                </View>
                                </View> 
                                <View style={{flexDirection:'row', width:'100%', justifyContent:"space-evenly",paddingBottom:20}}>    
                                <Button
                                icon="check" 
                                mode="contained"
                                theme={buttonTheme} 
                                onPress={() => this.acceptRequest()}   
                                    >Accept
                                </Button>   
                                </View>   
                    </View>
                </Modal>
                <Modal animationType="fade"   isVisible={detailsModal} onRequestClose={() => this.setState({detailsModal:false})}    
                animationType="slide"
                propagateSwipe
                style={requestModal}
                hasBackdrop={false}
                coverScreen={false}
                >
                    <View style={{flexDirection:"column", padding: 10, width:'100%'}}>
                        
                    <View style={{flexDirection:"row", width:'100%', marginTop:15, justifyContent:"space-between"}}>
                        <View style={{width: '16%'}}>
                        <Image source={(callerDetails.image === null) ? require('../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + callerDetails.image}}  
                            style={{
                                width: 70, height: 70, backgroundColor:'lightgrey', borderRadius: 70/2
                            }}  />
                        </View>
                        <View style={{flexDirection:"column", width:'74%'}}>
                            <View style={{flexDirection:'column', alignContent:"center" }}>
                                <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 30}}>{callerDetails.firstName} {callerDetails.lastName}</Text>
                                <Text style={{ color: '#A70A05', fontSize: 14, width:'80%', marginLeft: 30}}>{callerLocation.locationName}</Text>
                                <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 30}}>{eta}</Text>  
                                <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 30}}>{callerDetails.phoneNo}</Text>
                            </View>
                        </View>
                        <View style={{ width: '10%', marginTop: -15}}>
                            <Button
                                icon="close"
                                mode=" text"
                                theme={buttonTheme} 
                                onPress= {() => this.setState({detailsModal:false})}                                
                                >

                            </Button> 
                        </View>
                    </View>
                    <View style={{flexDirection:'row', width:'100%', justifyContent:"space-evenly", paddingVertical:10}}>    
                            <Button
                                icon="phone" 
                                mode="contained"
                                theme={buttonTheme} 
                                style={{width: '45%'}}
                                onPress={() => Communications.phonecall(callerDetails.phoneNo,true)}   
                                    >Contact
                                </Button>
                            <Button
                                icon="map-marker-check" 
                                mode="contained"
                                theme={buttonTheme} 
                                style={{width: '45%'}}
                                onPress={() => this.arrived()}   
                                    >Arrived
                                </Button>       
                            </View>   
                </View>
                </Modal>
                    <Modal animationType="fade"   isVisible={arrived} onRequestClose={() => this.setState({arrived:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={showDetailStyle}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                                <Text style={{ color: '#A70A05', fontWeight:'bold', fontSize: 14}}>Reached Location</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                                <Button
                                icon="account-details" 
                                mode="contained"
                                theme={buttonTheme} 
                                onPress={() => this.props.navigation.navigate('showDetails', {callerDetails: { 
                                    image: callerDetails.image,
                                    firstName: callerDetails.firstName, 
                                    lastName: callerDetails.lastName, 
                                    phoneNo: callerDetails.phoneNo,
                                    cId: callerDetails.cId,
                                    }})}   
                                    >
                                            Details
                                </Button>
                                <Button 
                                icon="call-missed" 
                                mode="contained" 
                                theme={buttonTheme}
                                onPress={() => this.setState({arrived:false, modal: false, makePath: false, callerDetails: { } })}>
                                            OK
                                </Button>
                                </View>
                        </Modal>
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
        left: Dimensions.get('window').width * .05,
        backgroundColor: 'white',
        height: 100,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 2
        },
        shadowOpacity: 0.5,
        elevation:3,
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
    requestModal: {
        width: Dimensions.get('screen').width * .70,
        position: 'absolute',
        bottom: Dimensions.get('window').height * .04,
        left: Dimensions.get('screen').width * .11,
        backgroundColor: 'white',
        // height: 150,
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
})