import * as React from 'react';
import { View, Text, Button, ActivityIndicator, RefreshControl, Linking} from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { ScrollView } from 'react-native-gesture-handler';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, setDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase';
import { Card, CardImage, CardButton } from 'react-native-cards';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  } 

export default function ProfileScreen({navigation}) {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();

    const [refreshing, setRefreshing] = React.useState(false)
    const [favRecipe, setFavRecipe] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [recipeHistory, setRecipeHistory] = React.useState([])
    const [foodScore, setFoodScore] = React.useState({})

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        wait(2000).then(() => setRefreshing(false))
      })   

    React.useEffect(() => {
        let favArr = []
        let htyArr = []

        const colRefFav = collection(db, `${auth.currentUser.uid}/data/Favourites`)
        const colRefHstry = collection(db, `${auth.currentUser.uid}/data/History`)
        const colRefScore = doc(db, `${auth.currentUser.uid}`, 'score')
        getDocs(colRefFav).then(snapshot => {
            snapshot.forEach(doc => {
                favArr.push(doc.data().favObj)
            })
            setFavRecipe(favArr) 
        getDocs(colRefHstry).then(snapshot => {
            snapshot.forEach(doc => {
                htyArr.push(doc.data().historyObj)
            })
       if(htyArr.length > 5) {
           htyArr = htyArr.slice(0,5)
       }
            setRecipeHistory(htyArr)
        getDoc(colRefScore).then(snapshot => {
            setFoodScore(snapshot.data())
        })   
    setIsLoading(false) 
        })
       
        })
         
    }, [refreshing])

    

    function handleSignOut() {
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }

    return (
        <>
        <Button
  onPress={handleSignOut}
  title="Logout"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>

        

        {isLoading ? <ActivityIndicator /> :  <>
        <Text>Level: {Math.floor(foodScore.score/ 10) } Exp: {foodScore.score % 10} / 10</Text>
        <ScrollView refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
          }> 
            <Text>Favourite Recipes</Text>
            {favRecipe.length === 0 ? <Text>Add some Favourites</Text> : favRecipe.map(recipe => {
               return (<Card key={recipe.title}>
                    <CardImage source={{uri: recipe.img}} />
                    <Text>{recipe.title}</Text>
                    <Text style={{color: 'blue'}}
                            onPress={() => Linking.openURL(recipe.source)}>
                        Instructions
                        </Text>
                </Card>) 
            })}
            <Text>Recipe History</Text>
            {recipeHistory.length === 0 ? <Text>Cook something</Text> : recipeHistory.map(recipe => {
                return (<Card key={recipe.title}>
                    <CardImage source={{uri: recipe.img}} />
                    <Text>{recipe.title}</Text>
                    <Text style={{color: 'blue'}}
                            onPress={() => Linking.openURL(recipe.source)}>
                        Instructions
                        </Text>
                </Card>) 
            })}
        </ScrollView>
        </>}
    
        </>
    )
}