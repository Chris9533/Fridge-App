import * as React from 'react';
import { View, Text, TextInput, Button, ImageBackground, StyleSheet,Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Input, Icon, Stack, Center, NativeBaseProvider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";


export default function LogIn({navigation}) {

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
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "black"
    },
    logo : {
      width: 200,
      height:200,
      marginBottom: 50
    }
  })

    const auth = getAuth();

const [email, setEmail] = React.useState('')
const [password, setPassword] = React.useState('')
const [emailError, setEmailError] = React.useState(false)
const [passwordError, setPasswordError] = React.useState(false)
const [show, setShow] = React.useState(false);

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
  <View style={styles.container}>
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
<NativeBaseProvider>
            <Center flex={1} px="3">
<Image
        style={styles.logo}
        source={require('../Logo.png')}
      />
<Stack space={4} w="100%" alignItems="center">
<Input 
backgroundColor="primary.50"
w={{
base: "75%",
md: "25%"
}} InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="primary.600" />} placeholder="Email" onChangeText={newText => {setEmail(newText); setEmailError(false)}} />
{emailError && <Text style={styles.text}>Invalid Email</Text>}
<Input
backgroundColor="primary.50"
 w={{
base: "75%",
md: "25%"
}} type={show ? "text" : "password"} InputRightElement={<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.600"  onPress={() => setShow(!show)} />} placeholder="Password" onChangeText={newText => {setPassword(newText); setPasswordError(false)}} />
{passwordError && <Text style={styles.text}>Wrong Password</Text>}
<Button
  onPress={handleLogIn}
  title="          Login           "
  color="#841584"
  accessibilityLabel="Login Button"
/>
<Button
  onPress={() => {navigation.navigate('Create Account')}}
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

