import React, { useEffect, useState } from "react";
import fetch from "isomorphic-fetch";
import { StyleSheet, View as Div, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Title } from "../components/utils/HtmlTags";
import Product from "../Model/Product";

const ResultsView = ({ navigation, route }:any) => {
    //Typage de l'objet state + du type de paramètre pour le setter + typage de la méthode useState
    const [product,setProduct]:[Product,React.Dispatch<Product>] = useState<Product | any>(null);

    useEffect(() => {
        fetch(`https://fr.openfoodfacts.org/api/v0/product/${route.params.data}`)
        .then((response:any) => response.json())
        .then((object:any) => {

            const { generic_name_fr, brands, id, countries, stores, manufacturing_places, ingredients_text, image_front_url, labels, _keywords }= object.product;
            const ciqual_food_name:string = object.product.category_properties["ciqual_food_name:fr"];
            const entry_dates_tags:string = object.product.entry_dates_tags[0]; 
            
            setProduct({ nom: generic_name_fr,
                    barcode: id, 
                    ciqual: ciqual_food_name, 
                    creation_time: entry_dates_tags, 
                    etiquettes: labels, 
                    image_url: image_front_url, 
                    ingredients: ingredients_text, 
                    keywords: _keywords, 
                    magasins_vente: stores, 
                    marque: brands, 
                    pays_producteur: manufacturing_places, 
                    pays_vente: countries });
        })
    },[])

    return (
        <Div style={styles.container}>{
            product ? 
            <Div style={styles.detailsProduct}>
                <Title tag="h3">{product.nom}</Title>
                <Title tag="h5">Code-barres : {product.barcode}</Title>
                <Title tag="h5">Classification CIQUAL : {product.ciqual}</Title>
            </Div>
            : <ActivityIndicator size="large"/>
            }
        </Div>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      alignItems: "center"
    },
    detailsProduct: {
      flex: 1,
      justifyContent: "space-around"
    }
});

export default ResultsView;