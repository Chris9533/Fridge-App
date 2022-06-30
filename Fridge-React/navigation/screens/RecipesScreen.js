import * as React from 'react';
import { View, Text } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import moment from 'moment';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardImage, CardButton } from 'react-native-cards';

export default function RecipesScreen({navigation}) {

    const [recipeList, setRecipeList] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [recipeIsLoading, setRecipeIsLoading] = React.useState(true)
    const [selectRecipe, setSelectRecipe] = React.useState(false)
    const [recipeId, setRecipeId] = React.useState('')
    const [recipeData, setRecipeData] = React.useState()
    

    React.useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth();

        const ingredientsArr = [{itemObj: {name:'apple'}}, {itemObj: {name: 'duckeggs'}}]
        let ingredientsStr = ''
        const recipeArr = []
       

        const colRefFridge = collection(db, `${auth.currentUser.uid}/data/fridge`)
        const colRefPantry = collection(db,`${auth.currentUser.uid}/data/pantry` )
        // getDocs(colRefFridge)
        // .then((snapshot) => {
        //     snapshot.docs.forEach((doc) => {
        //     ingredientsArr.push({...doc.data(), id : doc.id})
        //     })
        // getDocs(colRefPantry)
        // .then((snapshot) => {
        //     snapshot.docs.forEach((doc) => {
        //     ingredientsArr.push({...doc.data(), id : doc.id})
        //     })
        // })
        // })
        ingredientsArr.forEach((ing, i) => {
            if((i+1) === ingredientsArr.length) {
                ingredientsStr += `${ing.itemObj.name}`

            } else {
                ingredientsStr += `${ing.itemObj.name},+`
            }
        })
        axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=ae8fe14f28d9455ea1809e8c6dc0d936&ingredients=${ingredientsStr}&number=5`)
        .then(res => {
            console.log(res.data[0])
            res.data.forEach(recipe => {
                recipeArr.push({title: recipe.title, img: recipe.image, ingTotal: recipe.usedIngredientCount + recipe.missedIngredientCount, ingUsedCount: recipe.usedIngredientCount, ingMatch: recipe.usedIngredients.map(recipe => {return recipe.name}),ingMissing: recipe.missedIngredients.map(recipe => {return recipe.name}), id: recipe.id}) 
            })
            setRecipeList(recipeArr)
        setIsLoading(false)
        })
    }, [])

    const handleSwitch = (id) => {
        setRecipeIsLoading(true)
        setSelectRecipe(curr => !curr)
        setRecipeId(id)
        axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=ae8fe14f28d9455ea1809e8c6dc0d936&includeNutrition=false`)
        .then(res => {
            setRecipeData({source: res.data.sourceUrl, veggie: res.data.vegetarian})
            setRecipeIsLoading(false)
        })
    }

    const handleYum = () => {
        console.log('yum')
    }

    if(isLoading){return <Text>Loading</Text>}
    return (
        <ScrollView>
            {recipeList && recipeList.map(recipe => {
                return (
                    <Card>
                        <CardImage source={{uri:recipe.img}} />
                        <Text>{recipe.title}</Text>
                        <Text>{recipe.ingUsedCount}/{recipe.ingTotal}{' Ingredients Matched'}</Text>
                        <CardButton title={!selectRecipe ? 'Cook This' : recipeId === recipe.id ? 'Something Else' : 'Cook This'} onPress={() => {handleSwitch(recipe.id)}} />
                        {selectRecipe && recipeId === recipe.id ? 
                        <>
                        <Text>{'You Have'}</Text> 
                        {recipe.ingMatch.map(name => {
                            return <Text>{name}</Text>
                        })}
                        <Text>{'You Need'}</Text>
                        {recipe.ingMissing.map(name => {
                            return <Text>{name}</Text>
                        })}
                        <Text>{'Instructions'}</Text>
                        {recipeIsLoading ? <Text>'Loading...'</Text> : <Text>{recipeData.source}</Text>}
                        <Text>{'Veggie?'}</Text>
                        {recipeIsLoading ? <Text>'Loading...'</Text> : <Text>{recipeData.veggie.toString()}</Text>}
                        <CardButton title='Yum' onPress={handleYum}/>
                        </>
                        : 
                        <></>}
                       
                    </Card>
                )
            })}
        </ScrollView>
    )
}