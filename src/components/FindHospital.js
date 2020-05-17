import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Modal from 'react-native-modal';
import Geolocation from 'react-native-geolocation-service';

export default class FindHospital extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: this.props.navigation.getParam('location').latitude,
                longitude: this.props.navigation.getParam('location').longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,                
              },
            destination: {
                latitudeD:'',
                longitudeD:''
            },              
            places: [],
            markers: [],
            hospitalName:'',
            hospitalAddress:'',
            hospitalPhone:'',
            makePath: false,
            modal:false,
            selectedHospital: '',
            checkAlert: '',
            loading: true
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
    async componentDidMount() {
                    let places = []
                    let markers = []
                    let region = { 
                        latitude:'',
                        longitude:''
                    }
                    var key = 'AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                   
                    // Geolocation.getCurrentPosition((position) => {
                    //     let lat = parseFloat(position.coords.latitude)
                    //     let long = parseFloat(position.coords.longitude)
                        region = {
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,   
                        }
                        this.setState({region: region})                                        
                    //   },
                    //   (error) => alert(JSON.stringify(error)),
                    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

                    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=hospitals&location=${region.latitude},${region.longitude}&radius=200`)
                    .then((response) => response.json())
                    .then(res => {                        
                      places=res.predictions;
                      places.forEach(place => {
                        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=${key}`)
                    .then((r) => r.json())
                        .then(re => {
                            markers.push({
                                latitude: re.result.geometry.location.lat,
                                longitude: re.result.geometry.location.lng,
                                hospitalName: re.result.name,
                                hospitalAddress: re.result.formatted_address,
                                hospitalPhone: re.result.formatted_phone_number
                            })
                            this.setState({
                                markers,
                                loading:false
                            })
                        })

                    })
                    })
                
    }

    componentWillUnmount() {

    }
    handleBackButtonClick() {

    }
    
    onRegionChange(region) {
        region => this.setState({ region });
    }

    render() {
        const { container, bottomButtons, modalButton, modalStyle, loader } = styles;
        const { markers, modal, hospitalName, hospitalAddress, hospitalPhone, loading} = this.state;
        const { latitude, longitude } = this.state.region;
        const { latitudeD, longitudeD } = this.state.destination;
        
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />                
                
                <MapView
                    style={{
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width
                    }}
                    initialRegion={this.state.region}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    showsUserLocation
                >                   
                    {(this.state.makePath) ? 
                    <PolylineDirection 
                    origin = {{ latitude: latitude, longitude: longitude }}
                    destination = {{ latitude: latitudeD, longitude: longitudeD }}
                    apiKey='AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                    strokeWidth={4}
                    strokeColor="#A70A05"
                    /> : null}
                    {
                        markers.map((marker, index) =>  
                            <Marker key={index} coordinate={{latitude: marker.latitude, longitude: marker.longitude }} 
                                onPress={()=> this.setState({
                                    makePath: (this.state.selectedHospital === index) ? true : false,
                                    modal:true,
                                    destination: {
                                    latitudeD: marker.latitude, longitudeD: marker.longitude},
                                    hospitalName: marker.hospitalName,
                                    hospitalAddress: marker.hospitalAddress,
                                    hospitalPhone: marker.hospitalPhone,
                                    selectedHospital: index,
                                })} 
                            >
                            <Image source={require('../assets/hMarker.png')} style={{height: 35, width:35 }} /> 
                            </Marker>
                            
                            )
                    }
                    
                    </MapView>
                    <Modal animationType="fade"   isVisible={loading} onRequestClose={() => this.setState({loading:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={loader}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                    <ActivityIndicator size="large" color="#A70A05" />
                    <Text style={{ color: '#A70A05',  fontSize: 12 }}>Finding Hospitals </Text>
                    </Modal>
                    <Modal animationType="fade"   isVisible={modal} onRequestClose={() => this.setState({modal:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={bottomButtons}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                        <View >
                            <View style={{padding:10}}>
                                <View style={{flexDirection:"row",paddingLeft:20}}>
                                <Image source={require('../assets/hospital.png') } style={{
                                    width: 40, height: 40,backgroundColor:'lightgrey', borderRadius: 20
                                    }}  />
                                <Text style={{ color: '#A70A05', fontWeight: 'bold', fontSize: 14, marginLeft: 20 }}>{hospitalName}</Text>      
                                </View>
                                <View style={{paddingLeft:60}}>
                               <Text style={{ color: '#A70A05',  fontSize: 14, marginLeft: 20 }}>{hospitalAddress}</Text>      
                               <Text style={{ color: '#A70A05',  fontSize: 14, marginLeft: 20 }}>{hospitalPhone}</Text>      
                                </View>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"space-evenly", width: '100%'}}>
                                <Button 
                                icon="directions" 
                                mode="contained"
                                disabled={this.state.makePath}
                                theme={buttonTheme} 
                                onPress={() => this.setState({makePath:true, checkAlert:true})}>
                                            Show Route
                                </Button>
                                <Button 
                                icon="close-circle" 
                                mode="contained" 
                                theme={buttonTheme} 
                                
                                onPress={() => this.setState({modal:false, selectedHospital: null, makePath:false})}>
                                            Cancel
                                </Button>    
                            </View> 

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
    bottomButtons: {
        width: Dimensions.get('screen').width * .85,
        position: 'absolute',
        bottom: Dimensions.get('window').height * .04,
        left: Dimensions.get('screen').width * .025,
        backgroundColor: 'white',
        height: 200,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 2
        },
        elevation:4,
        shadowOpacity: 0.5,
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    modalButton:{
        flexDirection:'row',
        justifyContent:'space-around',
        padding:10
    },
    modalStyle: {
        position: 'absolute',
        bottom: 2,
        backgroundColor: 'white',
        width: Dimensions.get('screen').width
    }
})