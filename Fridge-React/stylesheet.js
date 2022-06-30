import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
      borderRadius: '25%',
      marginBottom: '3%'
    },
    container: {
      display: 'grid',
    },
    red: {
      color: 'red',
    },
    yellow: {
      color: 'yellow',
    },
    green: {
      color: 'green',
    },
    img: {
      flex: 1,
      // width: 80,
      // height: 80,
      resizeMode: 'contain',
      border: 'solid black 2px',
      color: 'black',

    },
    buttons: {
      display: 'flex',
      alignContent: 'center',
      backgroundColor: 'black',
      color: '',
      marginLeft: '38%',
      marginBottom: '3%',
      
    },
    search: {
      marginTop: '3%',
      marginBottom: '3%'
    },
    dropdown: {
      marginTop: '5%'
    },
    title: {
      fontSize: 35,
      marginBottom: 5,
    }

  });