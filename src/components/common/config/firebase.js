import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA3OY82SIviQKgIxcCfJOLzsWzvb35uCPM",
    authDomain: "paramedic-6a611.firebaseapp.com",
    databaseURL: "https://paramedic-6a611.firebaseio.com",
    projectId: "paramedic-6a611",
    storageBucket: "paramedic-6a611.appspot.com",
    messagingSenderId: "583834310901",
    appId: "1:583834310901:web:3c23880bdfa4ea04db4dbc",
    measurementId: "G-BTP2374SYG"
};

if (!firebase.apps.length){
    firebase.initializeApp(config);
}

export default firebase;