import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ImageBackground, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modal'
import { TextInput, Button } from 'react-native-paper';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName:'',
            lastName:'',
            email: '',
            phoneNo:'',
            password: '',
            error:'',
            registered: false,
            loading:false
        }
    }

    componentDidMount() {

    }

    onButtonPress(){
        if (this.state.firstName==='') {
            alert('First Name field should not be empty.')
        } else if (this.state.lastName==='') {
            alert('Last Name field should not be empty.')
        } else if (this.state.email==='') {
            alert('Email field should not be empty.')
        } else if (this.state.phoneNo==='') {
            alert('Phone Number field should not be empty.')
        } else if (this.state.password==='') {
            alert('Password field should not be empty.')
        } else if (this.state.password.length < 8 ){
            alert('Length of Password must be atleast 8 Characters.')
        } else {
            let credentials = {
                user:{
                    id:0,
                    email: this.state.email,
                    password: this.state.password,
                    userType: "Caller",
                },
                caller:{
                    cId: 0,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNo: this.state.phoneNo,
                    image: null
                }
                            
            }
            fetch(`http://192.168.10.2/Paramedic/api/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(credentials)
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if(res === "AlreadyExisted"){
                    alert("Account on Already Exist on this Email!");
                }else {
                    this.setState({
                        registered:true
                    })
                }                
            })
            .catch(err => {
                console.log(err)
                this.setState({error:'Registering Failed'})
            })
        }       
    }

    render() {
        const { container } = styles;
        return (
            <KeyboardAvoidingView style={container}>
                <ImageBackground source={require('../../assets/logo.png')} style={{ width: 200, height: (Platform.OS === "ios") ? 200 : 170 }} />
                <Text style={{
                    fontSize: (Platform.OS === "ios") ? 30 : 25,
                    fontWeight: '900',
                    color: '#A70A05'
                }}>PARAMEDIC</Text>
                <View style={{flexDirection:'row', }}>
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
                    value={this.state.firstName}
                    onChangeText={firstName => this.setState({ firstName })}
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
                    value={this.state.lastName}
                    onChangeText={lastName => this.setState({ lastName })}
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
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                />
                <TextInput
                    label='Phone No.'
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
                    keyboardType='phone-pad'
                    value={this.state.phoneNo}
                    onChangeText={phoneNo => this.setState({ phoneNo })}
                    
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
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}
                />
                <View style={{paddingTop:10}}>
                    <Text style={{ 
                        color: 'red', 
                        alignSelf: 'center', 
                        fontSize: 18 }}>
                        {this.state.error}
                    </Text>
                <Button
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black' }
                    }}
                    mode='contained'
                    onPress={() => this.onButtonPress()}
                >
                    Register
                </Button>
                </View>
                <TouchableOpacity
                style={{paddingTop: (Platform.OS === "ios") ? 10 : 5}}
                 onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={{ color: '#A70A05'}}>
                        Already have an account?
                    </Text>
                </TouchableOpacity>
                <Modal animationType="fade"   isVisible={this.state.registered} onRequestClose={() => this.setState({registered:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={styles.showDetailStyle}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                                <Text style={{ color: '#A70A05', fontWeight:'bold', fontSize: 14}}>Account Registered</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                                <Button 
                                icon="call-missed" 
                                mode="contained" 
                                theme={buttonTheme}
                                onPress={() => this.props.navigation.navigate('Login')}>
                                            OK
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
})