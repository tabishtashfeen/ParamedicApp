import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Dimensions} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Modal from 'react-native-modal';

export default class FindHospital extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cId: this.props.navigation.getParam('paramedicDetails').cId,
            firstName: this.props.navigation.getParam('paramedicDetails').firstName,
            lastName: this.props.navigation.getParam('paramedicDetails').lastName,
            phoneNo: this.props.navigation.getParam('paramedicDetails').phoneNo,
            image: this.props.navigation.getParam('paramedicDetails').image,
            button: true,
            modal: false
        };
    }
    
  componentDidMount() {
                    
    }

    componentWillUnmount() {

    }
    handleBackButtonClick() {

    }
    onButtonPress(){
        fetch(`http://192.168.10.10/Paramedic/api/api/ReportCaller?cId=${this.state.cId}`)
        .then(res => res.json())
        .then(res => {
            this.setState({button:true, modal:false})
        })
        .catch()
    }
    render() {
        const { container, bottomButtons } = styles;
        const { firstName, lastName, phoneNo, image, modal, button} = this.state;
        
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />                
                <Image source={(this.state.image === null) ? require('../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + image}}  style={{
                                width: 100, height: 100, backgroundColor:'lightgrey', borderRadius: 100/2
                                }}  />
                <View style={{flexDirection:'row'}}>
                <TextInput
                    label='First Name'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '39%',                    
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: '#A70A05'}
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
                        colors: { primary: '#A70A05', underlineColor: '#A70A05'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={lastName}
                    disabled
                /></View> 
                <TextInput
                    label='Phone No.'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',                    
                    }}
                    theme={{
                        colors: { primary: '#A70A05', underlineColor: '#A70A05'}
                    }}                    
                    selectionColor='#A70A05'
                    underlineColor='#A70A05'
                    value={phoneNo}
                    disabled
                    />
                        <View style={{paddingTop:10}}>
                        {(button)?<Button
                        theme={{
                        colors: { primary: '#A70A05', underlineColor: 'black' }
                            }}
                            mode='contained'
                            onPress={() => this.setState({modal:true,button:false})}
                        >
                            Report
                        </Button>:null}
                        

                </View>     
                     <Modal animationType="fade"   isVisible={modal} onRequestClose={() => this.setState({modal:false})}    
                        animationType="slide"
                        propagateSwipe
                        style={bottomButtons}
                        hasBackdrop={false}
                        coverScreen={false}
                        >
                        <View >
                            <View style={{padding:10, alignItems:"center"}}>
                                <Text style={{color: "#A70A05", fontWeight:'bold'}}>
                                Tap Confirm To Report The Caller
                                </Text>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"space-evenly", width: '100%'}}>
                                <Button
                                icon="directions" 
                                mode="contained"
                                theme={buttonTheme} 
                                onPress={() => this.onButtonPress()}>
                                            Confirm
                                </Button>
                                <Button 
                                icon="close-circle" 
                                mode="contained" 
                                theme={buttonTheme} 
                                onPress={() => this.setState({modal:false,button:true})}>
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
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'space-between'
    }, bottomButtons: {
        width: Dimensions.get('screen').width * .85,
        position: 'absolute',
        bottom: Dimensions.get('window').height * .0,
        left: Dimensions.get('screen').width * .025,
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
        justifyContent: "space-evenly",
        alignItems: 'center',
    }
    
})