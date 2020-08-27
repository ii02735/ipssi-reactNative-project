import initialState from "../initialState.json";
import { ADD_PRODUCT, REMOVE_PRODUCT, CLEAR_HISTORY, HistoryProductState, HistoryProductTypes} from "./types"
import { HistoryProduct } from "../../src/Model/Product";

export default function historyProducts(state:HistoryProductState = initialState.historyProducts, action:HistoryProductTypes):HistoryProductState
{
    switch(action.type) {

        case ADD_PRODUCT:

            const statecpy_add:HistoryProductState = state.slice();

            statecpy_add.push(action.payload);

            return statecpy_add;
        
        case REMOVE_PRODUCT:

            //On récupère les produits ajoutés à l'exception du produit à supprimer
            return state.filter((product:HistoryProduct) => product.id !== action.payload);

        case CLEAR_HISTORY:

            return [];

        default: 
            
            return state;

    }
}