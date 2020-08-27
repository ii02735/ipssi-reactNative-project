import { Product } from "../../src/Model/Product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const CLEAR_PRODUCTS = "CLEAR_PRODUCTS";
export const SET_PRODUCTS = "SET_PRODUCTS";

/**
 * Définition des différentes structures d'action possible
 */

interface addProductAction {
    type: typeof ADD_PRODUCT,
    payload: Product
}

interface removeProductAction {
    type: typeof REMOVE_PRODUCT,
    payload: string //on utilisera l'id du produit sauvegardé
}

interface setProductsAction { //si on souhaite récupérer une liste de produits favoris (depuis une API par exemple)
    type: typeof SET_PRODUCTS,
    payload: FavProductState
}

interface clearFavoriteAction  {
    type: typeof CLEAR_PRODUCTS
}   

export type FavProductActionTypes = addProductAction | removeProductAction | clearFavoriteAction | setProductsAction;

/**
 * Définition du corps du state pour les produits favoris
 */

 export type FavProductState = Product[];