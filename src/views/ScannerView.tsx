import React, { useState, useEffect } from 'react';
import { StyleSheet, View as Div, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Markdown from 'react-native-markdown-display';

const ScannerView = ({navigation}:any):JSX.Element => {

    const [permission,setPermission]  = useState<boolean>();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setPermission(status === 'granted');
        })()
    },[])

    if(permission === null)
        return <Div><Markdown style={{ body:{ fontWeight: "bold" }  }}>{`#### Demande de permissions pour utilisation de la caméra...`}</Markdown></Div>
    if(permission === false)
    return <Div><Markdown style={{ body: { color: "crimson" }}}>{`#### Échec de l'accès à la caméra...`}</Markdown></Div>
    
    //on déclenche la fonction lorsque le code-barres est analysé
    //Le type et les données du code-barres y sont injectées par BarCodeScanner
    const scannedBarCodeHandler = ({type,data}:any) => {
        navigation.navigate("Résultats",{type,data, fetch: true, previousRoute: "Accueil" })
    }

    return (
        <Div style={styles.container}>
                    <BarCodeScanner onBarCodeScanned={scannedBarCodeHandler} style={styles.barcodeScanner}>
                    
                    </BarCodeScanner>
                    {/** On fixe le décalage en hauteur */}                               
                    <Markdown style={{ body: { fontWeight: "bold", position: "absolute", top: Dimensions.get("screen").height/1.3, right: 20, left: 20, bottom: 0 }}}>{`#### Placez votre caméra sur le code-barres`}</Markdown>
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