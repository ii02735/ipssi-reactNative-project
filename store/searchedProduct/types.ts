import { HistoryProduct } from "../../src/Model/Product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const CLEAR_HISTORY = "CLEAR_HISTORY";

/**
 * Définition des différentes structures d'action possible
 */

interface addProductAction {
    type: typeof ADD_PRODUCT,
    payload: HistoryProduct
}

interface removeProductAction {
    type: typeof REMOVE_PRODUCT,
    payload: number //on utilisera l'id du produit sauvegardé
}

interface clearHistoryAction {
    type: typeof CLEAR_HISTORY,
}

export type HistoryProductTypes = addProductAction | removeProductAction | clearHistoryAction

export type HistoryProductState = HistoryProduct[]