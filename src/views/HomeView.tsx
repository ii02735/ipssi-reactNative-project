import React, { useState } from 'react';
import { StyleSheet, View as Div, Text } from 'react-native';
import { Title } from "../components/utils/HtmlTags";
import { TouchableHighlight } from 'react-native-gesture-handler';
import { FlatGrid } from "react-native-super-grid";
import SquareNavElement from '../components/SquareNavElement';
/**
 * Injection de l'objet navigation afin
 * de pouvoir naviguer sur plusieurs autres
 * écrans.
 * Ici sur l'écran du scanner, et celui des
 * produits favoris
 */

const HomeView = ({navigation}:any):JSX.Element => {

    const [textColor,setTextColor] = useState("black");

    const changeStyle = (color:string):void => {
        setTextColor(color);
    } 

    return (
    <Div style={styles.container}>
        <Title tag="h4">Que souhaitez-vous faire ?</Title>
        <Div style={styles.column}>
            <FlatGrid style={styles.grid} data={[
                {  key: "Scanner", color: "#1389b0", underlay: "#51c6ed", route: "Scanner" },
                {  key: "Favoris", color: "orange", underlay: "gold", route: "Produits favoris"  },
                {  key: "Historique", color: "#8a4394", underlay: "purple", route: "Historique" }
            ]} renderItem={({ item }) => 
               <SquareNavElement key={item.key} navigation={navigation} { ...item }>
                   <Title tag="h4" style={{ color: "white" }}>{item.key}</Title>
               </SquareNavElement>} />
        </Div>  
    </Div>);

};


export default HomeView;

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      backgroundColor: '#fff',
      padding: 30,
      alignItems: "center"
    },
    column:{
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center"
    },
    grid: {
        flex: 1,
        marginTop: 40
    }
});