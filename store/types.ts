import Product from "../src/Model/Product";

//Ce type n'existe que pour typer le state global

export type StateStore = { favoriteProducts: Product[], errors: string[] };
