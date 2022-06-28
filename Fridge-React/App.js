import * as React from 'react';
import MainContainer from './navigation/MainContainer';
<<<<<<< HEAD
import LogIn from './components/LogIn';
import CreateAccount from './components/CreateAccount';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
=======
import { db } from "./firebase.js"
import{ getDocs, collection } from 'firebase/firestore'
>>>>>>> 4c4c6677494dda9c9c6b4c2a94b6c3ab6fa8fdd9



function App() {

<<<<<<< HEAD
  const Stack = createNativeStackNavigator();
=======
  const colRef = collection(db, "Chris-9533/data/Fresh")

  getDocs(colRef).then((snapshot) => {
    const test = []
  snapshot.docs.forEach((doc) => {
  test.push({...doc.data(), id : doc.id})
  })
  console.log(test);
  })
>>>>>>> 4c4c6677494dda9c9c6b4c2a94b6c3ab6fa8fdd9

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
    {/* <MainContainer /> */}
    </>
  )
}

export default App;