import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import SearchBar from "react-native-dynamic-search-bar";
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../stylesheet';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import { initializeApp } from 'firebase/app' 



export default function HomeScreen({navigation}) {


  //States for dropdown selector
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('all');
  const [items, setItems] = React.useState([
  {label: 'All', value: 'all'},
  {label: 'Fridge', value: 'fridge'},
  {label: 'Freezer', value: 'freezer'},
  {label: 'Pantry', value: 'pantry'}
]);


  const [display, setDisplay] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  
  const app = initializeApp(firebaseConfig);
  
  const all = []
  const fridge = []
  const pantry = []
  const freezer = []
  
  React.useEffect(() => {
    const db = getFirestore(app);
    const auth = getAuth();
    const fridgeRef = collection(db, `${auth.currentUser.uid}/data/fridge`)
    const freezerRef = collection(db, `${auth.currentUser.uid}/data/freezer`)
    const pantryRef = collection(db, `${auth.currentUser.uid}/data/pantry`)
    
    getDocs(fridgeRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        all.push({...doc.data(), id : doc.id})
        fridge.push({...doc.data(), id : doc.id})
      })
      getDocs(pantryRef).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          all.push({...doc.data(), id : doc.id})
          pantry.push({...doc.data(), id : doc.id})
        })
        getDocs(freezerRef).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            all.push({...doc.data(), id : doc.id})
            freezer.push({...doc.data(), id : doc.id})
          })
          
          if(value === 'fridge') {
            setDisplay(fridge)
          } else if(value === 'freezer') {
            setDisplay(freezer)
          } else if (value === 'pantry') {
            setDisplay(pantry)
          } else {
            setDisplay(all)
          }
    })
    })
  })

  }, [value])


    return (

        <>
<DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />

        <SearchBar
        style={styles.search}
  fontColor="#c6c6c6"
  iconColor="#c6c6c6"
  shadowColor="#282828"
  cancelIconColor="#c6c6c6"
  backgroundColor="white"
  placeholder="Search for item"
//   onChangeText={(text) => this.filterList(text)}
//   onSearchPress={() => console.log("Search Icon is pressed")}
//   onClearPress={() => this.filterList("")}
//   onPress={() => alert("onPress")}
/>


 <ScrollView> 

{display.map((item) => {

return (
  
<Card key={item.id} style={styles.card}>

<CardImage
  source={{uri: `https://spoonacular.com/cdn/ingredients_250x250/${item.itemObj.image}`}} 
  title={item.itemObj.title}
  size="2"
  />

<CardAction
separator={true}
inColumn={false}>


<CardTitle 
subtitle={`Stored In: ${item.itemObj.category}`} 
/>

<Text style={styles.red}>{` days remaining`}</Text>

</CardAction>

<CardAction 
separator={true} 
inColumn={false}>
  
    <CardTitle 
  subtitle={item.itemObj.amount}/>

<CardButton
  onPress={() => {alert('Added to shopping list!')}}
  title="Add To List"
  color="#FEB557"
  />

<CardButton
  onPress={() => {}}
  title="Change Quantity"
  color="#FEB557"
  />
  
</CardAction>

</Card>

)

})}
 
</ScrollView>
        </>
    )
}