import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBdryTcrd1rm4gvzeTUaan7GphLBMPrxQM",
  authDomain: "gotovo-8c9c2.firebaseapp.com",
  databaseURL: "https://gotovo-8c9c2.firebaseio.com",
  projectId: "gotovo-8c9c2",
  storageBucket: "gotovo-8c9c2.appspot.com",
  messagingSenderId: "308526945838",
  appId: "1:308526945838:web:96a0df09cfae6d0fe431bf",
  measurementId: "G-WYLWWHDH96"
}

firebase.initializeApp(firebaseConfig)

const fb = firebase
export default fb
