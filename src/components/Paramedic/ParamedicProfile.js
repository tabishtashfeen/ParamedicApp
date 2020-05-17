import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ImageBackground, AsyncStorage,Dimensions, Image} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';

const options = {
    title: 'Select Photo',
    takePhotoButtonTitle: "Camera",
    chooseFromLibraryButtonTitle: 'Library'
  };

export default class ParamedicProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNo: '',
            password: '',
            image: '',
            updated: false,
            user: { }
        }
    }

    async componentDidMount() {
        var userData = await AsyncStorage.getItem('userData');
        var user = JSON.parse(userData);
        if(user) {
            this.setState({ user,
                email:user.email,
                password:user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNo: user.phoneNo,
                image: user.image,
                userType: user.userType
            })
        }
    }

    async onButtonPress(){
        var userData = await AsyncStorage.getItem('userData');
        var userID = JSON.parse(userData);
        
        if (this.state.password==='') {
            alert('Password cannot be empty.')
        } else if (this.state.phoneNo==='') {
            alert('You must enter Phone Number.')
        } else {            
                let user = {
                    phoneNo: this.state.phoneNo,
                    image: this.state.image
                }
                fetch(`http://192.168.10.7/Paramedic/api/EditParamedicProfile?id=${userID.pId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                .then(res => res.json())
                .then((res) => {
                    this.setState({updated: true})
                    userData={
                        phoneNo: this.state.phoneNo,
                        image: this.state.image
                    }       
                        
                })
                .catch(err => {
                    console.log(err)
                    this.setState({error:'Profile Cannot be Updated'})
                })
            }           

    }

    pickImage () {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
             this.setState({
                image: response.data
              });
            }
          });
    }

    render() {
        const { container,modalStyle } = styles;
        const { modal } = this.state;
        return (
            <KeyboardAvoidingView style={container}>
            <TouchableOpacity onPress={()=> this.pickImage()}>
                <Image source={(this.state.image === null) ? require('../assets/../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + this.state.image}} style={{
                    width: 100, height: 100,backgroundColor:'lightgrey', borderRadius: 50
                     }} 
                    />
                </TouchableOpacity>
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
                    value={this.state.firstName}
                    onChangeText={firstName => this.setState({ firstName })}
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
                    value={this.state.lastName}
                    onChangeText={lastName => this.setState({ lastName })}
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
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
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
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
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
                    value={this.state.phoneNo}
                    onChangeText={phoneNo => this.setState({ phoneNo })}
                    
                    />
                <View style={{paddingTop:10}}>
                <Button
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black' }
                    }}
                    mode='contained'
                    onPress={() => this.onButtonPress()}
                >
                    Update
                </Button>
                </View>     
                <Modal animationType="fade"   isVisible={this.state.updated} onRequestClose={() => this.setState({updated:false})}    
                    animationType="slide"
                    propagateSwipe
                    style={styles.showDetailStyle}
                    hasBackdrop={false}
                    coverScreen={false}
                    >
                                <Text style={{ color: '#A70A05', fontWeight:'bold', fontSize: 14}}>Profile Updated</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                                <Button 
                                icon="call-missed" 
                                mode="contained" 
                                theme={buttonTheme}
                                onPress={() => this.setState({updated: false})}>
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
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'space-between'

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