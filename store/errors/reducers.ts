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

            //On retire la dernière erreur
            const statecpy_remove = state.slice();
            statecpy_remove.pop();
            return statecpy_remove;

        case CLEAR_ERRORS:

            return [];

        default: 
            
            return state;

    }
}