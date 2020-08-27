import { ADD_TO_HISTORY, REMOVE_TO_HISTORY, CLEAR_HISTORY, searchedProductsState, searchedProductsTypes, SET_PRODUCT} from "./types"
import { HistoryProduct, Product } from "../../src/Model/Product";

const initialState:searchedProductsState = {
    current: null,
    historyProducts: []
}

export default function searchedProducts(state:searchedProductsState = initialState, action:searchedProductsTypes):searchedProductsState
{
    switch(action.type) {

        case ADD_TO_HISTORY:

            const statecpy1:searchedProductsState = { ...state};
            const statecpy_add:HistoryProduct[] = statecpy1.historyProducts.slice();

            statecpy_add.push(action.payload);

            statecpy1.historyProducts = statecpy_add;
            
            return statecpy1;
        
        case REMOVE_TO_HISTORY:

            //On récupère les produits ajoutés à l'exception du produit à supprimer
            const statecpy2:searchedProductsState = {...state}
            const remainingProducts:HistoryProduct[] = statecpy2.historyProducts.filter((product:HistoryProduct) => product.id !== action.payload);
            statecpy2.historyProducts = remainingProducts;

            return statecpy2;

        case CLEAR_HISTORY:

            const statecpy3:searchedProductsState = {...state};
            statecpy3.historyProducts = [];
            return statecpy3;

        case SET_PRODUCT:
            
            const statecpy4:searchedProductsState = {...state};
            statecpy4.current = action.payload;
            console.log("SET_PRODUCT",statecpy4.current)
            return statecpy4;

        default: 
            
            return state;

    }
}