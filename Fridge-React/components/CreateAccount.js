import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import * as React from 'react';
import { Button, Text, TextInput } from 'react-native';
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase';

export default function CreateAccount() {

const [email, setEmail] = React.useState('')
const [password, setPassword] = React.useState('')
const [confirmPassword, setConfirmPassword] = React.useState("")
const [emailError, setEmailError] = React.useState(false)
const [passwordError, setPasswordError] = React.useState(false)
const [passwordMatch, setPasswordMatch] = React.useState(false)
const [existingEmail, setExistingEmail] = React.useState(false)

   
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();


  function handleCreateAccount() {

    if (confirmPassword === password) {
        setPasswordMatch(false)
        createUserWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
         // Signed in 
         console.log('here')
         const user = userCredential.user;
        const scoreRef = doc(db, auth.currentUser.uid, "score")
        setDoc(scoreRef, {"score": 0})
         // ...
       })
       .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode)
         if (errorCode === "auth/weak-password") {
            setPasswordError(true)
         } else {
            setPasswordError(false)
         }
         if (errorCode === "auth/invalid-email") {
            setEmailError(true);
         } else {
            setEmailError(false);
         }
         if (errorCode === "auth/email-already-in-use") {
            setExistingEmail(true)
         } else {
            setExistingEmail(false)
         }
         // ..
       });


    } else {
        setPasswordMatch(true)
    }


  }


    return (
        <>
        <TextInput
        style={{height: 40, marginTop: 15,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: 'grey',
            padding: 10,
            fontSize: 20}}
        placeholder="Email"
        onChangeText={newText => {setEmail(newText)}}
        defaultValue={""}
      />
      {emailError && <Text>Invalid Email</Text>}
      {existingEmail && <Text>Account already exists</Text>}
      <TextInput
        style={{height: 40, marginTop: 15,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: 'grey',
            padding: 10,
            fontSize: 20}}
        placeholder="Password"
        onChangeText={newText => {setPassword(newText)}}
        secureTextEntry={true}
        defaultValue={""}
      />
     
      <TextInput
        style={{height: 40, marginTop: 15,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: 'grey',
            padding: 10,
            fontSize: 20}}
        placeholder="Confirm Password"
        onChangeText={newText => {setConfirmPassword(newText)}}
        secureTextEntry={true}
        defaultValue={""}
      />
      {passwordError && <Text>Password must be 6 characters</Text>}
      {passwordMatch && <Text>Passwords must match</Text>}
      <Button
  onPress={() => {handleCreateAccount()}}
  title="Create Account"
  color="#841584"
  accessibilityLabel="Create account button"
/>
      </>
    )
}