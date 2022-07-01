import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    main: {
      backgroundColor: 'black',
    },

    card: {
      borderRadius: 25,
      marginBottom: '3%',
      // backgroundColor: '',
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
      // color: 'black',
      // marginTop: '5%',
      padding: '2%',

    },
    buttons: {
      display: 'flex',
      alignContent: 'center',
      // backgroundColor: 'green',
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
      textTransform: 'capitalize',
      fontStyle: 'italic',
      color: 'orange',
    }

  });