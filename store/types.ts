import { Product, HistoryProduct } from "../src/Model/Product";

//Ce type n'existe que pour typer le state global

export type StateStore = { favoriteProducts: Product[], errors: string[], searchedProducts: { current: Product, historyProducts: HistoryProduct[] } };
