import React, { useState, useEffect } from 'react';
import {SafeAreaView, TouchableOpacity, Text, AsyncStorage, StyleSheet, ScrollView, Image, View } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { IconButton, Colors } from 'react-native-paper';

 const CustomDrawerContentComponent = (props) => {
     const [user, setUser] = useState({
         userType: '',
         image: null,
         firstName: '',
         lastName: ''
     });

     useEffect(() => {
        async function getUser() {
            const userData = await AsyncStorage.getItem('userData');
            var user = JSON.parse(userData);
            console.log(user);
            setUser(user);
        }
        getUser();
     }, []);

    return (
    <ScrollView>
        <SafeAreaView
          style={styles.container}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
            <View style={{
                borderBottomWidth: 1, 
                borderBottomColor: '#A70A05', 
                paddingBottom: 15,
                alignItems: "center", 
                justifyContent: "center"
                }}>
            {(user.userType === "Caller") && <TouchableOpacity onPress={() => props.navigation.navigate('Profile')} >          
                <Image source={(user.image === null) ? require('../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + user.image}} 
                    style={{
                        width: 100, height: 100, 
                        backgroundColor:'lightgrey', 
                        borderRadius: 50, 
                        alignItems: "center", 
                        justifyContent: "center",
                        alignSelf:"center",
                        marginTop: 20                    
                    }} 
                />
            </TouchableOpacity>                
            }
            {(user.userType === "Paramedic") && <TouchableOpacity onPress={() => props.navigation.navigate('DProfile')} >          
                <Image source={(user.image === null) ? require('../../assets/user.png') : {uri: 'data:image/jpeg;base64,' + user.image}} 
                    style={{
                        width: 100, height: 100, 
                        backgroundColor:'lightgrey', 
                        borderRadius: 50, 
                        alignItems: "center", 
                        justifyContent: "center",
                        alignSelf:"center",
                        marginTop: 20                    
                    }} 
                />
            </TouchableOpacity>                
            }     
            <Text style={{color: '#A70A05', fontWeight:"bold", fontSize: 12, paddingTop: 5}}>
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
            </Text>
            </View>           
        <DrawerItems {...props} />
        {(user.userType === "Caller") && 
        <TouchableOpacity
        style= {{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
           onPress={() => props.navigation.navigate('BecomeParamedic')}
          >
              <Image 
              source={require('../../assets/logo.png')} 
              style={{ width: 30, height: 30 }}
              />              
              <Text style={{marginLeft: 5, color: '#A70A05', fontWeight:"bold", fontSize: 15}}>
                  Become a Paramedic
              </Text>              
          </TouchableOpacity>}              
          {(user.userType === "Paramedic") && 
        <TouchableOpacity
        style= {{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
           onPress={() => props.navigation.navigate('FindParamedic')}
          >
              <Image 
              source={require('../../assets/ambulance.png')} 
              style={{ width: 30, height: 30 }}
              />              
              <Text style={{marginLeft: 5, color: '#A70A05', fontWeight:"bold", fontSize: 15}}>
                  Need Paramedic?
              </Text>
          </TouchableOpacity>}
          {/* <View  style= {{ width:'100%', left:"75%"}}>
          <IconButton 
            icon="arrow-left-thick" 
            size={50} 
            color={"#A70A05"} 
          /> 
          </View>  */}
        </SafeAreaView>
      </ScrollView>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
});

export default CustomDrawerContentComponent;