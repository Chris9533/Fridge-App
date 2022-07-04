import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput} from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import SearchBar from "react-native-dynamic-search-bar";
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../stylesheet';
import { getFirestore, getDocs, collection, waitForPendingWrites, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import { initializeApp } from 'firebase/app'
import { Root, Popup } from "popup-ui"; 

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

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
  const [refreshing, setRefreshing] = React.useState(false)
  const [selectItem, setSelectItem] = React.useState(false)
  const [itemId, setItemId] = React.useState('')

  const [selectWeight, setSelectWeight] = React.useState(null);
  const [selectQuantity, setSelectQuantity] = React.useState(null);
  const [reload, setReload] = React.useState(false)
  const [amount, setAmount] = React.useState("");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  })
  
  const app = initializeApp(firebaseConfig);
  
  const all = []
  const fridge = []
  const pantry = []
  const freezer = []
  const db = getFirestore(app);
  const auth = getAuth();

  const weightSelected = () => {
    setSelectQuantity(null);
    setSelectWeight(amount + "g"); 
  };

  const quantitySelected = () => {
    setSelectWeight(null);
    setSelectQuantity(amount);
  };

  const updateItem = (title, category) => {
    updateDoc(doc(db, auth.currentUser.uid, 'data', category, title), {'itemObj.amount': selectWeight !== null ? selectWeight : selectQuantity})
    .then(() => {
      setSelectItem(curr => !curr)
      setReload(curr => !curr)
      setSelectQuantity(null);
      setSelectWeight(null);

    })
  }

  const removeItem = async (title, category) => {

    const docRef = doc(db, `${auth.currentUser.uid}/data/${category}`, title);
       await deleteDoc(docRef).then(() => {
        setSelectItem(curr => !curr)
        setReload(curr => !curr)
        
       })

  }
  
  React.useEffect(() => {
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

  }, [value, refreshing, reload])

  const handleShoppingPress = (name) => {
   
       const itemObj = {title: name}
        setDoc(doc(db, auth.currentUser.uid, 'data', 'Shopping List', name), {itemObj})
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
          });
    
}

const handleSwitch = (id) => {
  setSelectItem(curr => !curr)
  setItemId(id)
  
}


    return (
      <Root>
        <View>

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


 <ScrollView refreshControl={
   <RefreshControl
   refreshing={refreshing}
   onRefresh={onRefresh}
   />
 }> 

{display.map((item) => {

return (
  
<Card key={item.id} style={styles.card}>

<CardImage
  style={styles.img}
  source={{uri: `https://spoonacular.com/cdn/ingredients_250x250/${item.itemObj.image}`}} 
  />

<Text style={styles.title}>
{`[ ${item.itemObj.title} ]`}
</Text>

<CardAction
separator={true}
inColumn={false}>



<CardTitle subtitle={`Stored In: ${item.itemObj.category}`} />

<Text style={styles.red}>{`2 days remaining`}</Text>

</CardAction>

<CardAction 
separator={true} 
inColumn={false}>
  
    <CardTitle
  subtitle={`${item.itemObj.amount} In Stock`}/>


<TouchableOpacity>
<CardButton
  title="Add To List"
  color="white"
  onPress={() => {handleShoppingPress(item.itemObj.title); Popup.show({
    type: "Success",
    title:
      `${item.itemObj.title} have been added to your shopping list`,
    button: true,
    textBody: ``,
    buttonText: "Dismiss",
    callback: () => Popup.hide(),
  });}}
  />
  </TouchableOpacity>

  <CardButton title= "Update Quantity" onPress={() => {handleSwitch(item.itemObj.title)}}/>
  
</CardAction>
  {selectItem && itemId === item.itemObj.title ? 
                        <>
                        <CardAction separator={true} inColumn={false}>
                        <TextInput
                        style={{
                          height: 40,
                          marginTop: 15,
                          backgroundColor: "white",
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "grey",
                          padding: 10,
                          fontSize: 20,
                        }}
                        placeholder="Input Amount"
                        onChangeText={(newText) => {
                          setAmount(newText);
                        }}
                      />
                      <CardButton
                          title="Weight (grams)"
                          color="white"
                          onPress={() => {
                            weightSelected();
                          }}
                        />
                        <CardButton
                          color="white"
                          title="Quantity"
                          onPress={() => {
                            quantitySelected();
                          }}
                        /></CardAction> 
                        <CardAction separator={true} inColumn={false}> 
                        <CardButton
                        color="white"
                        title="Update"
                        onPress={() => {
                          if (selectWeight === null &&
                            selectQuantity === null) {
                              Popup.show({
                                type: "Warning",
                                title:
                                  `Please input a weight`,
                                button: true,
                                textBody: ``,
                                buttonText: "Dismiss",
                                callback: () => Popup.hide(),
                              });
                            } else {

                              updateItem(item.itemObj.title, item.itemObj.category); Popup.show({
                                type: "Success",
                                title:
                                  `Qauntity Updated`,
                                  button: true,
                                textBody: ``,
                                buttonText: "Dismiss",
                                callback: () => Popup.hide(),
                              });
                            }
                        }}
                      />
                      <CardButton
                          color="white"
                          title="Delete Item"
                          onPress={() => {
                            removeItem(item.itemObj.title, item.itemObj.category); Popup.show({
                              type: "Success",
                              title:
                                `${item.itemObj.title} deleted`,
                                button: true,
                              textBody: ``,
                              buttonText: "Dismiss",
                              callback: () => Popup.hide(),
                            });
                          }}
                        />
                        </CardAction>
                      </> : <></>}

</Card>

)

})}
 
</ScrollView>
        </>
        </View>
        </Root>
    )
}