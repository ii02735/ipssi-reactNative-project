export default interface Ingredient {
    text: string,
    vegetarian?: "yes" | "no" | "maybe",
    vegan?: "yes" | "no" | "maybe",
    percent_min: string | number,
    percent_max: string | number,
    has_sub_ingredients?: "yes" | "no"

}