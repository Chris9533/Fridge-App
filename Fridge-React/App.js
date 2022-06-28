import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import LogIn from './components/LogIn';
import CreateAccount from './components/CreateAccount';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./firebase.js"




function App() {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const Stack = createNativeStackNavigator();
  const [userLoggedIn, setUserLoggedIn] = React.useState(false)

  const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    setUserLoggedIn(true);
    // ...
  } else {
    setUserLoggedIn(false)
    // User is signed out
    // ...
  }
});



  
  
  if (userLoggedIn) {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name='Log In'
        component={LogIn}
        />

        <Stack.Screen 
        name='Create Account'
        component={CreateAccount}
        />

      </Stack.Navigator>

    </NavigationContainer>
   
    </>
  )
  } else {
    return (
 <MainContainer />
    )
  }
}

export default App;