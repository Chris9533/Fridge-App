import * as React from 'react';
import { View, Text, RefreshControl, ImageBackground } from 'react-native';
import { getFirestore, getDocs, collection, Firestore, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../../firebase';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from '../../stylesheet'; 

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

export default function ListScreen({navigation}) {

    const image = {uri : 'https://img.freepik.com/free-vector/seamless-background-vegetables-radishes-peppers-cabbage-carrots-broccoli-peas-vector-illustration_1284-42027.jpg?t=st=1657117677~exp=1657118277~hmac=7770a747cc9275418a499832dc98fe626a1ba1ab44cf81050d5ff362d05d5346&w=1060'}


    const app = initializeApp(firebaseConfig);
    const [display, setDisplay] = React.useState([])
    const [deleteItem, setDeleteItem] = React.useState(true)
    const [refreshing, setRefreshing] = React.useState(false)
    const db = getFirestore(app);
    const auth = getAuth();
    const shoppingList = []

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        wait(2000).then(() => setRefreshing(false))
      })

    
    React.useEffect(() => {
        
        const shoppingListRef = collection(db, `${auth.currentUser.uid}/data/Shopping List`)
        
        getDocs(shoppingListRef).then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                shoppingList.push({...doc.data(), id : doc.id})
            })
            
            setDisplay(shoppingList)
        }).catch((err) => {
            console.log(err)
        })

    }, [deleteItem, refreshing])

    const handleRemove = async (name) => {

       const docRef = doc(db, `${auth.currentUser.uid}/data/Shopping List`, name);
       await deleteDoc(docRef).then(() => {
        setDeleteItem((currentVal) => {return !currentVal})
       })


    }


    return (
        <View>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <ScrollView refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
 }> 
       {display.map((item) => {
       
        return (     
        <Card key={item.id} style={styles.card}>
            <CardAction 
          separator={true} 
           inColumn={false}>
            <CardTitle 
         title={item.itemObj.title.charAt(0).toUpperCase() + item.itemObj.title.slice(1)} 
            />
            <CardButton
            onPress={() => {handleRemove(item.itemObj.title)}}
            title="Remove"
            color="#FEB557"
             />
             </CardAction>
        </Card>
        )


       })}
       </ScrollView>
    
        </ImageBackground>
        </View>
    )
}