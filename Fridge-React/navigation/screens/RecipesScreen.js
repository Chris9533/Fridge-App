import * as React from 'react';
import { View, Text } from 'react-native';

export default function RecipesScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Recipes')}>
                Home Screen
            </Text>
        </View>
    )
}