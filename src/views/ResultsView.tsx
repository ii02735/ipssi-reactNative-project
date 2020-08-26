import React from "react";
import fetch from "isomorphic-fetch";
import { StyleSheet, View as Div, Dimensions, Text, ActivityIndicator, Button, Image, Alert } from 'react-native';
import { Title, Br } from "../components/utils/HtmlTags";
import Product from "../Model/Product";
import Moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Ingredient from "../Model/Ingredient";
import { connect } from "react-redux";
import { addNewProduct, removeProduct } from "../../store/favoriteProducts/actions";
import { StateStore } from "../../store/types";
import { FavProductState } from "../../store/favoriteProducts/types";
import { removeOldError } from "../../store/errors/actions";
import { errorState } from "../../store/errors/types";

/**
 * 
 * On effectue le wiring des du store aux props + des actions aux props
 */

//Nécessaire de récupérer le state des produits favoris pour pouvoir l'envoyer dans la fonction de mise à jour du state de ce dernier (updateFavorite)
const mapStateToProps = (stateStore:StateStore) => {
    return {
        favorites: stateStore.favoriteProducts,
        errors: stateStore.errors
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        addFavorite: (productState:FavProductState,product:Product) => dispatch(addNewProduct(productState,product)),
        removeFavorite: (productState:FavProductState,product:Product) => dispatch(removeProduct(productState,product)),
        removeError: (errorState:errorState,error:string) => dispatch(removeOldError(errorState,error))
    }
}

 // TODO Définir une interface générique pour le state (premier type), et le props (premier type)
 // Le type de l'interface doit regrouper les attributs nécessaires au composant (State<Product> s'il y a juste un product à manipuler par exemple)
 
class ResultsView extends React.Component<any,any>
{
    constructor(props:any)
    {
        super(props);
        this.state = {
            product: null,
            found: null
        }
        
    }

    /**
     * On fetch les data dès que le composant a été monté
     */

    componentDidMount = () => {
        //Si on est passé par la route du scanner, on scanne le nouveau produit
        if(this.props.route.params.scanner){
                let mounted:boolean = true;
                fetch(`https://fr.openfoodfacts.org/api/v0/product/${this.props.route.params.data}`)
                .then((response:any) => response.json())
                .then((object:any) => {
                    const props = this.props;
                    if(mounted && object.status === 1){ //modifier l'état uniquement lorsque le component est bien monté (durant exécution de useEffect / componentDidMount)
                        const { generic_name, brands, id, countries, stores, manufacturing_places, image_front_url, labels, _keywords }= object.product;
                        const ciqual_food_name:string = object.product.category_properties["ciqual_food_name:fr"];
                        const entry_dates_tags:string = object.product.entry_dates_tags[0];
                        
                        let ingredientsArray:Ingredient[] = [];

                        object.product.ingredients.forEach(
                            ({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients }:Ingredient) => {
                                percent_min = Math.round((typeof percent_min === "number" ? percent_min : parseFloat(percent_min)) * 100) / 100;
                                percent_max = Math.round((typeof percent_max === "number" ? percent_max : parseFloat(percent_max)) * 100) / 100;
                                ingredientsArray.push({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients });
                            });
                        
                        let product:Product = { nom: generic_name || "Produit sans nom",
                                                barcode: id, 
                                                ciqual: ciqual_food_name || "inconnue", 
                                                creation_time: Moment(entry_dates_tags).format("DD/MM/YYYY"), 
                                                etiquettes: labels, 
                                                image_url: image_front_url, 
                                                ingredients: ingredientsArray, 
                                                keywords: _keywords, 
                                                magasins_vente: stores, 
                                                marque: brands, 
                                                pays_producteur: manufacturing_places, 
                                                pays_vente: countries };
                        this.setState({ product: product, found: true })
                    }else{
                    this.setState({ found: false })
                    }
                    return function (){
                        mounted = false;
                    }
            })
        }else{ //sinon on est venu depuis la route des favoris, le produit étant déjà injecté : pas la peine de fetch
            this.setState({ product: this.props.route.params.product })
        }
    }

    askRetry = () => {
        Alert.alert(
            "Erreur",
            "La produit n'a pas pu être trouvé. Souhaitez-vous recommencer ?",
            [
                {
                    text: "NON",
                    onPress: () => this.props.navigation.navigate("Accueil"),
                    style: "cancel"
                },
                {
                    text: "OUI",
                    onPress: () => this.props.navigation.goBack()
                }
            ],{ cancelable: false })
    }

    //Doit être lancé pour demander confirmation si on souhaite supprimer le produit des favoris
    shouldComponentUpdate = (nextProps:any) =>
    {
        if(!this.props.route.params.scanner && this.props.favorites.length != nextProps.favorites.length)
        {
            this.props.navigation.goBack();
            return false; //on ne met pas à jour pour économiser des ressources
        }
        return true;
    }

    componentDidUpdate = (prevProps:any) => {
        
        // On n'affichera pas une alerte si le produit n'a pas été trouvé, car la caméra sera toujours active en arrière-plan
        // if(typeof this.state.found === "boolean" && !this.state.found)
        // {
        //     Alert.alert("Le produit n'a pas été trouvé : réessayez")
        //     this.props.navigation.navigate("Scanner")
        // }
        
        //On compare si l'ancien prop favorite (transmis par redux) est identique à celui actuellement
        if(prevProps.favorites.length != this.props.favorites.length)
            Alert.alert("Information","Le produit a bien été rajouté aux favoris")
        else{
            if(this.props.errors.length > 0)
                Alert.alert("Erreur",this.props.errors.pop());
        }
    }

    confirmDeletion = () => {
        Alert.alert(
            "Suppression du produit",
            "Confirmez-vous la suppression du produit en favoris ?",
            [
                {
                    text: "NON",
                    onPress: () => console.log("Suppression annulée"),
                    style: "cancel"
                },
                {
                    text: "OUI",
                    onPress: () => this.props.removeFavorite(this.props.favorites,this.state.product),
                    style: "destructive"
                }
            ],{ cancelable: false } 
        )
    }
    //FIXME Trouver un moyen de revenir sur l'écran d'accueil en passant les tabs
    render(){
        const {navigation,favorites,addFavorite} = this.props;
        const product:Product = this.state.product;
        let render = null;

        if(this.state.product)
        {
            render =  (<ScrollView>
                            <Title tag="h3">{product.nom}</Title>
                            <Image source={{ uri: product.image_url }} style={{ marginVertical: 20, width: 250, height: 200 }}/>
                            <Text style={{ marginTop: 15 }}>Code-barres : {product.barcode}</Text>
                            <Text style={{ marginTop: 15 }}>Enseigne : {product.marque}</Text>
                            <Text style={{ marginTop: 15 }}>Date de création : {product.creation_time}</Text>
                            <Text style={{ marginTop: 15 }}>Pays vendeur : {product.pays_vente} </Text>
                            <Text style={{ marginTop: 15 }}>Pays producteur : {product.pays_producteur}</Text>
                            <Text style={{ marginTop: 15}}>Classification CIQUAL : {product.ciqual}</Text>
                            <Text style={{ marginTop: 15}}>Mots-clés : {product.keywords.join(", ")}</Text>
                            
                            <Br/>
                            <Div style={{flex:1, flexDirection: "column", marginVertical: 10, justifyContent: "space-between"}}>   
                                <Button title="Consulter ingrédients" onPress={() => navigation.navigate("Ingrédients",{ product })}/>
                                <Br/>
                                { this.props.route.params.scanner ? <Button title="Ajouter aux favoris" color="orange" onPress={() => addFavorite(favorites,product) }/> : <Button title="Supprimer des favoris" color="crimson" onPress={this.confirmDeletion}/> }
                            </Div>
                            
                        </ScrollView>)
        }else if(this.state.found === false){
            render = <Title tag="h3" style={{ color: "crimson" }}>Le produit n'a pas été trouvé : réessayez.</Title>
        }else{
            render = <ActivityIndicator size = "large"/>
        }

        return (
            <Div style={styles.container}>
                 {render}
            </Div>
        );
    }


}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      alignItems: "center",
    },
    detailsProduct: {
      flex: 3,
      justifyContent: "space-around"
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(ResultsView);