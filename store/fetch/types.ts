import { Product } from "../../src/Model/Product";

export const FETCH_STARTED = "FETCH_STARTED";
export const FETCH_FINISHED = "FETCH_FINISHED";
export const FETCH_FAILED = "FETCH_FAILED";

interface fetchStartedAction {
    type: typeof FETCH_STARTED
}

interface fetchFinishedAction {
    type: typeof FETCH_FINISHED,
    payload: any
}

interface fetchFailedAction {
    type: typeof FETCH_FAILED,
}


export type fetchActionTypes = fetchStartedAction | fetchFinishedAction | fetchFailedAction

export type fetchStateType = { data: any, loading: boolean, error: boolean }