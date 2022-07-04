import * as React from 'react';
import { View, Text, RefreshControl } from 'react-native';
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
        <>
        <ScrollView refreshControl={
   <RefreshControl
   refreshing={refreshing}
   onRefresh={onRefresh}
   />
 }> 
       {display.map((item) => {
           console.log(item.itemObj, "here")
        return (
            
        <Card key={item.id} style={styles.card}>
            <CardAction 
          separator={true} 
           inColumn={false}>
            <CardTitle 
         title={item.itemObj.title} 
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
        </>
    )
}