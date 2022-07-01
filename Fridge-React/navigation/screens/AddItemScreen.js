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
} from "react-native";
import {
  Card,
  CardButton,
  CardContent,
  CardImage,
  CardTitle,
  CardAction,
} from "react-native-cards";
import DateField from "react-native-datefield";
import DropDownPicker from "react-native-dropdown-picker";
import SearchBar from "react-native-dynamic-search-bar";
import { firebaseConfig } from "../../firebase";
import { Root, Popup } from "popup-ui";
import { styles } from "../../stylesheet";

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
  const [amount, setAmount] = React.useState("");
  const [selectWeight, setSelectWeight] = React.useState(null);
  const [selectQuantity, setSelectQuantity] = React.useState(null);

  console.log(selectQuantity, selectWeight, value);

  const handleSearch = () => {
    if (searchTerm.length > 0) {
      axios
        .get(
          `https://api.spoonacular.com/food/ingredients/search?apiKey=39f4abc5175f4647aff9f73a69ec58d6&query=${searchTerm}&number=5`
        )
        .then((res) => {
          setSearchResults(res.data.results);
        });
    }
  };

  const weightSelected = () => {
    setSelectWeight(amount + "g");
    setSelectQuantity("");
    console.log(selectWeight);
  };

  const quantitySelected = () => {
    setSelectQuantity(amount);
    setSelectWeight("");
    console.log(selectQuantity);
  };
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

          <ScrollView>
            {searchResults &&
              searchResults.map((item) => {
                
                return (
                  <>
                    <Card style={styles.card} key={item.id}>
                      <CardImage
                        source={{
                          uri: `https://spoonacular.com/cdn/ingredients_250x250/${item.image}`,
                        }}
                        style={styles.img}
                      />
                      
                        <Text style={styles.title}>
                            
                              {`[ ${item.name} ]`}
                            
                          </Text>

                      <CardAction separator={true} inColumn={false}>
                        <Text style={styles.white}>                      Expiry Date:       </Text>
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
                      </CardAction>


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
                        //   style={styles.buttons2}
                          title="Weight (grams)"
                          color="white"
                          onPress={() => {
                            weightSelected();
                          }}
                        />
                        <CardButton
                        // style={styles.buttons2}
                          color="white"
                          title="Quantity"
                          onPress={() => {
                            quantitySelected();
                          }}
                        />
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

                      <TouchableOpacity>
                        <CardButton
                          style={styles.buttons}
                          title="Add item"
                          color={'#132257'}
                          onPress={() => {
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
                              selectWeight === null &&
                              selectQuantity === null
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
                        />
                      </TouchableOpacity>
                    </Card>
                  </>
                );
              })}
          </ScrollView>
        </View>
      </Root>
    </>
  );
}
