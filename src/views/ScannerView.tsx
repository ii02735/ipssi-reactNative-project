import React, { useState, useEffect } from 'react';
import { StyleSheet, View as Div, Dimensions } from 'react-native';
import { Title } from "../components/utils/HtmlTags";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TouchableHighlight } from 'react-native-gesture-handler';

const ScannerView = ({navigation}:any):JSX.Element => {

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            console.log(status)
        })()
    },[])
    
    //on déclenche la fonction lorsque le code-barres est analysé
    //Le type et les données du code-barres y sont injectées par BarCodeScanner
    const scannedBarCodeHandler = ({type,data}:any) => {
        navigation.navigate("Résultats",{type,data})
    }

    return (
        <Div style={styles.container}>
                    <BarCodeScanner onBarCodeScanned={scannedBarCodeHandler} style={styles.barcodeScanner}>
                    
                    </BarCodeScanner>
                    {/** On fixe le décalage en hauteur */}                               
                    <Title tag="h4" style={{ position: "absolute", top: Dimensions.get("screen").height/1.3, right: 20, left: 20, bottom: 0 }}>Placez votre caméra sur le code-barres</Title>
        </Div>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      alignItems: "center"
    },
    barcodeScanner: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 60
    }
});

export default ScannerView;