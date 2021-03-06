import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    main: {
      // backgroundColor: '#00A693',
    },

    card: {
      borderRadius: 10,
      marginBottom: '3%',
      backgroundColor: 'white',
    },
    container: {
      display: 'grid',
    },
    red: {
      color: 'red',
    },
    white: {
      color: 'white',
    },
    yellow: {
      color: 'orange',
    },
    green: {
      color: 'green',
    },
    img: {
      flex: 1,
      resizeMode: 'contain',
      marginTop: '5%',
      // padding: '2%',

    },
    buttons: {
      display: 'flex',
      alignContent: 'center',
      // backgroundColor: 'white',
      marginLeft: '38%',
      marginBottom: '3%',
    },

    buttons2: {
      display: 'flex',
      alignContent: 'center',
      backgroundColor: 'white',
      color: '',
    },

    search: {
      marginTop: '3%',
      marginBottom: '3%'
    },
    dropdown: {
      marginTop: '5%'
    },
    title: {
      fontSize: 30,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      textTransform: 'capitalize',
      fontStyle: 'italic', 
      color: '#132257',
      opacity: 1,
      
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
      width: '50%' // is 50% of container width
    },
    caps: {
      textTransform: 'capitalize',
    },

    image: {
     
      width: '100%',
    height: '100%',

    }

  });