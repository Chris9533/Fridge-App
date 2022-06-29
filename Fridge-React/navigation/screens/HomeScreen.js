import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import SearchBar from "react-native-dynamic-search-bar";

const styles = StyleSheet.create({
  card: {
    // borderRadius: '25%'
  },
  container: {
    display: 'grid',

    
  },
  red: {
    color: 'red',
    display: 'flex',
    marginLeft: '80%',
    
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
  }
});

export default function HomeScreen({navigation}) {
    return (

        <>

        <SearchBar
  fontColor="#c6c6c6"
  iconColor="#c6c6c6"
  shadowColor="#282828"
  cancelIconColor="#c6c6c6"
  backgroundColor="white"
  placeholder="Search here"
//   onChangeText={(text) => this.filterList(text)}
//   onSearchPress={() => console.log("Search Icon is pressed")}
//   onClearPress={() => this.filterList("")}
//   onPress={() => alert("onPress")}
/>


 <ScrollView>
 
  <Card style={styles.card}>

      <CardImage
        source={{uri: 'https://hips.hearstapps.com/ghk.h-cdn.co/assets/18/09/2048x1024/landscape-1519672422-carrots.jpg?resize=1200:*'}} 
        // title="Carrot"
        size="20"
        />
    <Text style={styles.red}>Quantity: 5</Text>
      <CardContent text="Expiry Date: 20/7/2022" />

    <CardAction 
      separator={true} 
      inColumn={false}>
      <CardButton
        onPress={() => {}}
        title="Add To List"
        color="#FEB557"
        />
      <CardButton
        onPress={() => {}}
        title="Remove x 1"
        color="#FEB557"
        />
    </CardAction>

  </Card>

  <Card style={styles.card}>
      <CardImage 
        source={{uri: 'https://cdn.shopify.com/s/files/1/2836/2982/products/pic10_large.jpg?v=1529434190'}} 
        title="Cheddar Cheese"
        size="20"
        />
    <CardTitle 
      subtitle="Quantity: 1" 
      />
    <CardContent text="Expiry Date: 20/7/2022" />
    
    <CardAction 
      separator={true} 
      inColumn={false}>
      

      <CardButton
        onPress={() => {}}
        title="Add To List"
        color="#FEB557"
        />
      <CardButton
        onPress={() => {}}
        title="Remove x 1"
        color="#FEB557"
        />
    </CardAction>
  </Card>
 
</ScrollView>
        </>
    )
}