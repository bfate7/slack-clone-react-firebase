import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWowi1Vha4Wqzcb_3X0TC2FlfRi4xaGUQ",
  authDomain: "react-slack-clone-b4791.firebaseapp.com",
  databaseURL: "https://react-slack-clone-b4791.firebaseio.com",
  projectId: "react-slack-clone-b4791",
  storageBucket: "react-slack-clone-b4791.appspot.com",
  messagingSenderId: "713919513877",
  appId: "1:713919513877:web:36dee2a79fd58e0f90551c",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
