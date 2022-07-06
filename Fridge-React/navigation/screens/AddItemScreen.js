import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TextInputBase,
} from "react-native";
import { CardAction } from "react-native-cards";
import DateField from "react-native-datefield";
import DropDownPicker from "react-native-dropdown-picker";
import SearchBar from "react-native-dynamic-search-bar";
import { firebaseConfig } from "../../firebase";
import { Root, Popup } from "popup-ui";
import { styles } from "../../stylesheet";
import { NativeBaseProvider, Radio, Select, Box, AspectRatio, Image, Center, Stack, HStack, Heading, VStack, Button, Input } from "native-base";

export default function AddItemScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("Select category");
  const [items, setItems] = React.useState([
    { label: "Fridge", value: "fridge" },
    { label: "Freezer", value: "freezer" },
    { label: "Pantry", value: "pantry" },
  ]);
  const [amount, setAmount] = React.useState(0);
  const [selectWeight, setSelectWeight] = React.useState(null);
  const [selectQuantity, setSelectQuantity] = React.useState(null);
  const [radio, setRadio] = React.useState(null);


console.log(amount);

  // console.log(radioValue)
  
  const handleSearch = () => {
    
    if (searchTerm.length > 0) {
      axios
      .get(
        `https://api.spoonacular.com/food/ingredients/search?apiKey=b1dbbfdbe63f4f268ac4fae03746dbd3&query=${searchTerm}&number=5`
        )
        .then((res) => {
          setSearchResults(res.data.results);
        })
      }
    };
  

  const setRadioValue = (val) => {

    if( radio === 'weight' ) {
      setSelectWeight(val + "g");
      setSelectQuantity(null);
    } else {
      setSelectQuantity(val);
      setSelectWeight(null);
    }
  }


  const addItemFirebase = (name, image) => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();
    const itemObj = {
      title: name,
      expDate: date,
      amount: selectWeight ? selectWeight : selectQuantity,
      category: value,
      image: image,
    };
    setDoc(doc(db, auth.currentUser.uid, "data", value, name), { itemObj })
      .then(() => {
        setSearchTerm("");
        setSearchResults([]);
        setSelectQuantity(null);
        setSelectWeight(null);
        setValue("Select category");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
      });
  };

  return (
    <>
      <Root>
        <View>
          <SearchBar
            style={{ margin: 10 }}
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

          <ScrollView contentContainerStyle={{paddingBottom: 60}}>
            {searchResults &&
              searchResults.map((item) => {
                
                return (
                  <>

                  <NativeBaseProvider>
      

                  <Box alignItems="center">
      <Box id={item.id} marginBottom="3%" maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
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
            uri: `https://spoonacular.com/cdn/ingredients_250x250/${item.image}`
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
            {item.id}
          </Center>
        </Box>
        <Stack p="4" space={3}>
          <Stack space={2} alignItems="center">
            <Heading size="md" ml="-1" textTransform={'capitalize'}>
             {`${item.name}`}
            </Heading>
            
          </Stack>

          <Stack mb="2.5" mt="1.5" direction={{
        base: "column",
        md: "row"
      }} space={2} mx={{
        base: "auto",
        md: "0"
      }}>


<HStack alignItems="center" space={4} justifyContent="space-between">
           
              {/* <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="400">
                Expiry Date:
              </Text> */}
            
          
            </HStack>

<DateField
                          defaultValue={new Date()}
                          styleInput={{ fontSize: 15 }}
                          containerStyle={{
                            borderRadius: 15,
                            backgroundColor: "#f4f4f4",
                            padding: 10,
                            marginLeft: 50,
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                          onSubmit={(value) => setDate(value)}
                        />
  <CardAction separator={true} inColumn={false}>

<Radio.Group name="myRadioGroup" value={radio} onChange={nextValue => {
  setRadio(nextValue)
  
}}>
      <Radio value="quantity" my={1}
      >
        Quantity
      </Radio>
      <Radio value="weight" my={1}
      >
        Weight(g)
      </Radio>

                       
      </Radio.Group>
       <Input isDisabled={radio === null} mx="3" placeholder="Enter amount" w="55%" maxWidth="200px" onChangeText={(newText) => {
         setAmount(newText)
         console.log(amount, '<<<');
         setRadioValue(newText);
        }} />
        </CardAction>
       

                        
 

        <DropDownPicker
                        style={styles.dropdown}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        listMode="MODAL"
                        placeholder="Select a category"
                        />

          <Button size="sm" variant="solid" colorScheme="green"
          onPress={(amount) => {
            
            if (
              value === "Select category" &&
              selectWeight === null &&
              selectQuantity === null
            ) {
              Popup.show({
                type: "Warning",
                title:
                  "Please select a weight or quantity and a category",
                button: true,
                textBody: ``,
                buttonText: "Dismiss",
                callback: () => Popup.hide(),
              });
            } else if (value === "Select category") {
              Popup.show({
                type: "Warning",
                title: "Please select a Category",
                button: true,
                textBody: ``,
                buttonText: "Dismiss",
                callback: () => Popup.hide(),
              });
            } else if (
              radio === null
            ) {
              Popup.show({
                type: "Warning",
                title: "Please select a  weight or quantity",
                button: true,
                textBody: ``,
                buttonText: "Dismiss",
                callback: () => Popup.hide(),
              });
            } else {
              Popup.show({
                type: "Success",
                title: "Item Added",
                button: true,
                textBody: `${item.name} has been added to your storage`,
                buttonText: "Dismiss",
                callback: () => Popup.hide(),
              }); 
                addItemFirebase(item.name, item.image);
              }
            }}
            >
            ADD ITEM
          </Button>
        </Stack>
        </Stack>
      </Box>
    </Box>
                      
    </NativeBaseProvider>
           </>
                );
              })}
          </ScrollView>
        </View>
      </Root>
    </>
  );
}
