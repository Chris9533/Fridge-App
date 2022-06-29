import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from "firebase/auth";


export default function ProfileScreen({navigation}) {

    const auth = getAuth();

    function handleSignOut() {
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });


    }

    return (
        <>
        <Button
  onPress={handleSignOut}
  title="Logout"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Profile')}>
                Profile
            </Text>
        </View>
        </>
    )
}