import * as React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function LogIn({navigation}) {

    const auth = getAuth();

const [email, setEmail] = React.useState('')
const [password, setPassword] = React.useState('')
const [emailError, setEmailError] = React.useState(false)
const [passwordError, setPasswordError] = React.useState(false)







const handleLogIn = () => {
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
   
    const user = userCredential.user;
 
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === "auth/wrong-password") {
        setPasswordError(true);
    }

    if (errorCode === "auth/user-not-found" || errorCode === "auth/invalid-email" ) {
        setEmailError(true)
    }
    
  });
    
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
        onChangeText={newText => {setEmail(newText); setEmailError(false)}}
        defaultValue={""}
      />
{emailError && <Text>Invalid Email</Text>}

<TextInput
        style={{height: 40, marginTop: 15,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: 'grey',
            padding: 10,
            fontSize: 20}}
        placeholder="Password"
        onChangeText={newText => {setPassword(newText); setPasswordError(false)}}
        secureTextEntry={true}
        defaultValue={""}
      />
      {passwordError && <Text>Wrong Password</Text>}
      <Button
  onPress={handleLogIn}
  title="Login"
  color="#841584"
  accessibilityLabel="Login Button"
/>
<Button
  onPress={() => {navigation.navigate('Create Account')}}
  title="Create Account"
  color="#841584"
  accessibilityLabel="Create account button"
/>
     
      </>

    )
}