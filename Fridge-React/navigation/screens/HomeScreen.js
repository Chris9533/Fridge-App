import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, ActivityIndicator, ImageBackground} from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import SearchBar from "react-native-dynamic-search-bar";
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../stylesheet';
import { getFirestore, getDocs, collection, waitForPendingWrites, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import { initializeApp } from 'firebase/app'
import { Root, Popup } from "popup-ui"; 
import { NativeBaseProvider, Box, AspectRatio, Image, Center, Stack, HStack, Heading, VStack, Button, Input } from "native-base";


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function HomeScreen({navigation}) {

  
  const image = {uri : 'https://img.freepik.com/free-vector/seamless-background-vegetables-radishes-peppers-cabbage-carrots-broccoli-peas-vector-illustration_1284-42027.jpg?t=st=1657117677~exp=1657118277~hmac=7770a747cc9275418a499832dc98fe626a1ba1ab44cf81050d5ff362d05d5346&w=1060'}


  //States for dropdown selector
  const [open, setOpen] = React.useState(false);
  const [resetList, setResetList] = React.useState(false);
  const [value, setValue] = React.useState('all');
  const [items, setItems] = React.useState([
  {label: 'All', value: 'all'},
  {label: 'Fridge', value: 'fridge'},
  {label: 'Freezer', value: 'freezer'},
  {label: 'Pantry', value: 'pantry'}
]);




  const [display, setDisplay] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [refreshing, setRefreshing] = React.useState(false)
  const [selectItem, setSelectItem] = React.useState(false)
  const [itemId, setItemId] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)

  const [selectWeight, setSelectWeight] = React.useState(null);
  const [selectQuantity, setSelectQuantity] = React.useState(null);
  const [reload, setReload] = React.useState(false)
  const [amount, setAmount] = React.useState("");
  const [noFilter, setNoFilter] = React.useState(false);

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
          setIsLoading(false);
    })
    })
  })

  }, [value, refreshing, reload, resetList])

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



const handleFilter = () => {
const filteredResults = []

display.forEach((item) => {
  if(item.id.toLowerCase() == searchTerm.toLowerCase()) {
    filteredResults.push(item)
  }
  
})
if (filteredResults.length === 0 ) {
 setNoFilter(true);

} else {
setDisplay(filteredResults)
}

}

const daysRemaining = (date) => {
  const milliseconds = date.seconds * 1000

  const daysRemaining = Math.ceil((milliseconds - Date.now()) / 86400000);
  const outOfDate = Math.floor((milliseconds - Date.now()) / 86400000);

  // console.log(outOfDate)


if (milliseconds - Date.now() < 0) {
  return `${outOfDate * -1} Day(s) Out of Date`
} else if (milliseconds - Date.now() < 86400000) {
  return "Last day to use!"
} else {
  return `${daysRemaining} days remaining`
}

}

if(isLoading) return <ActivityIndicator />
if (noFilter) {
  return (
    <Root>
      <View>
      {Popup.show({
                                type: "Warning",
                                title:
                                  `No items match ${searchTerm}`,
                                button: true,
                                textBody: ``,
                                buttonText: "Dismiss",
                                callback: () => {Popup.hide(); setNoFilter(false)},
                              })}
      </View>

    </Root>

  )
}

if (display.length === 0 ) {
  return (
    <>
    <View style={styles.container}>
     <ImageBackground source={image} resizeMode="cover" style={styles.image}>
    <NativeBaseProvider>
    <Center flex={1} px="3">
    <Stack space={4} w="100%" alignItems="center" marginTop={250}>
    <ScrollView refreshControl={
   <RefreshControl
   refreshing={refreshing}
   onRefresh={onRefresh}
   />
 }> 
    <Text style={{fontSize: 20, textAlign: 'center', backgroundColor: 'white', marginLeft: 30, marginRight: 30, marginBottom: 20, borderRadius: 5, paddingLeft: 5, paddingRight:5}}>You have no items in storage</Text>
    <Button
  onPress={() => {navigation.navigate('Add Item')}}
  title="Create Account"
  color="#841584"
  accessibilityLabel="Create account button"
>Add Items</Button>
</ScrollView>
</Stack>
    </Center>
    </NativeBaseProvider>
    </ImageBackground>
    </View>
    </>
  )
} else {




    return (
      <Root>
        <View>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>

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
  onChangeText={(text) => setSearchTerm(text)}
  onSearchPress={() => handleFilter()}
  onClearPress={() => {setValue("all"); setResetList((curr) => {return !curr})}}
//   onPress={() => alert("onPress")}
/>


 <ScrollView contentContainerStyle={{paddingBottom: 40}} refreshControl={
   <RefreshControl
   refreshing={refreshing}
   onRefresh={onRefresh}
   />
 }> 

{display.map((item) => {

return (

  <>


<NativeBaseProvider>
            
           
            <Box alignItems="center">
      <Box marginBottom="3%" maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
      borderColor: "coolGray.600",
      backgroundColor: "gray.700"
    }} _web={{
      shadow: 2,
      borderWidth: 0
    }} _light={{
      backgroundColor: "gray.50"
    }}>
        <Box>
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image source={{
            uri: `https://spoonacular.com/cdn/ingredients_250x250/${item.itemObj.image}`
          }} alt="image" />
          </AspectRatio>
          <Center bg="green.500" _dark={{
          bg: "green.200"
        }} _text={{
          color: "warmGray.50",
          fontWeight: "700",
          fontSize: "xs",
          textTransform: "capitalize"
        }} position="absolute" bottom="0" px="3" py="1.5">
            {`Stored In: ${item.itemObj.category}`}
          </Center>
        </Box>
        <Stack p="4" space={3}>
          <Stack space={2} alignItems="center">
            <Heading size="md" ml="-1" textTransform={'capitalize'}>
             {`${item.itemObj.title}`}
            </Heading>
            <Text fontSize="xs" _light={{
            color: "violet.500"
          }} _dark={{
            color: "violet.400"
          }} fontWeight="500" ml="-0.5" mt="-1">
              {+(item.itemObj.amount.replace(/[^\d.-]/g, '')) > 0 ? `${item.itemObj.amount} In Stock` : 'Out Of Stock'}
            </Text>
          </Stack>

          <Stack mb="2.5" mt="1.5" direction={{
        base: "column",
        md: "row"
      }} space={2} mx={{
        base: "auto",
        md: "0"
      }}>
          <Button size="sm" variant="solid" colorScheme="emerald"
          onPress={() => {handleShoppingPress(item.itemObj.title); Popup.show({
            type: "Success",
            title:
              `${item.itemObj.title} have been added to your shopping list`,
            button: true,
            textBody: ``,
            buttonText: "Dismiss",
            callback: () => Popup.hide(),
          });}}>
            ADD TO LIST
          </Button>
          <Button size="sm" variant="subtle" colorScheme="emerald"
          onPress={() => {handleSwitch(item.itemObj.title)}}>
            CHANGE QUANTITY
          </Button>
          {selectItem && itemId === item.itemObj.title ? 
                        <>
                        <CardAction separator={true} inColumn={false}>
                    
                      <Input variant="rounded" mx="3" placeholder="Amount" w="30%" maxWidth="100px" onChangeText={(newText) => {
                            setAmount(newText);
                          }} />
                      <Button
                          variant="outline"
                          onPress={() => {
                            weightSelected();
                          }}
                        >Grams</Button>
                        <Button
                          variant="outline"
                          onPress={() => {
                            quantitySelected();
                          }}
                        >Quantity</Button>
                        </CardAction> 
                        
                        <Button size="sm" colorScheme="emerald"

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
                      >UPDATE</Button>
                      <Button size="sm" colorScheme="red"
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
                        >DELETE</Button>
                       
                      </> : <></>}
        </Stack>


          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Text color="coolGray.600" fontWeight="400" style={Math.ceil(((item.itemObj.expDate.seconds)*1000  - Date.now()) / 86400000) <= 0 ? styles.red : Math.ceil(((item.itemObj.expDate.seconds)*1000  - Date.now()) / 86400000) > 3 ? styles.green : styles.yellow}>
                {daysRemaining(item.itemObj.expDate)}
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>

            
    </NativeBaseProvider>

 </>
)

})}
 
</ScrollView>
        </>
        </ImageBackground>
        </View>
        </Root>
    )
}
}