// import React, { Component } from 'react';
import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, Vibration, ActivityIndicator, } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import PolylineDirection from '@react-native-maps/polyline-direction';
import PushNotification from "react-native-push-notification";

                   
{/* API for Searching Locations https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk&input=hospitals&location=33.5969,73.0528&radius=2000 */}
{/* API for Get Details From PlaceId https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJZYyLM7mU3zgRRhfMi90XDRM&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk */}
{/* API for Location Details From latlng https://maps.googleapis.com/maps/api/geocode/json?latlng=33.5969,73.0528&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk */}


export default class FindParamedicNext extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: this.props.navigation.getParam('data').lat,
                longitude: this.props.navigation.getParam('data').long,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              request:  this.props.navigation.getParam('data').request,
              cId: this.props.navigation.getParam('user').cId,
              paramedicDetails: this.props.navigation.getParam('data').paramedicDetails,
              showModal: false,
              loading: false,
              modal: true,
              makePath: false,
              arrived: false,
              complete: false,
              image: null,
              interval: 1,
              eta: null,
              paramedics: [ ],
              sendAgain: true,
              checkRequestStatus: true,
              index: this.props.navigation.getParam('data').index,
              status: null,
              accepted: "Sending",
              NOP: this.props.navigation.getParam('data').NOP,
              paraId: this.props.navigation.getParam('data').pId,
              markerIcon: true,
              paramedicArrived: false                                    
        };
        this.acceptTimer = null;
        this.inner = null;
        this.outer = null;        
    }

    componentDidMount() {
        this.acceptTimer = setInterval(() => {
            if(this.state.checkRequestStatus) {
                this.checkrequest()
            } else {
                clearInterval(this.acceptTimer);
            }
            }, 5000)
    }

    paramedicOnRoute() {
        PushNotification.localNotification({
            color: "#A70A05",
            // title: "Paramedic", // (optional)
            message: "Request Accepted, Paramedic is on his way.", // (required)
            soundName: "default",
          });
    }
    paramedicArrived() {
        PushNotification.localNotification({
            color: "#A70A05",
            // title: "Paramedic", // (optional)
            message: "Paramedic Has Arrived.", // (required)
            soundName: "default",
          });
          clearInterval(this.acceptTimer);
    }

    onRegionChange(region) {
        region => this.setState({ region });
    }
    
    noParamedic(){
        
        fetch(`http://192.168.10.2/Paramedic/api/NoParamedic?id=${this.state.cId}&pId=${this.state.paraId}`)
        .then( res => res.json() )
        .then( res => {            
            this.setState({
                accepted: 'NoParamedic'
            })
        })                        
        alert('Sorry, can\'t find any available paramedic.'); 
        this.goBack(); 
    }

    // requestAPI(){
    //     this.setState({
    //         loading: true
    //     });
    //     if(this.state.accepted === "Sending"){
    //         fetch(`http://192.168.10.2/Paramedic/api/RequestParamedic?id=${this.state.cId}&pId=${this.state.paraId}&clat=${this.state.region.latitude}&clng=${this.state.region.longitude}&status=${"Requested"}`)
    //         .then(res => res.json())
    //         .then(res => {
    //             this.setState({
    //                 accepted:"Requested",
    //                 request: res,
    //                 checkRequestStatus: true
    //             });                
                // this.acceptTimer = setInterval(() => {
                //     if(this.state.checkRequestStatus) {
                //         this.checkrequest()
                //     } else {
                //         clearInterval(this.acceptTimer);
                //     }
                //     }, 5000)
    //         }).catch();
    //     } else{
    //         this.setState({
    //             loading: false
    //         });
    //     }
    // }

    checkrequest(){
        fetch(`http://192.168.10.2/Paramedic/api/RequestChecker?rId=${this.state.request.rId}`)
        .then(res => res.json())
        .then(res => {
            if(res) {
                this.setState({
                    modal: true,
                    makePath: true
                })
                fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${this.state.region.latitude},${this.state.region.longitude}&destinations=${this.state.paramedicDetails.pLat},${this.state.paramedicDetails.pLong}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`)
                        .then(res => res.json())
                        .then(res => {
                            if(res) {
                                this.setState({
                                    eta: res.rows[0].elements[0].duration.text
                                })
                            } else {
                                this.setState({
                                    eta: "Calculating"
                                })
                            }  
                        })
                // if(res.status === "Accepted"){
                //     if (this.state.paramedicDetails === null) {
                //         this.setState({
                //             paramedicDetails: res,
                //             image: res.image,
                //             loading: false,
                //             modal: true,
                //             makePath: true,
                //             accepted: "Accepted",
                //         });
                        // fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${this.state.region.latitude},${this.state.region.longitude}&destinations=${this.state.paramedicDetails.pLat},${this.state.paramedicDetails.pLong}&key=AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk`)
                        // .then(res => res.json())
                        // .then(res => {
                        //     if(res) {
                        //         this.setState({
                        //             eta: res.rows[0].elements[0].duration.text
                        //         })
                        //     } else {
                        //         this.setState({
                        //             eta: "Calculating"
                        //         })
                        //     }  
                        // })
                //             this.paramedicOnRoute();
                //     }                   
                    // if(this.state.accepted === "Accepted")
                    //     {
                    //         this.acceptTimer = setInterval(() => this.checkrequest(), 5000)
                            
                    //     }else {
                    //         clearInterval(this.acceptTimer)
                    //     }
                if (res.status === "Arrived"){                     
                    this.setState({
                        accepted: "Arrived",
                        arrived: true,
                        modal: false,
                        checkRequestStatus: false,
                        complete: true,
                        markerIcon: false,
                        makePath: false
                        });          
                        clearInterval(this.acceptTimer);
                        this.paramedicArrived();           
                }
                // else if (this.state.accepted === "Requested"){
                // //    if(this.state.complete !== true){
                // //         this.outer = setInterval(() => this.checkrequest(), 5000);                    
                // //     } else {
                // //         clearInterval(this.outer);
                // //     }                                                                                     
                //         this.inner = setInterval(() => {
                //             if (!this.state.checkRequestStatus && !this.state.arrived) {
                //                 this.noParamedic();
                //             } else {
                //                 clearInterval(this.inner);
                //             } 
                //         }, 30000);                     
                // }
            }
        })
    }

    goBack(){
        this.setState({arrived:false, modal: false, makePath: false, paramedicDetails:null});
        this.props.navigation.navigate("FindParamedic")
    }

    render() {
        const { container, bottomButtons, loader, paramedicModal, showDetailStyle } = styles;
        const { loading, modal, paramedicDetails, makePath, arrived, image, eta } = this.state;
        const { latitude, longitude } = this.state.region;
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
               
                {(this.state.accepted === "Arrived") && 
                    Vibration.vibrate()}
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
                    {(this.state.markerIcon)?
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
                    {(arrived === true)? 
                        <Modal animationType="fade"   isVisible={arrived} onRequestClose={() => this.setState({arrived:false})}    
                        animationType="slide"
                        propagateSwipe
                        style={showDetailStyle}
                        hasBackdrop={false}
                        coverScreen={false}
                        >
                                    <Text style={{ color: '#A70A05', fontWeight:'bold', fontSize: 14}}>Paramedic Has Arrived</Text>
                                    <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                                    <Button
                                    icon="account-details" 
                                    mode="contained"
                                    theme={buttonTheme} 
                                    onPress={() => this.props.navigation.navigate('showDetails', {paramedicDetails: { 
                                        image:image, 
                                        pId: paramedicDetails.pId,
                                        firstName: paramedicDetails.firstName, 
                                        lastName: paramedicDetails.lastName, 
                                        phoneNo: paramedicDetails.phoneNo,
                                        cId: this.state.cId,
                                    }})}   
                                        >
                                                Details
                                    </Button>
                                    <Button 
                                    icon="call-missed" 
                                    mode="contained" 
                                    theme={buttonTheme}
                                    onPress={() => this.goBack()}>
                                                OK
                                    </Button>
                                    </View>
                        </Modal>
                        : null}
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
                    {(paramedicDetails !== null)?
                        <Modal animationType="fade"   isVisible={modal} onRequestClose={() => this.setState({modal:false})}    
                        animationType="slide"
                        propagateSwipe
                        style={paramedicModal}
                        hasBackdrop={false}
                        coverScreen={false}
                        >
                        <View style={{flexDirection:"column", width:'100%'}}>
                        
                            <View style={{flexDirection:"row", padding:20, width:'100%'}}>
                            <Image source={(this.state.image === null) ? require('../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + paramedicDetails.image}}  
                                style={{
                                    width: 70, height: 70, backgroundColor:'lightgrey', borderRadius: 70/2
                                }}  />
                            <View style={{flexDirection:"column", width:'100%'}}>
                                <View style={{flexDirection:'column', alignContent:"center"}}>
                                    <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 20 }}>
                                    {paramedicDetails.firstName} {paramedicDetails.lastName}
                                    </Text>
                                    <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 20 }}>{eta}</Text>  
                                    <Text style={{ color: '#A70A05',  fontSize: 14, marginLeft: 20 }}>{paramedicDetails.phoneNo}</Text>
                                </View>
                                </View>
                                </View> 
                                <View style={{flexDirection:'row', width:'100%', justifyContent:"space-evenly",paddingBottom:20}}>    
                                <Button
                                icon="phone" 
                                mode="contained"
                                theme={buttonTheme} 
                                onPress={() => Communications.phonecall(paramedicDetails.phoneNo,true)}   
                                    >Contact
                                </Button> 
                                <Button
                                icon="close-circle" 
                                mode="contained"
                                theme={buttonTheme} 
                                onPress={() => this.setState({modal:false})}   
                                    >Close
                                </Button>    
                                </View>   
                        </View>
                    </Modal>: null}

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