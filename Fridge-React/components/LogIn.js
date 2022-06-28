import * as React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LoginScreen, { SocialButton } from "react-native-login-screen";
import CreateAccount from './CreateAccount';

export default function LogIn({navigation}, event) {

const [email, setEmail] = React.useState('')
console.log(email, "<<< email");


const handleLogIn = () => {
    console.log('Log In');
}

const handleFacebook = () => {
    console.log('Facebook');
}

function handleEmail(newText) {
setEmail((currText) => {return currText + newText })
}


    return (
        <ScrollView>
<LoginScreen
  logoImageSource={require("../assets/icon.png")}
onLoginPress={() => {handleLogIn()}}
onSignupPress={() => {navigation.navigate('Create Account')}}
onEmailChange={(email: string) => {handleEmail}}
onPasswordChange={() => {}}
onFacebookPress={() => {handleFacebook()}}
/>
</ScrollView>
    )
}