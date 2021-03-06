import initialState from "../initialState.json";
import { FavProductState, FavProductActionTypes, ADD_PRODUCT, REMOVE_PRODUCT, CLEAR_PRODUCTS, SET_PRODUCTS } from "./types"
import { Product } from "../../src/Model/Product";

export default function favoriteProducts(state:FavProductState = initialState.favoriteProducts, action:FavProductActionTypes):FavProductState
{
    switch(action.type) {

        case ADD_PRODUCT:

            const statecpy_add:FavProductState = state.slice();

            statecpy_add.push(action.payload);

            return statecpy_add;
        
        case REMOVE_PRODUCT:

            //On récupère les produits ajoutés à l'exception du produit à supprimer
            return state.filter((product:Product) => product.barcode !== action.payload);

        case SET_PRODUCTS:
            
            return action.payload;

        case CLEAR_PRODUCTS:

            return [];

        default: 
            
            return state;

    }
}