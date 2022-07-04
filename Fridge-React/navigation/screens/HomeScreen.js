import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import SearchBar from "react-native-dynamic-search-bar";
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../stylesheet';
import { getFirestore, getDocs, collection, waitForPendingWrites } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import { initializeApp } from 'firebase/app' 
import { NativeBaseProvider, Box, AspectRatio, Image, Center, Stack, HStack, Heading, VStack, Button } from "native-base";

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  })
  
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

  }, [value, refreshing])


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


 <ScrollView refreshControl={
   <RefreshControl
   refreshing={refreshing}
   onRefresh={onRefresh}
   />
 }> 

{display.map((item) => {

return (


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
              {`${item.itemObj.amount} In Stock`}
            </Text>
          </Stack>

          <Stack mb="2.5" mt="1.5" direction={{
        base: "column",
        md: "row"
      }} space={2} mx={{
        base: "auto",
        md: "0"
      }}>
          <Button size="sm" variant="solid" colorScheme="secondary">
            LIST ITEM
          </Button>
          <Button size="sm" variant="solid" colorScheme="primary">
            CHANGE QUANTITY
          </Button>
        </Stack>


          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="400">
                X days remaining
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>

            
    </NativeBaseProvider>

)

})}
 
</ScrollView>
        </>
    )
}