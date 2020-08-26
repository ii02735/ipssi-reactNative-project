import { FavProductActionTypes, FavProductState, ADD_PRODUCT, REMOVE_PRODUCT } from "./types";
import Product from "../../src/Model/Product";
import { errorsActionTypes, ADD_ERROR } from "../errors/types";
import Moment from "moment";
/**
 * Écriture de logique avant de retourner un objet qui sera traité par le reducer
 */

 export function addNewProduct(stateProducts:FavProductState,newProduct:Product):FavProductActionTypes|errorsActionTypes
 {
     if(stateProducts.find((product:Product) => product.barcode === newProduct.barcode))
        return {
            type: ADD_ERROR,
            payload: "Le produit a déjà été ajouté aux favoris"
        }
    newProduct.dateFavori = Moment(new Date).format("DD/MM/YYYY");
    return {
        type: ADD_PRODUCT,
        payload: newProduct
    }
 }

 export function removeProduct(stateProduct:FavProductState,productToBeRemoved:Product):FavProductActionTypes|errorsActionTypes
 {
       if(productToBeRemoved.barcode && stateProduct.find((product:Product) => product.barcode === productToBeRemoved.barcode))
            return {
                type: REMOVE_PRODUCT,
                payload: productToBeRemoved.barcode
            }

        return {
            type: ADD_ERROR,
            payload: "Le produit n'existe pas dans les favoris"
        };
 }