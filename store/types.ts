import { Product, HistoryProduct } from "../src/Model/Product";
import { Fetchable, fetchStateType } from "./fetch/types";
import { FavProductState } from "./favoriteProducts/types";
import { searchedProductsState } from "./searchedProduct/types";

//Ce type n'existe que pour typer le state global

export type StateStore = { favoriteProducts: FavProductState, errors: string[], fetch: fetchStateType ,searchedProducts: searchedProductsState };
