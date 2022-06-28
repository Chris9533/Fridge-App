import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LoginScreen, { SocialButton } from "react-native-login-screen";
import CreateAccount from './CreateAccount';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LogIn({navigation}, event) {

const [email, setEmail] = React.useState('')
// console.log(email, "<<< email");

// const auth = getAuth();
// signInWithEmailAndPassword(auth, "mj@emailwebsite.com", "password123")
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });


const handleLogIn = () => {
    
}

const handleFacebook = () => {
    console.log('Facebook');
}

function handleEmail(newText) {
setEmail((currText) => {return currText + newText })
}


    return (
//         <ScrollView>
// <LoginScreen
//   logoImageSource={require("../assets/icon.png")}
// onLoginPress={() => {handleLogIn()}}
// onSignupPress={() => {navigation.navigate('Create Account')}}
// onEmailChange={console.log}
// onPasswordChange={() => {}}
// onFacebookPress={() => {handleFacebook()}}
// />
// </ScrollView>
<>
<Text>Hello</Text>
<TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={newText => setText(newText)}
        defaultValue={""}
      />
      </>

    )
}