import Product from "../../src/Model/Product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const CLEAR_PRODUCTS = "CLEAR_PRODUCTS";

/**
 * Définition des différentes structures d'action possible
 */

interface addProductAction {
    type: typeof ADD_PRODUCT,
    payload: Product
}

interface removeProductAction {
    type: typeof REMOVE_PRODUCT,
    payload: number //on utilisera l'id du produit sauvegardé
}

interface clearFavoriteAction  {
    type: typeof CLEAR_PRODUCTS
}   

export type FavProductActionTypes = addProductAction | removeProductAction | clearFavoriteAction;

/**
 * Définition du corps du state pour les produits favoris
 */

 export type FavProductState = Product[];