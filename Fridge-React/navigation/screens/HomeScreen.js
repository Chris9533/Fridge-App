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



const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    marginBottom: '3%'
  },
  container: {
    display: 'grid',
  },
  red: {
    color: 'red',
  },
  yellow: {
    color: 'yellow',
  },
  green: {
    color: 'green',
  },
  img: {
    flex: 1,
    width: 80,
    height: 80,
    resizeMode: 'contain' 
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  search: {
    marginTop: '3%',
    marginBottom: '3%'
  }
});

export default function HomeScreen({navigation}) {


  const [fridge, setFridge] = React.useState([])

  
  React.useEffect(() => {
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();
    const colRef = collection(db, `${auth.currentUser.uid}/data/fridge`)
    const items = []
      
      getDocs(colRef).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
      items.push({...doc.data(), id : doc.id})
    }).then((items) => {
       // setFridge(items)
       console.log(items);
      }).catch((err) => {
        console.log(err);
      })
     
    })
  }, [fridge])
  
  console.log(fridge);
  
    //States for dropdown selector
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('all');
    const [items, setItems] = React.useState([
    {label: 'All', value: 'all'},
    {label: 'Fridge', value: 'fridge'},
    {label: 'Freezer', value: 'freezer'},
    {label: 'Cupboard', value: 'cupboard'}
  ]);


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
 
  <Card style={styles.card}>

      <CardImage
        source={{uri: 'https://hips.hearstapps.com/ghk.h-cdn.co/assets/18/09/2048x1024/landscape-1519672422-carrots.jpg?resize=1200:*'}} 
        title="Carrot"
        size="2"
        />
    
    <CardAction
     separator={true}
     inColumn={false}>

    
    <CardTitle 
      subtitle="Stored In: Fridge" 
      >sss</CardTitle>
    
    <Text style={styles.red}>1 Day Remaining</Text>

     </CardAction>

    <CardAction 
      separator={true} 
      inColumn={false}>
        
          <CardTitle 
        subtitle="6"/>

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


  <Card style={styles.card}>

      <CardImage
        source={{uri: 'https://cdn.shopify.com/s/files/1/2836/2982/products/pic10_large.jpg?v=1529434190'}} 
        title="Cheddar Cheese"
        size="2"
        />
    
    <CardAction
     separator={true}
     inColumn={false}>

    
    <CardTitle 
      subtitle="Stored In: Fridge" 
      />
    
    <Text style={styles.green}>10 Day Remaining</Text>

     </CardAction>

    <CardAction 
      separator={true} 
      inColumn={false}>
          <CardTitle 
        subtitle="0.5kg" 
        />
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
 
</ScrollView>
        </>
    )
}