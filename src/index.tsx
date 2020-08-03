import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyBdryTcrd1rm4gvzeTUaan7GphLBMPrxQM",
  authDomain: "gotovo-8c9c2.firebaseapp.com",
  databaseURL: "https://gotovo-8c9c2.firebaseio.com",
  projectId: "gotovo-8c9c2",
  storageBucket: "gotovo-8c9c2.appspot.com",
  messagingSenderId: "308526945838",
  appId: "1:308526945838:web:96a0df09cfae6d0fe431bf",
  measurementId: "G-WYLWWHDH96"
}

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
