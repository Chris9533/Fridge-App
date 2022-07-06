import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import * as React from 'react';
import { Button, Text, TextInput, ImageBackground, StyleSheet, View } from 'react-native';
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase';
import { Input, Icon, Stack, Center, NativeBaseProvider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function CreateAccount() {

  const image = {uri : "https://media.istockphoto.com/photos/healthy-fresh-rainbow-colored-fruits-and-vegetables-background-picture-id1208790371?k=20&m=1208790371&s=612x612&w=0&h=6BngNrl8TColGkvSGJUKFKIM5bv31Nc8MvQhmmC2LlM="}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center"
    },
    text: {
      color: "white",
      fontSize: 42,
      lineHeight: 84,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "#000000c0"
    }
  })

const [email, setEmail] = React.useState('')
const [password, setPassword] = React.useState('')
const [confirmPassword, setConfirmPassword] = React.useState("")
const [emailError, setEmailError] = React.useState(false)
const [passwordError, setPasswordError] = React.useState(false)
const [passwordMatch, setPasswordMatch] = React.useState(false)
const [existingEmail, setExistingEmail] = React.useState(false)
const [show, setShow] = React.useState(false);

   
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
    <View style={styles.container}>
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
  <NativeBaseProvider>
              <Center flex={1} px="3">
  <Stack space={4} w="100%" alignItems="center">
  <Input 
  backgroundColor="primary.50"
  w={{
  base: "75%",
  md: "25%"
  }} InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="primary.600" />} placeholder="Email" onChangeText={newText => {setEmail(newText); setEmailError(false)}}  />
  {emailError && <Text>Invalid Email</Text>}
  {existingEmail && <Text>Account already exists</Text>}
  <Input 
  backgroundColor="primary.50"
  w={{
  base: "75%",
  md: "25%"
  }} type={show ? "text" : "password"} InputRightElement={<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.600" onPress={() => setShow(!show)} />} placeholder="Password" onChangeText={newText => {setPassword(newText); setPasswordError(false)}} />
  <Input
  backgroundColor="primary.50"
   w={{
  base: "75%",
  md: "25%"
  }} type={show ? "text" : "password"} InputRightElement={<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.600" onPress={() => setShow(!show)} />} placeholder="Confirm Password" onChangeText={newText => {setConfirmPassword(newText)}} />
  {passwordError && <Text>Password must be 6 characters</Text>}
  {passwordMatch && <Text>Passwords must match</Text>}
  <Button
  onPress={() => {handleCreateAccount()}}
  title="Create Account"
  color="#841584"
  accessibilityLabel="Create account button"
/>
  </Stack>
  </Center>
            </NativeBaseProvider>
            </ImageBackground>
  </View>
            </>);

}