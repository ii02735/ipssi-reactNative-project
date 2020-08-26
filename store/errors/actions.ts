import { errorState, errorsActionTypes, DEFAULT, ADD_ERROR, REMOVE_ERROR } from "./types";

export function addNewError(stateErrors:errorState, newError:string):errorsActionTypes
{
    if(stateErrors.find((error:string) => error === newError))
        return {
            type: DEFAULT
        } //pas la peine d'envoyer un message d'erreur si le message a déjà été stocké
    
     return {
         type: ADD_ERROR,
         payload: newError
     }   
}

export function removeOldError(stateErrors:errorState, errorToBeRemoved:string):errorsActionTypes
{
    if(!stateErrors.find((error:string) => error === errorToBeRemoved))
        return {
            type: DEFAULT
        } //pas la peine d'envoyer un message d'erreur si le message n'a pas été trouvé
    
     return {
         type: REMOVE_ERROR,
         payload: errorToBeRemoved
     }   
}