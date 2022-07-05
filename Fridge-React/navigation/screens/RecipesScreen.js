import * as React from 'react';
import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, setDoc, doc, updateDoc, increment} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import moment from 'moment';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardImage, CardButton } from 'react-native-cards';
import DropDownPicker from 'react-native-dropdown-picker';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
export default function RecipesScreen({navigation}) {
        
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();

    const [refreshing, setRefreshing] = React.useState(false)
    const [recipeList, setRecipeList] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [recipeIsLoading, setRecipeIsLoading] = React.useState(true)
    const [selectRecipe, setSelectRecipe] = React.useState(false)
    const [recipeId, setRecipeId] = React.useState('')
    const [recipeData, setRecipeData] = React.useState()
    const [firebaseData, setFirebaseData] = React.useState([])
    const [favourites, setFavourites] = React.useState([])
    const [optFav, setOptFav] = React.useState([])

      //States for dropdown selector
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [recipeStore, setRecipeStore] = React.useState([])
  
   
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        wait(2000).then(() => setRefreshing(false))
      })    

    React.useEffect(() => {
       

        let ingredientsArr = [] 
        let ingredientsStr = ''
        const recipeArr = []
        let favouriteArr = []
        const dropdownArr = []
       

        const colRefFridge = collection(db, `${auth.currentUser.uid}/data/fridge`)
        const colRefPantry = collection(db,`${auth.currentUser.uid}/data/pantry` )
        const colRefFreezer = collection(db, `${auth.currentUser.uid}/data/freezer`)
        const colRefFavourite = collection(db, `${auth.currentUser.uid}/data/Favourites`)
        getDocs(colRefFridge)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
            ingredientsArr.push({...doc.data(), id : doc.id})
            dropdownArr.push({label: doc.data().itemObj.title.charAt(0).toUpperCase() + doc.data().itemObj.title.slice(1), value: doc.data().itemObj.title})
            })
        getDocs(colRefPantry)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
            ingredientsArr.push({...doc.data(), id : doc.id})
            dropdownArr.push({label: doc.data().itemObj.title.charAt(0).toUpperCase() + doc.data().itemObj.title.slice(1), value: doc.data().itemObj.title})
            })
        getDocs(colRefFreezer)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                ingredientsArr.push({...doc.data(), id: doc.id})
                dropdownArr.push({label: doc.data().itemObj.title.charAt(0).toUpperCase() + doc.data().itemObj.title.slice(1), value: doc.data().itemObj.title})
            })

        ingredientsArr.sort((a,b) => {return new Date(a.itemObj.expDate.toDate()) - new Date(b.itemObj.expDate.toDate())})

        if(ingredientsArr.length > 5) {
            ingredientsArr = ingredientsArr.slice(0,5)
        }

        setFirebaseData(ingredientsArr)
        setItems(dropdownArr)

        ingredientsArr.forEach((ing, i) => {
            if((i+1) === ingredientsArr.length) {   
                ingredientsStr += `${ing.itemObj.title.replace(/\s+/g, '')}`
                
            } else {
                ingredientsStr += `${ing.itemObj.title.replace(/\s+/g, '')},+`
            }
                })


        axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=39f4abc5175f4647aff9f73a69ec58d6&ingredients=${ingredientsStr}&number=5`)
            .then(res => {
                res.data.forEach(recipe => {
                    recipeArr.push({title: recipe.title, img: recipe.image, ingTotal: recipe.usedIngredientCount + recipe.missedIngredientCount, ingUsedCount: recipe.usedIngredientCount, ingMatch: recipe.usedIngredients.map(recipe => {return recipe.name}),ingMissing: recipe.missedIngredients.map(recipe => {return recipe.name}), id: recipe.id}) 
                })
                setRecipeList(recipeArr)
            setIsLoading(false)
            })
        getDocs(colRefFavourite)
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                favouriteArr.push(doc.data().favObj.title)
            })
            setFavourites(favouriteArr)
        })
        })
        })
        })  
    }, [refreshing])

    const handleSwitch = (id) => {
        setRecipeIsLoading(true)
        setSelectRecipe(curr => !curr)
        setRecipeId(id)

        axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=39f4abc5175f4647aff9f73a69ec58d6&includeNutrition=false`)
        .then(res => {
            setRecipeData({source: res.data.sourceUrl, veggie: res.data.vegetarian, fullIng: res.data.extendedIngredients})
            setRecipeIsLoading(false)
        })
    }

    const handleYum = (ingObj, title, source, img, num) => {
        const firebaseIng = []
        const firebaseComp = []
        const firebaseCategory = []
        firebaseData.forEach(item => {
            firebaseCategory.push({title: item.id, category: item.itemObj.category, amount: item.itemObj.amount})
            firebaseComp.push(item.id)
        })
        ingObj.forEach(ing => {
            firebaseIng.push({title: ing.name, amount: Math.floor(ing.measures.metric.amount)})
        })
        const filteredIng = firebaseIng.filter(item => {
            return firebaseComp.includes(item.title)
        })
        filteredIng.map(item => {
          firebaseCategory.forEach(obj => {
                if(item.title === obj.title) {
                   item.category = obj.category
                   if(obj.amount.length > 1) {
                      obj.amount.slice(-1) === 'g' ? item.amount = (+obj.amount.slice(0,-1) - item.amount).toString() + 'g': item.amount = (+obj.amount - item.amount).toString()  
                   } else {
                       item.amount = (+obj.amount - item.amount).toString()
                   }
                 
                }  
            })
        })
        filteredIng.forEach(item => {
            updateDoc(doc(db, auth.currentUser.uid, 'data', item.category, item.title), {'itemObj.amount': item.amount})
        })

        const historyObj = {title: title, source: source, img: img, date: Date.now()}
        setDoc(doc(db, auth.currentUser.uid, 'data', 'History', title), {historyObj})
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
          });
        
        let scoreRef = doc(db, `${auth.currentUser.uid}`, 'score')
        updateDoc(scoreRef, {score: increment(num)})
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

    const handleFavourite = (title, source, img) => {
        const favObj = {title: title, source: source, img: img}
        setDoc(doc(db, auth.currentUser.uid, 'data', 'Favourites', title), {favObj})
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
          });
        setOptFav(oldArray => [...oldArray, title])
    }

    const handleDropDown = (value) => {
        console.log(value)
        setIsLoading(true)
       if(value.length > 0) {
          let dropDownStr = ''
          const dropDownRecipeArr = []
          value.forEach(i => {
              i.replace(/\s/g, '')
          })
           setRecipeStore(recipeList)
           setRecipeList([])
           value.forEach((choice, i) => {
            if((i+1) === choice.length) {   
                dropDownStr += `${choice}`
                
            } else {
                dropDownStr += `${choice},+`
            }
           })
        console.log(dropDownStr)
       axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=39f4abc5175f4647aff9f73a69ec58d6&ingredients=${dropDownStr}&number=5`)
           .then(res => {
               res.data.forEach(recipe => {
                   dropDownRecipeArr.push({title: recipe.title, img: recipe.image, ingTotal: recipe.usedIngredientCount + recipe.missedIngredientCount, ingUsedCount: recipe.usedIngredientCount, ingMatch: recipe.usedIngredients.map(recipe => {return recipe.name}),ingMissing: recipe.missedIngredients.map(recipe => {return recipe.name}), id: recipe.id}) 
               })
               setRecipeList(dropDownRecipeArr)
               
           })    
       } else {
           setRecipeList(recipeStore)

       }
    setIsLoading(false)
    }

    if(isLoading) return <ActivityIndicator />
    return (
        <>
        <DropDownPicker
            multiple={true}
            min={0}
            max={2}
            open={open}
            value={value}
            items={items}
            searchable={true}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={(value) => {
                handleDropDown(value)
            }}
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            />
        <ScrollView refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
          }> 
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
                        {recipeIsLoading ? <ActivityIndicator /> : <Text style={{color: 'blue'}}
                            onPress={() => Linking.openURL(recipe.source)}>
                        Click Here
                        </Text>}
                        <Text>{'Veggie?'}</Text>
                        {recipeIsLoading ? <ActivityIndicator /> : <Text>{recipeData.veggie.toString()}</Text>}
                        <CardButton title='Yum' onPress={() => {handleYum(recipeData.fullIng, recipe.title, recipeData.source, recipe.img, recipe.ingUsedCount)}}/>
                        <CardButton title='Add Missing to List' onPress={() => {handleShoppingPress(recipe.ingMissing)}}/>
                        {favourites.includes(recipe.title) || optFav.includes(recipe.title) ? <Text>Favourited</Text> : <CardButton title='Favourite' onPress={()=> {handleFavourite(recipe.title, recipeData.source, recipe.img)}}/>}
                        </>
                        : 
                        <></>}
                       
                    </Card>
                )
            })}
        </ScrollView>
        </>
    )
}