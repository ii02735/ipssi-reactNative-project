import { FETCH_STARTED, FETCH_FINISHED, FETCH_FAILED } from "./types"
import fetch from "isomorphic-fetch"
import Ingredient from "../../src/Model/Ingredient"
import { Product } from "../../src/Model/Product"
import Moment from "moment"
import { ADD_ERROR } from "../errors/types"
import { StateStore } from "../types"

/**
 * action thunk pour récupérer des produits
 */

export function fetchProducts(barecode:any,multiple:boolean)
{
    return function(dispatch:any,stateStore:StateStore){
        //On prévient de manière synchrone qu'on souhaite faire des requêtes
        dispatch({ type: FETCH_STARTED })
        if(!multiple){
            fetch("https://world.openfoodfacts.org/api/v0/product/"+barecode)
            .then((response) => response.json())
            .then((object) => {
                
                if(object.status === 1){
                const { product_name, brands, id, countries, stores, manufacturing_places, image_small_url, labels, _keywords }= object.product;
                const ciqual_food_name:string = object.product.category_properties["ciqual_food_name:fr"] || null;
                const entry_dates_tags:string = object.product.entry_dates_tags[0];
                
                let ingredientsArray:Ingredient[] = [];

                object.product.ingredients.forEach(
                    ({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients }:Ingredient) => {
                        percent_min = Math.round((typeof percent_min === "number" ? percent_min : parseFloat(percent_min)) * 100) / 100;
                        percent_max = Math.round((typeof percent_max === "number" ? percent_max : parseFloat(percent_max)) * 100) / 100;
                        ingredientsArray.push({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients });
                    });
                /**
                 * On fait un mapping des résultats de l'API
                 * aux propriétés de l'objet Product
                 */  
                const product:Product = { nom: product_name || "Produit sans nom",
                                        barcode: id, 
                                        ciqual: ciqual_food_name || "inconnue", 
                                        creation_time: Moment(entry_dates_tags).format("DD/MM/YYYY"), 
                                        etiquettes: labels, 
                                        image_url: image_small_url, 
                                        ingredients: ingredientsArray, 
                                        keywords: _keywords, 
                                        magasins_vente: stores, 
                                        marque: brands, 
                                        pays_producteur: manufacturing_places, 
                                        pays_vente: countries };

                     dispatch({ type: FETCH_FINISHED, payload: product })
                }else{
                     dispatch({ type: FETCH_FAILED })
                    // //S'il y a des erreurs on les envoie au state des erreurs
                    //  dispatch({ type: ADD_ERROR, error: "Le produit n'a pas pu être trouvé" })
                }
            }).catch((error) => { console.log(error), dispatch({ type: ADD_ERROR, payload: error }) })
        }

    }
}