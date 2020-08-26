import React, { useEffect, useState } from "react";
import fetch from "isomorphic-fetch";
import { StyleSheet, View as Div, Dimensions, Text, ActivityIndicator, Button, Image } from 'react-native';
import { Table, Row, TableWrapper, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Title, Br } from "../components/utils/HtmlTags";
import Product from "../Model/Product";
import Moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Ingredient from "../Model/Ingredient";
import Accordion from 'react-native-collapsible/Accordion';
import Markdown from "react-native-markdown-display";
import { connect } from "react-redux";
import { addNewProduct } from "../../store/favoriteProducts/actions";

/**
 * 
 * On effectue le wiring des du store aux props + des actions aux props
 */

const mapStateToProps = null; //Inutile de récupérer les produits favoris, on souhaite juste les modifier

const mapDispatchToProps = (stateStore:object,dispatch:any) => {

    return {
        updateFavorite: addNewProduct
    }
}

const ResultsView = ({ navigation, route }:any) => {
    //Typage de l'objet state + du type de paramètre pour le setter + typage de la méthode useState
    const [product,setProduct]:[Product,React.Dispatch<Product>] = useState<Product | any>(null);

    useEffect(() => {
        let mounted:boolean = true;
        fetch(`https://fr.openfoodfacts.org/api/v0/product/${route.params.data}`)
        .then((response:any) => response.json())
        .then((object:any) => {
            if(mounted){ //modifier l'état uniquement lorsque le component est bien monté (durant exécution de useEffect)
            const { generic_name, brands, id, countries, stores, manufacturing_places, image_front_url, labels, _keywords }= object.product;
            const ciqual_food_name:string = object.product.category_properties["ciqual_food_name:fr"];
            const entry_dates_tags:string = object.product.entry_dates_tags[0];
            
            let ingredientsArray:Ingredient[] = [];

            object.product.ingredients.forEach(
                ({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients }:Ingredient) => {
                    percent_min = Math.round((typeof percent_min === "number" ? percent_min : parseFloat(percent_min)) * 100) / 100;
                    percent_max = Math.round((typeof percent_max === "number" ? percent_max : parseFloat(percent_max)) * 100) / 100;
                    ingredientsArray.push({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients });
                });
            
            let product:Product = { nom: generic_name || "Produit sans nom",
                                    barcode: id, 
                                    ciqual: ciqual_food_name || "inconnue", 
                                    creation_time: Moment(entry_dates_tags).format("DD/MM/YYYY"), 
                                    etiquettes: labels, 
                                    image_url: image_front_url, 
                                    ingredients: ingredientsArray, 
                                    keywords: _keywords, 
                                    magasins_vente: stores, 
                                    marque: brands, 
                                    pays_producteur: manufacturing_places, 
                                    pays_vente: countries };
            setProduct(product);
            }
            return function (){
                mounted = false;
            }
        })
    },[])


    return (
        <Div style={styles.container}>{
            product ? 
            <ScrollView>
                <Title tag="h3">{product.nom}</Title>
                <Image source={{ uri: product.image_url }} style={{ marginVertical: 20, width: 250, height: 200 }}/>
                <Text style={{ marginTop: 15 }}>Code-barres : {product.barcode}</Text>
                <Text style={{ marginTop: 15 }}>Enseigne : {product.marque}</Text>
                <Text style={{ marginTop: 15 }}>Date de création : {product.creation_time}</Text>
                <Text style={{ marginTop: 15 }}>Pays vendeur : {product.pays_vente} </Text>
                <Text style={{ marginTop: 15 }}>Pays producteur : {product.pays_producteur}</Text>
                <Text style={{ marginTop: 15}}>Mots-clés : {product.keywords.join(", ")}</Text>
                
                <Br/>
                <Div style={{flex:1, flexDirection: "column", marginVertical: 10, justifyContent: "space-between"}}>   
                    <Button title="Consulter ingrédients" onPress={() => navigation.navigate("Ingrédients",{ product })}/>
                    <Br/>
                    <Button title="Ajouter aux favoris" color="orange" onPress={() => navigation.navigate("Ingrédients",{ product })}/>
                </Div>
                
            </ScrollView>
            
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
      alignItems: "center",
    },
    detailsProduct: {
      flex: 3,
      justifyContent: "space-around"
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(ResultsView);