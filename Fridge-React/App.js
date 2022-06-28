import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import LogIn from './components/LogIn';
import CreateAccount from './components/CreateAccount';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



function App() {

  const Stack = createNativeStackNavigator();

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