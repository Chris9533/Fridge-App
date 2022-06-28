
import { db } from "./firebase.js"
import{ getDocs, collection } from 'firebase/firestore'


const colRef = collection(db, "Chris-9533/data/Fresh")

getDocs(colRef).then((snapshot) => {
  const test = []
snapshot.docs.forEach((doc) => {
test.push({...doc.data(), id : doc.id})
})
})