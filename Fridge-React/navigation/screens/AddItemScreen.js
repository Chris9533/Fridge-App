import * as React from 'react';
import { View, Text } from 'react-native';

export default function AddItemScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Add Item')}>
                Add Item
            </Text>
        </View>
    )
}