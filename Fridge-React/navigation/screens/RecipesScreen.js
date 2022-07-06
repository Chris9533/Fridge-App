import * as React from 'react';
import { View, Text, RefreshControl, ActivityIndicator, Linking } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, setDoc, doc, updateDoc, increment} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';
import moment from 'moment';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardImage, CardButton } from 'react-native-cards';
import DropDownPicker from 'react-native-dropdown-picker';
import { NativeBaseProvider, Box, AspectRatio, Image, Center, Stack, HStack, Heading, VStack, Button, Input, Divider, Flex, CheckIcon, CloseIcon, FavouriteIcon } from "native-base";
import { styles } from '../../stylesheet';

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



        axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=60ffd5fe64b645b7a13773f9bb346d89&ingredients=${ingredientsStr}&number=5`)

            .then(res => {
                res.data.forEach(recipe => {
                    recipeArr.push({title: recipe.title, img: recipe.image, ingTotal: recipe.usedIngredientCount + recipe.missedIngredientCount, ingUsedCount: recipe.usedIngredientCount, ingMatch: recipe.usedIngredients.map(recipe => {return recipe.name}),ingMissing: recipe.missedIngredients.map(recipe => {return recipe.name}), id: recipe.id}) 
                })
                setRecipeList(recipeArr)
            setIsLoading(false)
            }).catch((err) => {
                console.log(err)
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


        axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=60ffd5fe64b645b7a13773f9bb346d89&includeNutrition=false`)

        .then(res => {
            setRecipeData({source: res.data.sourceUrl, veggie: res.data.vegetarian, fullIng: res.data.extendedIngredients})
            setRecipeIsLoading(false)
        }).catch((err) => {
            console.log(err)
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


       axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=60ffd5fe64b645b7a13773f9bb346d89&ingredients=${dropDownStr}&number=5`)

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
                    <NativeBaseProvider>
                         <Box alignItems="center">
      <Box marginBottom="3%" maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
      borderColor: "coolGray.600",
      backgroundColor: "gray.700"
    }} _web={{
      shadow: 2,
      borderWidth: 0
    }} _light={{
      backgroundColor: "gray.50"
    }}>
                    <Box marginTop="10%" key={recipe.id}>
                    <AspectRatio w="100%" ratio={16 / 9}>
                        <Image source={{uri:recipe.img}} />
                        
                        </AspectRatio>

                        <Stack space={2} alignItems="center">
                        <Heading marginRight='5%' marginLeft='5%' marginTop="2%" size="sm" ml="-1" textTransform={'capitalize'} justifyContent="space-between">
                        {recipe.title}
                        </Heading>
                        <Text>{recipe.ingUsedCount}/{recipe.ingTotal}{' Ingredients Matched'}</Text>

                        
                        </Stack>
                        <Button marginTop="3%" size="sm" variant="solid" colorScheme="emerald" onPress={() => {handleSwitch(recipe.id)}}>
                        {!selectRecipe ? 'COOK THIS' : recipeId === recipe.id ? 'SOMETHING ELSE' : 'Cook This'}
                        </Button>
                        {selectRecipe && recipeId === recipe.id ? 
                        <>
                        
                        <Box alignItems="center">
                        <Box w="300">

                       
                      
                       
                        <Flex mx="3" marginTop='5%' direction="row" justify="space-around" h="7">
                         {recipeIsLoading ? <ActivityIndicator /> : <Text>Vegetarian: {recipeData.veggie === false ? <CloseIcon /> : <CheckIcon />}</Text>}
                        </Flex>
           
                        <HStack marginTop='3%' space={2} justifyContent="center">
                         <Center h="40" w="150" bg="green.300" rounded="md" shadow={3}>
                         
                        {recipe.ingMatch.map(name => {
                            return <Text style={styles.caps} key={name}>{`- ${name}`}</Text>
                        })}
                         </Center>

                         <Center h="40" w="150" bg="red.300" rounded="md" shadow={3}>
                         
                        {recipe.ingMissing.map(name => {
                            return <Text style={styles.caps} key={name}>{`- ${name}`}</Text>
                        })}
                         </Center>
      
                        </HStack>
                       
                        <Button marginTop='5%' marginBottom='5%' variant='subtle' colorScheme='emerald' size='sm' onPress={() => {handleShoppingPress(recipe.ingMissing)}}>
                            ADD MISSING ITEMS TO LIST
                        </Button>

                       

                        {recipeIsLoading ? <ActivityIndicator /> : <Button size='sm' colorScheme='emerald' variant='subtle' style={{color: 'blue'}}
                            onPress={() => Linking.openURL(recipeData.source)}>
                        COOKING INSTRUCTIONS
                        </Button>}

                     
                        <Button size='sm' marginTop='5%' marginBottom='5%' variant='subtle' colorScheme='emerald' onPress={() => {handleYum(recipeData.fullIng, recipe.title, recipeData.source, recipe.img, recipe.ingUsedCount)}}>
                        COOK NOW
                        </Button>
                       
                        </Box>
                        </Box>
                        
                        <Center h='10' rounded="md" shadow={3}>
                        {favourites.includes(recipe.title) || optFav.includes(recipe.title) ? <FavouriteIcon color='red.600' /> : <FavouriteIcon  onPress={()=> {handleFavourite(recipe.title, recipeData.source, recipe.img)}}/>}

                        </Center>
                        </>
                        : 
                        <></>}
                        
                       
                    </Box>
                    </Box>
                    </Box>
                    </NativeBaseProvider>
                )
            })}
        </ScrollView>
        </>
    )
}