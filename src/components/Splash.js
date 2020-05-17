import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  ProgressBarAndroid,
  ProgressViewIOS,
  AsyncStorage
} from 'react-native';
import * as Progress from 'react-native-progress';

class StartupScreen extends Component {

  static navigationOptions = {
    drawerLabel: () => null
  }

  constructor(props){
    super(props)
    this.state = { progressValue: 0.00 };    
  }  

   componentDidMount() {    
     this.startProgress();
  }

  componentWillUnmount() {
    this.stopProgress();
  }

  startProgress = () => {
    
    this.value = setInterval(async () => {
      if (this.state.progressValue <= 1) {
        this.setState({ progressValue: this.state.progressValue + .05 })
      }
      else {
        clearInterval(this.value);
        this.clearProgress()
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const driver = JSON.parse(userData);            
            if (driver.userType==='Paramedic'){
              this.props.navigation.navigate('ParamedicHome');
            } else if (driver.userType==='Caller'){
              this.props.navigation.navigate('Home');
            }
        } 
        else {
          this.props.navigation.navigate('Login');
        }            
      }        
    }, 100);
  }

  stopProgress = () => {
    clearInterval(this.value);
  }

  clearProgress = () => {
    this.setState({ progressValue: 0.0 })
  }

  render() {
    return (
      <View  style={styles.container}>
        <ImageBackground source={require('../assets/logo.png')} style={{ width: 200, height: 200 }} />
                <Text style={{
                    fontSize: 30,
                    fontWeight: '900',
                    color: '#A70A05'
                }}>PARAMEDIC</Text>
        <View style={{width: '100%', alignItems:'center', marginTop: 20}}>
        <Progress.Bar 
        unfilledColor='white'
        borderColor='white'        
        color="#A70A05"        
        progress={this.state.progressValue} 
        />
        </View>                
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {    
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white'
  },
  progressBarStyle: {
    width: '80%',

    color: 'white'
  }
});

export default StartupScreen;
