import React, { useState } from 'react';
import { StyleSheet, View as Div } from 'react-native';
import { Title } from "../components/utils/HtmlTags";
import { TouchableHighlight } from 'react-native-gesture-handler';

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
        <Title tag="h3">Que souhaitez-vous faire ?</Title>
        <Div style={styles.column}>
            {/** 
             * TouchableHighlight pour pouvoir toucher sur un groupe de composants 
             * On enferme la callback de onPress dans une constante pour optimisation
             * underlayColor pour préciser couleur au toucher
             **/}
            <TouchableHighlight onPress={() => navigation.navigate("Scanner")} /*onPress={changeStyle.bind("white")} onPressOut={changeStyle.bind("black")}*/ style={styles.circle} underlayColor="#5285e3">
                <Div>
                    <Title tag="h4" style={{color: textColor}}>Scanner code-barres</Title>
                </Div>
            </TouchableHighlight>
            <Div style={styles.circle}>
                <Title tag="h4">Favoris</Title>
            </Div>
        </Div> 
    </Div>);

};


export default HomeView;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 50,
      alignItems: "center"
    },
    column:{
      flexDirection: "column",
      justifyContent: "space-around",
      flex: 1
    },
    circle: {
        borderRadius: 100,
        borderColor: "black",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 200
    }
});