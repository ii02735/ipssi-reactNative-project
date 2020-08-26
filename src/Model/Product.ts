import Ingredient from "./Ingredient";

export default interface Product {
    nom?: string, //generic_name_fr
    marque: string, //brands
    ciqual?: string, //composition nutritionnelle d'un aliment au vu de la table Ciqual, category_properties[ciqual_food_name:fr]
    barcode: string, //pour effectuer recherche, ou depuis l'historique, ou afficher dans résultats
    pays_vente: string, //countries
    magasins_vente: string, //stores
    pays_producteur: string, //manufacturing_places
    ingredients: Ingredient[], //ingredients
    creation_time: string, //depuis entry_dates_tags : récupérer premier élément
    image_url: string, //image_front_url
    etiquettes: string, //labels
    keywords: string[], //keywords
    favoriteId?:number //pour gestion store redux
}
