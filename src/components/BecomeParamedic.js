import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ImageBackground, Platform, AsyncStorage, Image, Alert, Dimensions } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Modal from 'react-native-modal';

export default class BecomeParamedic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requestFailed: false,
            confirm: false,
            details: { }
        }             
    }

    async componentDidMount() {
        var userData = await AsyncStorage.getItem('userData');
        var user = JSON.parse(userData);
        console.log(user)
        if(user) {
            this.setState({ 
                details : user
            })
        }
    }

    onButtonPress(){
        fetch(`http://192.168.10.2/Paramedic/api/BecomeParamedic?id=${this.state.details.cId}`)
        .then(res => res.json)
        .then(res => {
            console.log(res);
            if(res)
            {
                this.props.navigation.navigate('Login')
            }
            else
            {
                this.setState({
                    requestFailed: true
                })
            }
            
        })
    }

    render() {
        const { container, confirmModal } = styles;
        const { requestFailed, confirm} = this.state;
        const { email, password, firstName, lastName, phoneNo, image } = this.state.details;
        return (
            <KeyboardAvoidingView style={container}>                      
                <Image source={(image === null) ? require('../assets/user.png') : {uri: 'data:image/jpeg;base64,' + image}} style={{
                    width: 100, height: 100,backgroundColor:'lightgrey', borderRadius: 50
                     }} 
                    />                
                <View style={{flexDirection:'row'}}>
                <TextInput
                    label='First Name'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '39%',                    
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={firstName}
                    disabled={true}
                />
                <TextInput
                    label='Last Name'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '39%', 
                        marginLeft: '2%'                   
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={lastName}
                    disabled
                /></View>
                <TextInput
                    label='Email'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',                    
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={email}
                    disabled
                />
                <TextInput
                    label='Password'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',                    
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={password}
                    disabled
                />
                <TextInput
                    label='Phone No.'
                    mode='outlined'
                    keyboardType="phone-pad"
                    style={{
                        height: 40,
                        width: '80%',                    
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={phoneNo}
                    disabled
                    />
                <View style={{paddingTop:10}}>
                <Button
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black' }
                    }}
                    mode='contained'
                    onPress={() => this.setState({confirm: true})}
                >
                    Confirm
                </Button>
                {(requestFailed)?
                    Alert.alert(
                    "Request Failed",
                    "Try Again",
                    [
                        { 
                            text: "OK"
                        }
                    ],
                    { cancelable: false })
                    :null}
                </View>
                <Modal animationType="fade"   isVisible={confirm} onRequestClose={() => this.setState({confirm:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={confirmModal}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                                <Text style={{ color: '#A70A05', fontWeight:'bold', fontSize: 14}}>Are You Sure?</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                                <Button
                                icon="call-missed" 
                                mode="contained"
                                theme={buttonTheme} 
                                onPress={() => this.onButtonPress()}   
                                    >
                                            Yes
                                </Button>
                                <Button 
                                icon="close-circle" 
                                mode="contained" 
                                theme={buttonTheme}
                                onPress={() => this.setState({confirm:false})}>
                                            No
                                </Button>
                                </View>
                    </Modal>
            </KeyboardAvoidingView>
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
    confirmModal: {
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
})