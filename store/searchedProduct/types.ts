import { HistoryProduct, Product } from "../../src/Model/Product";

export const ADD_TO_HISTORY = "ADD_TO_HISTORY";
export const REMOVE_TO_HISTORY = "REMOVE_TO_HISTORY";
export const CLEAR_HISTORY = "CLEAR_HISTORY";
export const SET_PRODUCT = "SET_PRODUCT";

/**
 * Définition des différentes structures d'action possible
 */

interface addProductAction {
    type: typeof ADD_TO_HISTORY,
    payload: HistoryProduct
}

interface setCurrentProductAction {
    type: typeof SET_PRODUCT,
    payload: Product
}

interface removeProductAction {
    type: typeof REMOVE_TO_HISTORY,
    payload: number //on utilisera l'id du produit sauvegardé
}

interface clearHistoryAction {
    type: typeof CLEAR_HISTORY,
}

export type searchedProductsTypes = addProductAction | removeProductAction | clearHistoryAction | setCurrentProductAction

export type searchedProductsState = { current: Product | null, historyProducts: HistoryProduct[] }