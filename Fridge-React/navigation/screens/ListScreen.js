import * as React from 'react';
import { View, Text } from 'react-native';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../../firebase';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import { styles } from '../../stylesheet'; 

export default function ListScreen({navigation}) {

    const app = initializeApp(firebaseConfig);
    const [display, setDisplay] = React.useState([])
    const db = getFirestore(app);
    const auth = getAuth();
    const shoppingList = []

    
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

    }, [])

    const handleRemove = (name) => {

       await db.collection(`${auth.currentUser.uid}/data/Shopping List`).doc(name).delete()
        .then(() => {

        }).catch((err) => {
            console.log(err)

        })

    }


    return (
        <>
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
        </>
    )
}