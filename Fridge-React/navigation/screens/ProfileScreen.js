import * as React from 'react';
import { View, Text, ActivityIndicator, RefreshControl, Linking, ImageBackground} from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { ScrollView } from 'react-native-gesture-handler';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, setDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase';
import { NativeBaseProvider, Box, AspectRatio, Image, Center, Stack, HStack, Heading, VStack, Input, Divider, Flex, CheckIcon, CloseIcon, FavouriteIcon, Button } from "native-base";
import { styles } from '../../stylesheet';
import Swiper from 'react-native-swiper'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  } 

export default function ProfileScreen({navigation}) {

    const image = {uri : 'https://img.freepik.com/free-vector/seamless-background-vegetables-radishes-peppers-cabbage-carrots-broccoli-peas-vector-illustration_1284-42027.jpg?t=st=1657117677~exp=1657118277~hmac=7770a747cc9275418a499832dc98fe626a1ba1ab44cf81050d5ff362d05d5346&w=1060'}


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
        <View>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        {isLoading ? <ActivityIndicator /> :  <>
        <NativeBaseProvider>
        <Button size="sm" variant="solid" colorScheme="emerald"
                    onPress={handleSignOut}
                    >
            LOG OUT
        </Button>
        <Text style={{fontSize: 15, textAlign: 'right', padding: 5}}>Level: {Math.floor(foodScore.score/ 10) } Exp: {foodScore.score % 10} / 10</Text>
         
        
        <ScrollView refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            /> 
          }> 
            <Text style={{fontSize: 25, textAlign: 'center'}}>Favourite Recipes</Text>
            {favRecipe.length === 0 ? <Text>Add some Favourites</Text> : <Swiper height={330} showsButtons={true} showsPagination={false}>{favRecipe.map(recipe => {
               return (
                <NativeBaseProvider>
                <Box alignItems="center">
                    <Box marginBottom="1%" maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                    }} _web={{
                    shadow: 2,
                    borderWidth: 0
                    }} _light={{
                    backgroundColor: "gray.50"
                    }}>
                    
                <Box marginTop="10%">
                    <AspectRatio w="100%" ratio={16 / 9}>
                    <Image source={{
                            uri: recipe.img
                        }} alt="image" />
                    </AspectRatio>
                    <Stack p="4" space={3}>
                        <Stack space={2} alignItems="center">
                            <Heading size="sm" ml="-1" textTransform={'capitalize'}>
                            {`${recipe.title}`}
                            </Heading>
                            <Button marginTop="1%" size="sm" variant="solid" colorScheme="emerald" 
                            onPress={() => Linking.openURL(recipe.source)}>
                                COOKING INSTRUCTIONS
                        </Button>
                        </Stack>
                        </Stack>
                </Box>
                </Box>
                </Box>
                </NativeBaseProvider>
                ) 
            })}</Swiper>}
            <Text style={{fontSize: 25, textAlign: 'center'}} >Recipe History</Text>
            {recipeHistory.length === 0 ? <Text>Cook something</Text> : <Swiper height={280} showsButtons={true} showsPagination={false}>{recipeHistory.reverse().map(recipe => {
                return (
                    <NativeBaseProvider>
                    <Box alignItems="center">
                        <Box marginBottom="1%" maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                        }} _web={{
                        shadow: 2,
                        borderWidth: 0
                        }} _light={{
                        backgroundColor: "gray.50"
                        }}>
                        
                    <Box marginTop="10%">
                        <AspectRatio w="100%" ratio={16 / 9}>
                        <Image source={{
                                uri: recipe.img
                            }} alt="image" />
                        </AspectRatio>
                        <Stack p="4" space={3}>
                            <Stack space={2} alignItems="center">
                                <Heading size="sm" ml="-1" textTransform={'capitalize'}>
                                {`${recipe.title}`}
                                </Heading>
                                <Button marginTop="1%" size="sm" variant="solid" colorScheme="emerald" 
                                onPress={() => Linking.openURL(recipe.source)}>
                                    COOKING INSTRUCTIONS
                            </Button>
                            </Stack>
                            </Stack>
                    </Box>
                    </Box>
                    </Box>
                    </NativeBaseProvider>
                ) 
            })}</Swiper>}
        </ScrollView>
        </NativeBaseProvider>
        </>}
    </ImageBackground>
    </View>
        </>
    )
}