import * as React from 'react';
import { View, Text, Touchable, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, setDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import moment from 'moment';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardImage, CardButton } from 'react-native-cards';
import { Root, Popup } from "popup-ui";


export default function RecipesScreen({navigation}) {
        
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();

    const [recipeList, setRecipeList] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [recipeIsLoading, setRecipeIsLoading] = React.useState(true)
    const [selectRecipe, setSelectRecipe] = React.useState(false)
    const [recipeId, setRecipeId] = React.useState('')
    const [recipeData, setRecipeData] = React.useState()
    const [firebaseData, setFirebaseData] = React.useState([])
   

    React.useEffect(() => {
       

         let ingredientsArr = []

        let ingredientsStr = ''
        const recipeArr = []
       

        const colRefFridge = collection(db, `${auth.currentUser.uid}/data/fridge`)
        const colRefPantry = collection(db,`${auth.currentUser.uid}/data/pantry` )
        const colRefFreezer = collection(db, `${auth.currentUser.uid}/data/freezer`)
        getDocs(colRefFridge)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
            ingredientsArr.push({...doc.data(), id : doc.id})
            })
        getDocs(colRefPantry)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
            ingredientsArr.push({...doc.data(), id : doc.id})
            })
        getDocs(colRefFreezer)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                ingredientsArr.push({...doc.data(), id: doc.id})
            })

        ingredientsArr.sort((a,b) => {return new Date(a.itemObj.expDate.toDate()) - new Date(b.itemObj.expDate.toDate())})

        if(ingredientsArr.length > 5) {
            ingredientsArr = ingredientsArr.slice(0,5)
        }

        setFirebaseData(ingredientsArr)

        ingredientsArr.forEach((ing, i) => {
            if((i+1) === ingredientsArr.length) {   
                ingredientsStr += `${ing.itemObj.title.replace(/\s+/g, '')}`
                
            } else {
                ingredientsStr += `${ing.itemObj.title.replace(/\s+/g, '')},+`
            }
                })

        axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=b1dbbfdbe63f4f268ac4fae03746dbd3&ingredients=${ingredientsStr}&number=5`)
            .then(res => {
                res.data.forEach(recipe => {
                    recipeArr.push({title: recipe.title, img: recipe.image, ingTotal: recipe.usedIngredientCount + recipe.missedIngredientCount, ingUsedCount: recipe.usedIngredientCount, ingMatch: recipe.usedIngredients.map(recipe => {return recipe.name}),ingMissing: recipe.missedIngredients.map(recipe => {return recipe.name}), id: recipe.id}) 
                })
                setRecipeList(recipeArr)
            setIsLoading(false)
            })
        })
        })
        })  
    }, [])

    const handleSwitch = (id) => {
        setRecipeIsLoading(true)
        setSelectRecipe(curr => !curr)
        setRecipeId(id)
        axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=b1dbbfdbe63f4f268ac4fae03746dbd3&includeNutrition=false`)
        .then(res => {
            setRecipeData({source: res.data.sourceUrl, veggie: res.data.vegetarian, fullIng: res.data.extendedIngredients})
            setRecipeIsLoading(false)
        })
    }

    const handleYum = (ingObj) => {
        const firebaseIng = []
        const firebaseComp = []
        const firebaseCategory = []
        firebaseData.forEach(item => {
            firebaseCategory.push({title: item.id, category: item.itemObj.category})
            firebaseComp.push(item.id)
        })
        ingObj.forEach(ing => {
            firebaseIng.push({title: ing.name, amount: ing.amount})
        })
        const filteredIng = firebaseIng.filter(item => {
            return firebaseComp.includes(item.title)
        })
        filteredIng.map(item => {
          firebaseCategory.forEach(obj => {
                if(item.title === obj.title) {
                   item.category = obj.category
                }
            })
        })
        filteredIng.forEach(item => {
            updateDoc(doc(db, auth.currentUser.uid, 'data', item.category, item.title), {'itemObj.amount': increment(-item.amount)})
        })
    }

    const handleShoppingPress = (ingList) => {
        ingList.forEach(item => {
           const itemObj = {title: item}
            setDoc(doc(db, auth.currentUser.uid, 'data', 'Shopping List', item), {itemObj})
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
              });
        })
    }

    if(isLoading){return <Text>Loading</Text>}
    return (
            <Root>
        <View>
        <ScrollView>
            {recipeList && recipeList.map(recipe => {
                return (
                    <Card key={recipe.id}>
                        <CardImage source={{uri:recipe.img}} />
                        <Text>{recipe.title}</Text>
                        <Text>{recipe.ingUsedCount}/{recipe.ingTotal}{' Ingredients Matched'}</Text>
                        <CardButton title={!selectRecipe ? 'Cook This' : recipeId === recipe.id ? 'Something Else' : 'Cook This'} onPress={() => {handleSwitch(recipe.id)}} />
                        {selectRecipe && recipeId === recipe.id ? 
                        <>
                        <Text>{'You Have'}</Text> 
                        {recipe.ingMatch.map(name => {
                            return <Text key={name}>{name}</Text>
                        })}
                        <Text>{'You Need'}</Text>
                        {recipe.ingMissing.map(name => {
                            return <Text key={name}>{name}</Text>
                        })}
                        <Text>{'Instructions'}</Text>
                        {recipeIsLoading ? <Text>'Loading...'</Text> : <Text>{recipeData.source}</Text>}
                        <Text>{'Veggie?'}</Text>
                        {recipeIsLoading ? <Text>'Loading...'</Text> : <Text>{recipeData.veggie.toString()}</Text>}
                        <CardButton title='Yum' onPress={() => {handleYum(recipeData.fullIng)}}/>
                        <TouchableOpacity>
                        <CardButton title='Add Missing to List' onPress={() => {handleShoppingPress(recipe.ingMissing); Popup.show({
                                type: "Success",
                                title:
                                  "Missing items have been added to your shopping list ",
                                button: true,
                                textBody: ``,
                                buttonText: "Dismiss",
                                callback: () => Popup.hide(),
                              }); }}/>
                        </TouchableOpacity>

                      
          

                        </>
                        : 
                        <></>}
                       
                    </Card>
                )
            })}
        </ScrollView>
            </View>
            </Root>
    )
}