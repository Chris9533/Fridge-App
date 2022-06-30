import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Card, CardButton, CardContent, CardImage } from 'react-native-cards';
import DateField from 'react-native-datefield';
import DropDownPicker from 'react-native-dropdown-picker';
import SearchBar from "react-native-dynamic-search-bar";
import { firebaseConfig } from '../../firebase';
import { Root, Popup } from 'popup-ui'

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
    const [selectWeight, setSelectWeight] = React.useState(null)
    const [selectQuantity, setSelectQuantity] = React.useState(null)

  
   
    

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
        .then(() => {
            setSearchTerm("")
            setSearchResults([])
            setSelectQuantity(null)
            setSelectWeight(null)
            setValue('Select category')
        })
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
            <Root>
    <View>
    </View>
</Root>
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

<TouchableOpacity>
            <CardButton 
            title='Add item'
            onPress={() =>
                { if (value === "Select category" && selectWeight === null && selectQuantity === null){
                     Popup.show({
                        type: 'Warning',
                        title: 'Please select a weight/quantity and a category',
                        button: true,
                        textBody: ``,
                        buttonText: 'Dismiss',
                        callback: () => Popup.hide()
                      })
                } else if (value === "Select category"){
                    Popup.show({
                        type: 'Warning',
                        title: 'Please select a Category',
                        button: true,
                        textBody: ``,
                        buttonText: 'Dismiss',
                        callback: () => Popup.hide()
                      })


                } else if (selectWeight === "" && selectQuantity === "") {
                    Popup.show({
                        type: 'Warning',
                        title: 'Please select a  weight or quantity',
                        button: true,
                        textBody: ``,
                        buttonText: 'Dismiss',
                        callback: () => Popup.hide()
                      })
                } else {Popup.show({
                  type: 'Success',
                  title: 'Item Added',
                  button: true,
                  textBody: `${item.name} has been added to your storage`,
                  buttonText: 'Dismiss',
                  callback: () => Popup.hide()
                });  addItemFirebase(item.name, item.image)}
            }
              }
             /> 
            
        </TouchableOpacity>
                        
                   
                    </Card>
                   
                    </>
                )
            })}
        </ScrollView>
        </>
    )
}