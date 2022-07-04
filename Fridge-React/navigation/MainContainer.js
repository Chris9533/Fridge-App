import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

//Screens
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen';
import ListScreen from './screens/ListScreen';
import RecipesScreen from './screens/RecipesScreen';
import AddItemScreen from './screens/AddItemScreen';

//Screen Names
const homeName = 'Home'
const profileName = 'Profile'
const listName = 'Shopping List'
const recipesName = 'Recipes'
const addItemName = 'Add Item'

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let routeName = route.name

                        if (routeName === homeName) {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (routeName === profileName) {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (routeName === listName) {
                            iconName = focused ? 'cart' : 'cart-outline';
                        } else if (routeName === recipesName) {
                            iconName = focused ? 'book' : 'book-outline';
                        } else if (routeName === addItemName) {
                            iconName = focused ? 'add' : 'add-outline';
                        } 

                        return <Ionicons name={iconName} size={size} color={color} />
                    }
                })}>

                <Tab.Screen name={homeName} component={HomeScreen} />
                <Tab.Screen name={recipesName} component={RecipesScreen} />
                <Tab.Screen name={addItemName} component={AddItemScreen} />
                <Tab.Screen name={listName} component={ListScreen} />
                <Tab.Screen name={profileName} component={ProfileScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    )
}