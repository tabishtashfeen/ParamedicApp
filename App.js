import React from 'react'
import {Image, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';

import SplashScreen from './src/components/Splash';

import RegisterScreen from './src/components/auth/Register';
import LoginScreen from './src/components/auth/Login';

import HomeScreen from './src/components/Home';
import ProfileScreen from './src/components/Profile';
import HelpScreen from './src/components/Help';
import FindScreen from './src/components/FindHospital';
import ShowDetailsScreen from './src/components/showDetails';
import BecomeParamedicScreen from './src/components/BecomeParamedic';
import findAmbulanceScreen from './src/components/findAmbulance';
import CustomDrawerContentComponent from './src/components/common/DrawerContent';

import ParamedicScreen from './src/components/Paramedic/ParamedicHome';
import ParamedicProfile from './src/components/Paramedic/ParamedicProfile';
import ShowDetailsParamedicScreen from './src/components/Paramedic/showDetails';
import ParamedicHelpScreen from './src/components/Paramedic/Help';
import FindParamedicScreen from './src/components/Paramedic/FindParamedic';
import ParaFindHospitalScreen from './src/components/Paramedic/ParaFindHospital';
import FindParamedicNextScreen from './src/components/Paramedic/FindParamedicNext';

const AuthNavigation = createDrawerNavigator({
  Splash: {
    screen: SplashScreen
  },
  Login: {
    screen: LoginScreen   
  },
  Register: {
    screen: RegisterScreen
  }
}, {
  initialRouteName: 'Splash',
  defaultNavigationOptions: {
    drawerLockMode:'locked-closed',
  }
});

const CallerStack = createStackNavigator({ 
  Home: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
        <Image       
        source={require('./src/assets/menu.png')}
        style={{ marginLeft:10 ,width: 28, height: 28 }}  />
        </TouchableOpacity>
      ), 
      animationTypeForReplace:"push",
    })
  },
  FindHospital: {
    screen: FindScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Hospitals',
      animationTypeForReplace:"push",
    })
  },
  showDetails: {
    screen: ShowDetailsScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Details',
      animationTypeForReplace:"push",
    }),
  },
  BecomeParamedic: {
    screen: BecomeParamedicScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Become Paramedic',
      animationTypeForReplace:"push",
    })
  },
  findAmbulance: {
    screen: findAmbulanceScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Finding Paramedic',
      animationTypeForReplace:"push",
    })
  }
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    headerTitleStyle: {
      color: 'white'
    },
    headerStyle: {
      backgroundColor: '#A70A05',
    },
   
  }),
})

const ParamedicStack = createStackNavigator({
  ParamedicHome: {
    screen: ParamedicScreen,    
    navigationOptions: ({navigation}) => ({
      title:'Home',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
        <Image       
        source={require('./src/assets/menu.png')}
        style={{ marginLeft:10 ,width: 28, height: 28 }}  />
        </TouchableOpacity>
      ), 
      animationTypeForReplace:"push",
    })
    },
  showDetails: {
    screen: ShowDetailsParamedicScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Details',
      animationTypeForReplace:"push",
    })
  },
  FindParamedic: {
    screen: FindParamedicScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Find Paramedic',
      animationTypeForReplace:"push",
    })
  },
  ParaFindHospital: {
    screen: ParaFindHospitalScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Find Hospital',
      animationTypeForReplace:"push",
    })
  },
  FindParamedicNext: {
    screen: FindParamedicNextScreen,
    navigationOptions: ({navigation}) => ({
      headerTintColor:'white',
      title:'Find Paramedic',
      animationTypeForReplace:"push",
    })
  }
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    headerTitleStyle: {
      color: 'white'
    },
    headerStyle: {
      backgroundColor: '#A70A05',
    }
  })
})

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        color: 'white'
      },
      headerStyle: {
        backgroundColor: '#A70A05',
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
        <Image       
        source={require('./src/assets/menu.png')} 
        style={{ marginLeft:10 ,width: 28, height: 28 }}  />
        </TouchableOpacity>
      )
    })
  })

  const ParamedicProfileStack = createStackNavigator(
    {
      DProfile: {
        screen: ParamedicProfile,
      },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        title:'Profile',
        headerTitleStyle: {
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#A70A05',
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
          <Image       
          source={require('./src/assets/menu.png')} 
          style={{ marginLeft:10 ,width: 28, height: 28 }}  />
          </TouchableOpacity>
        )
      })
    })

    const HelpStack = createStackNavigator(
      {
        Help: {
          screen: HelpScreen,
        },
      },
      {
        defaultNavigationOptions: ({ navigation }) => ({
          headerTitleStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#A70A05',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
            <Image       
            source={require('./src/assets/menu.png')} 
            style={{ marginLeft:10 ,width: 28, height: 28 }}  />
            </TouchableOpacity>
          )
        })
      })

      const ParamedicHelpStack = createStackNavigator(
        {
          Help: {
            screen: ParamedicHelpScreen,
          },
        },
        {
          defaultNavigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
              color: 'white'
            },
            headerStyle: {
              backgroundColor: '#A70A05',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
              <Image       
              source={require('./src/assets/menu.png')} 
              style={{ marginLeft:10 ,width: 28, height: 28 }}  />
              </TouchableOpacity>
            )
          })
        })

const CallerDrawer = createDrawerNavigator({  

  CallerHome: {
    screen: CallerStack,
    navigationOptions: {
      title: 'Home'
    }
  },
  Profile: {
    screen: ProfileStack,
  },
  Help: {
    screen: HelpStack,
  },
  Logout: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Log out'
    },
    
  }
}, 
{
  backBehavior:'initialRoute',
  contentOptions: {
    labelStyle: {
      color: '#A70A05'
    },
  },
  contentComponent: (props) => (
    <CustomDrawerContentComponent {...props} />
  )

})

const ParamedicDrawer = createDrawerNavigator({
  ParamedicHome: {
    screen: ParamedicStack,
    navigationOptions: {
      title: 'Home'
    }
  },
  DProfile: {
    screen: ParamedicProfileStack,
    navigationOptions:{
      title:'Profile'
    }
  },
  Help: {
    screen: ParamedicHelpStack
  },
  Logout: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Log out'
    }
  }
}, 
  {
  backBehavior:'initialRoute',
  contentOptions: {
    labelStyle: {
      color: '#A70A05'
    },
  },
  defaultNavigationOptions: ({ navigation }) => ({
    drawerLockMode:'unlocked'
  }),
  contentComponent: (props) => (
    <CustomDrawerContentComponent {...props} />
  )
})

const AppNavigator = createDrawerNavigator({
  Auth: {
    screen: AuthNavigation,
    navigationOptions:{
      drawerLockMode:'locked-closed',
      drawerLabel: () => null
    }
  },
  Caller: {
    screen: CallerDrawer,
    navigationOptions:{
      drawerLockMode:'unlocked',
    }
  },
  Paramedic: {
    screen: ParamedicDrawer,
    navigationOptions:{
      drawerLockMode:'unlocked',
    }
  }
})

export default createAppContainer(AppNavigator);
