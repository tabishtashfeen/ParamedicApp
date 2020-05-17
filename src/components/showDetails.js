import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, Image, Dimensions} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Modal from 'react-native-modal';

export default class FindHospital extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pId: this.props.navigation.getParam('paramedicDetails').pId,
            cId: this.props.navigation.getParam('paramedicDetails').cId,
            firstName: this.props.navigation.getParam('paramedicDetails').firstName,
            lastName: this.props.navigation.getParam('paramedicDetails').lastName,
            phoneNo: this.props.navigation.getParam('paramedicDetails').phoneNo,
            image: this.props.navigation.getParam('paramedicDetails').image,
            complaint: null,
            button: true,
            modal: false
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
  componentDidMount() {
                    
    }

    componentWillUnmount() {

    }
    handleBackButtonClick() {

    }
    onButtonPress(){
        fetch(`http://192.168.10.2/Paramedic/api/Filecomplaint?cId=${this.state.cId}&pId=${this.state.pId}&complaint=${this.state.complaint}`)
        .then(res => res.json())
        .then(res => {
            this.setState({button:true,modal:false})
        })
        .catch()
    }
    render() {
        const { container, bottomButtons } = styles;
        const { firstName, lastName, phoneNo, image, modal, button, complaint} = this.state;
        
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />                
                <Image source={(this.state.image === '') ? require('../assets/user.png') : {uri: 'data:image/jpeg;base64,' + image}}  style={{
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
                            File Complaint
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
                            <View style={{padding:10}}>
                            <TextInput
                                label='Complaint'
                                mode='outlined'
                                style={{
                                    height: 80,
                                    width: '100%', 
                                    marginLeft: '2%',
                                    marginRight: '2%',                   
                                }}
                                theme={{
                                    colors: { primary: '#A70A05', underlineColor: '#A70A05'}
                                }}                    
                                selectionColor='#A70A05'
                                underlineColor='#A70A05'
                                value={complaint}
                                onChangeText={complaint => this.setState({ complaint })}
                            />
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
    }
    
})