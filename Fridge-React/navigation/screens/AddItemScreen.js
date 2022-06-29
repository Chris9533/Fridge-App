import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import axios from 'axios'
import { CardContent, CardImage, Card, CardAction, CardButton, CardTitle } from 'react-native-cards';
import DateField from 'react-native-datefield';
import DropDownPicker from 'react-native-dropdown-picker';
import {doc, setDoc} from 'firebase/firestore'
import { firebaseConfig } from '../../firebase';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth';

export default function AddItemScreen({navigation}) {

    const styles = StyleSheet.create({
        img: {
            width: '15%',
            height: '15%',
            padding: 10,
            backgroundColor: 'white',
          }
    })

    const [searchTerm, setSearchTerm] = React.useState('')
    const [searchResults, setSearchResults] = React.useState([])
    const [date, setDate] = React.useState(new Date())
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('Select category');
    const [items, setItems] = React.useState([
      {label: 'Fridge', value: 'fridge'},
      {label: 'Freezer', value: 'freezer'},
      {label: 'Pantry', value: 'pantry'}
    ]);
    const [amount, setAmount] = React.useState('')
    const [selectWeight, setSelectWeight] = React.useState('')
    const [selectQuantity, setSelectQuantity] = React.useState('')

    const handleSearch = () => {
        if(searchTerm.length > 0) {
            axios.get(`https://api.spoonacular.com/food/ingredients/search?apiKey=b1dbbfdbe63f4f268ac4fae03746dbd3&query=${searchTerm}&number=5`)
            .then(res => {
                setSearchResults(res.data.results)
            })
        }
    }

    const weightSelected = () => {
        setSelectWeight(amount + 'g')
        setSelectQuantity('')
        console.log(selectWeight)
    }

    const quantitySelected = () => {
        setSelectQuantity(amount)
        setSelectWeight('')
        console.log(selectQuantity)
    }
    const addItemFirebase = (name, image) => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth();
        const itemObj = {title: name, expDate: date, amount: selectWeight ? selectWeight : selectQuantity, category: value, image: image}
        setDoc(doc(db, auth.currentUser.uid, 'data', value, name), {itemObj})
        .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode)
        })
    }

    return (
        <>
        <SearchBar
            style={{margin:10}}
                fontColor="#c6c6c6"
                iconColor="#c6c6c6"
                shadowColor="#282828"
                cancelIconColor="#c6c6c6"
                backgroundColor="white"
                placeholder="Search here"
                onChangeText={(text) => setSearchTerm(text)}
                onSearchPress={() => handleSearch()}
                onClearPress={() => setSearchTerm("")}
                //   onPress={() => alert("onPress")}
            />
        <ScrollView>
            
            {searchResults && searchResults.map(item => {
                return (
                    <>
                    <Card key={item.id}>
                        <CardImage 
                            source={{uri: `https://spoonacular.com/cdn/ingredients_250x250/${item.image}`}}
                            style={styles.img}
                            />
                        <CardContent 
                            text={item.name.charAt(0).toUpperCase() + item.name.slice(1)} 
                            /> 
                        <Text>Expirey Date</Text>
                        <DateField 
                            defaultValue={new Date()}
                            styleInput={{ fontSize: 15}}
                            containerStyle={
                                {borderRadius: 15,
                                backgroundColor: '#f4f4f4',
                                padding: 10,
                                margin: 10
                                }}
                            onSubmit={(value) => setDate(value)}
                            />
                        
                        <Text>Amount</Text>
                        <TextInput 
                        style={{height: 40, marginTop: 15,
                            backgroundColor: "white",
                            borderWidth: 1,
                            borderColor: 'grey',
                            padding: 10,
                            fontSize: 20}}
                        placeholder="Input Amount"
                        onChangeText={newText => {setAmount(newText)}}/>
                        <CardButton title='Weight (grams)' onPress={() => {weightSelected()}}/>
                        <CardButton title='Quantity' onPress={() => {quantitySelected()}} />
                        <DropDownPicker 
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        listMode='MODAL'
                        placeholder='Select a category'/>
                        
                        <CardButton 
                        title='Add item'
                        onPress={() => {addItemFirebase(item.name, item.image)}}
                         /> 
                   
                    </Card>
                   
                    </>
                )
            })}
        </ScrollView>
        </>
    )
}