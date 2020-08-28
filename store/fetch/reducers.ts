import { fetchStateType, fetchActionTypes, FETCH_STARTED, FETCH_FINISHED, FETCH_FAILED } from "./types";

const initialState:fetchStateType = {
    loading: false,
    data: null,
    error: false
}

export function fetchDataReducer(fetchState:fetchStateType = initialState, action:fetchActionTypes):fetchStateType
{
    switch(action.type)
    {
        case FETCH_STARTED:
            console.log("FETCH_STARTED")
            return { loading: true, data: null, error: false }
        case FETCH_FINISHED:
            console.log("FETCH_FINISHED")
            return { loading: false, data: action.payload, error: false }
        case FETCH_FAILED:
            console.log("FETCH_FAILED")
            return { loading: false, data: null, error: true }    
        default:
            return fetchState;    
    }
}