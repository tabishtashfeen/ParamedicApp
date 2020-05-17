import {BackHandler} from 'react-native';
import {Alert} from 'react-native';
const exitAlert = () => {
    Alert.alert(
      'Confirm exit',
      'Do you want to quit the app?',
      [
        {text: 'CANCEL', style: 'cancel'},
        {text: 'OK', onPress: () => BackHandler.exitApp()}
      ]
    );
  };
  export {exitAlert};