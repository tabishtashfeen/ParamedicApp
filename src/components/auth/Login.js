import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ImageBackground, ActivityIndicator, AsyncStorage, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from "../common/handleAndroidBackButton";
import {exitAlert} from '../common/exitAlert';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'ubaid@gmail.com',
            password: 'asdf1234',
            error: '',
            loading: false
        }
    }

    componentDidMount() {
        AsyncStorage.removeItem('userData');
        handleAndroidBackButton(exitAlert);
    }
    

    alertLogin()
    {
        AsyncStorage.removeItem('userData')
        Alert.alert (
            "Login Failed",
            "Your Account is Banned",
            [
                { 
                    text: "OK"
                }
            ],
            { cancelable: false }
        )
    }

    pending()
    {
        AsyncStorage.removeItem('userData')
        Alert.alert (
            "Application Pending",
            "If Application is not Accepted within the next 24 hour, Please Contact Administration",
            [
                { text: "OK"
            }
            ],
            { cancelable: false }
        )
    }

    onButtonPress() {
        const { email, password } = this.state;        
        var userData = null;

        this.setState({
            error: '',
            loading: true
        })
        fetch(`http://192.168.10.2/Paramedic/api/Login?email=${email}&password=${password}`)
        .then((res) => res.json())
        .then(async resJSON => {
            this.setState({
                loading:false
            });
            if(resJSON!==null){
                
                if(resJSON.userType==='Paramedic'){
                    userData = resJSON
                    await AsyncStorage.setItem('userData',JSON.stringify(userData)) 
                    this.props.navigation.navigate('Paramedic');
                } else if (resJSON.userType==='Caller')
                    {
                        userData = resJSON
                await AsyncStorage.setItem('userData',JSON.stringify(userData)) 
                        if(userData.NOC <= 3)
                            this.props.navigation.navigate('Home');
                        else
                        {
                            this.alertLogin();
                        }    
                } else if (resJSON.userType==='Pending'){
                    this.pending();
                    }                    
                } else {    
                    this.setState({error:'Incorrect Email or Password.', loading: false});
                    alert("Incorrect Email or Password");

                }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        const { container } = styles;
        return (
            <KeyboardAvoidingView style={container}>
                <ImageBackground source={require('../../assets/logo.png')} style={{ width: 200, height: 200 }} />
                <Text style={{
                    fontSize: 30,
                    fontWeight: '900',
                    color: '#A70A05'
                }}>PARAMEDIC</Text>
                <TextInput
                    label='Email'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black' }
                    }}
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                />
                <TextInput
                    label='Password'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black' }
                    }}
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}
                />
                <View style={{ paddingTop: 10 }}>

                    <Text style={{ color: 'red', alignSelf: 'center', fontSize: 18 }}>
                        {this.state.error}
                    </Text>
                    {                        
                        (this.state.loading) ?
                            <ActivityIndicator size="small" color="#A70A05"/> :
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={() => this.onButtonPress()}
                            >
                                <Text style={styles.textStyle}>
                                    {'login'.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                    }

                </View>
                <TouchableOpacity
                    style={{ paddingTop: 10 }}
                    onPress={() => this.props.navigation.navigate('Register')}>
                    <Text style={{ color: '#A70A05' }}>
                        Don't have an account?
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonStyle: {
        backgroundColor: '#A70A05',
        height: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#A70A05',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    textStyle: {
        color: 'white'
    }
})