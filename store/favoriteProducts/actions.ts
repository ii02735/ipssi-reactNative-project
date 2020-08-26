import { FavProductActionTypes, FavProductState, ADD_PRODUCT, REMOVE_PRODUCT } from "./types";
import Product from "../../src/Model/Product";
import { errorsActionTypes, ADD_ERROR } from "../errors/types";

/**
 * Écriture de logique avant de retourner un objet qui sera traité par le reducer
 */

 export function addNewProduct(stateProducts:FavProductState,newProduct:Product):FavProductActionTypes|errorsActionTypes
 {
     if(stateProducts.find((product:Product) => product.favoriteId === newProduct.favoriteId))
        return {
            type: ADD_ERROR,
            payload: "Le produit a déjà été ajouté aux favoris"
        }
    return {
        type: ADD_PRODUCT,
        payload: newProduct
    }
 }

 export function removeProduct(stateProduct:FavProductState,productToBeRemoved:Product):FavProductActionTypes|errorsActionTypes
 {
       if(productToBeRemoved.favoriteId && stateProduct.find((product:Product) => product.favoriteId === productToBeRemoved.favoriteId))
            return {
                type: REMOVE_PRODUCT,
                payload: productToBeRemoved.favoriteId
            }
            
        return {
            type: ADD_ERROR,
            payload: "Le produit n'existe pas dans les favoris"
        };
 }