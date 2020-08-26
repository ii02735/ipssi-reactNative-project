import initialState from "../initialState.json";
import { errorState, errorsActionTypes, ADD_ERROR, REMOVE_ERROR, CLEAR_ERRORS } from "./types";

export default function errors(state:errorState = initialState.errors, action:errorsActionTypes):errorState
{
    switch(action.type) {

        case ADD_ERROR:

            const statecpy_add:errorState = state.slice();

            statecpy_add.push(action.payload);

            return statecpy_add;
        
        case REMOVE_ERROR:

            //On récupère les produits ajoutés à l'exception du produit à supprimer
            return state.filter((error) => error !== action.payload);

        case CLEAR_ERRORS:

            return [];

        default: 
            
            return state;

    }
}