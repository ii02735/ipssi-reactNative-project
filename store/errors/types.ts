export const ADD_ERROR = "ADD_ERROR";
export const REMOVE_ERROR = "REMOVE_ERROR";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const DEFAULT = "DEFAULT";

type errorMessage = string;

interface addErrorAction {
    type: typeof ADD_ERROR,
    payload: errorMessage
}

interface removeErrorAction {
    type: typeof REMOVE_ERROR,
    payload: errorMessage
}

interface clearErrorsAction {
    type: typeof CLEAR_ERRORS
}

interface defaultAction {
    type: typeof DEFAULT
}

export type errorsActionTypes = addErrorAction | removeErrorAction | clearErrorsAction | defaultAction;

export type errorState = errorMessage[];