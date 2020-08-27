import React from "react";
import fetch from "isomorphic-fetch";
import { StyleSheet, View as Div, Dimensions, Text, ActivityIndicator, Button, Image, Alert } from 'react-native';
import { Title, Br } from "../components/utils/HtmlTags";
import { Product, HistoryProduct } from "../Model/Product";
import Moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Ingredient from "../Model/Ingredient";
import { connect } from "react-redux";
import { addNewProduct, removeProduct } from "../../store/favoriteProducts/actions";
import { StateStore } from "../../store/types";
import { FavProductState } from "../../store/favoriteProducts/types";
import { errorState, REMOVE_ERROR } from "../../store/errors/types";
import Markdown from "react-native-markdown-display";
import { HeaderBackButton } from "@react-navigation/stack";
import { ADD_TO_HISTORY, SET_PRODUCT } from "../../store/searchedProduct/types";
import ScaledImage from "../components/ResizedImage";

/**
 * 
 * On effectue le wiring des du store aux props + des actions aux props
 */

//Nécessaire de récupérer le state des produits favoris pour pouvoir l'envoyer dans la fonction de mise à jour du state de ce dernier (updateFavorite)
const mapStateToProps = (stateStore:StateStore) => {
    return {
        favorites: stateStore.favoriteProducts,
        errors: stateStore.errors,
        history: stateStore.searchedProducts.historyProducts
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        addFavorite: (productState:FavProductState,product:Product) => dispatch(addNewProduct(productState,product)),
        removeFavorite: (productState:FavProductState,product:Product) => dispatch(removeProduct(productState,product)),
        updateHistory: (product:HistoryProduct) => dispatch({ type: ADD_TO_HISTORY, payload: product }),
        setCurrentProduct: (product:Product) => dispatch({ type: SET_PRODUCT, payload: product }),
        removeLastError: () => dispatch({ type: REMOVE_ERROR })
    }
}

 type FetchProduct = { product: Product|null, found: boolean|null }

 type ResultsProps = { route: any, navigation: any, favorites: Product[], errors: string[], history: HistoryProduct[], addFavorite: Function, removeFavorite: Function, removeLastError: Function, updateHistory: Function, setCurrentProduct: Function }

class ResultsView extends React.Component<ResultsProps,FetchProduct>
{   

    constructor(props:ResultsProps)
    {
        super(props);
        this.state = { product: null, found: null}
    }   

    /**
     * Propriété statique uniquement utilisée pour les résultats du scanner
     * On ne revient pas sur l'écran du scanner lorsqu'on clique sur le bouton headerLeft du StackNavigator
     */
    static navigationOptions = ({navigation}:any) => {
        return {
            headerLeft: (props:any) => (<HeaderBackButton {...props} onPress={() => navigation.navigate("Accueil")} />)
        }
    }

    /**
     * On fetch les data dès que le composant a été monté
     */

    componentDidMount = () => {
        //Si on est passé par la route du scanner, on scanne le nouveau produit
        if(this.props.route.params.fetch){
                let mounted:boolean = true;
                fetch(`https://fr.openfoodfacts.org/api/v0/product/${this.props.route.params.data}`)
                .then((response:any) => response.json())
                .then((object:any) => {
                  
                    if(mounted && object.status === 1){ //modifier l'état uniquement lorsque le component est bien monté (durant exécution de useEffect / componentDidMount)
                        const { product_name, brands, id, countries, stores, manufacturing_places, image_small_url, labels, _keywords }= object.product;
                        const ciqual_food_name:string = object.product.category_properties["ciqual_food_name:fr"] || null;
                        const entry_dates_tags:string = object.product.entry_dates_tags[0];
                        
                        let ingredientsArray:Ingredient[] = [];

                        object.product.ingredients.forEach(
                            ({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients }:Ingredient) => {
                                percent_min = Math.round((typeof percent_min === "number" ? percent_min : parseFloat(percent_min)) * 100) / 100;
                                percent_max = Math.round((typeof percent_max === "number" ? percent_max : parseFloat(percent_max)) * 100) / 100;
                                ingredientsArray.push({ text, percent_min, percent_max, vegetarian, vegan, has_sub_ingredients });
                            });
                        /**
                         * On fait un mapping des résultats de l'API
                         * aux propriétés de l'objet Product
                         */  
                        let product:Product = { nom: product_name || "Produit sans nom",
                                                barcode: id, 
                                                ciqual: ciqual_food_name || "inconnue", 
                                                creation_time: Moment(entry_dates_tags).format("DD/MM/YYYY"), 
                                                etiquettes: labels, 
                                                image_url: image_small_url, 
                                                ingredients: ingredientsArray, 
                                                keywords: _keywords, 
                                                magasins_vente: stores, 
                                                marque: brands, 
                                                pays_producteur: manufacturing_places, 
                                                pays_vente: countries };                        
                        this.setState({ product: product, found: true })
                        const nextHistoryId:number = this.props.history.length;
                        const searchedProduct:HistoryProduct = { id: nextHistoryId, barcode: id, nom: product_name, dateSearched: Moment(new Date).format("DD/MM/YYYY") }
                        this.props.updateHistory(searchedProduct)
                        //On conserve le produit recherché pour ensuite le récupérer depuis la liste des ingrédients
                        this.props.setCurrentProduct(this.state.product);
                        
                    }else{
                    this.setState({ found: false })
                    }
                    return function (){
                        mounted = false;
                    }
            })
        }else{ //sinon on est venu depuis la route des favoris, le produit étant déjà injecté : pas la peine de fetch
            this.setState({ product: this.props.route.params.product })
            //On conserve le produit recherché pour ensuite le récupérer depuis la liste des ingrédients
            this.props.setCurrentProduct(this.props.route.params.product);
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
    shouldComponentUpdate = (prevProps:any,prevState:any) =>
    {
        //Si on a supprimé un produit des favoris, on revient en arrière
        if(!this.props.route.params.fetch && this.props.favorites.length != prevProps.favorites.length)
        {
            this.props.navigation.goBack();
            return false; //on ne met pas à jour l'écran des résultats pour économiser des ressources
        }
        if( prevState.product != this.state.product
         || (prevProps.favorites.length != this.props.favorites.length)   
         || ((prevState.found !== this.state.found && this.state.found)) ){
            console.log("Mise à jour composant")
            return true;
        }
        console.log("Résultats favoris",prevProps.favorites.length, this.props.favorites.length)
        if((prevState.found !== this.state.found && !this.state.found))
        {
            console.log("asking for retry")
            this.askRetry();
        }

        if(this.props.errors.length != prevProps.errors.length)
        {
            return true;
        }
        

        return false;
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
                this.props.removeLastError();
                console.log(this.props.errors)
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
        const { product } = this.state;
        let render = null;

        if(product)
        {
            render =  (<ScrollView>
                            <Title tag="h3">{product.nom}</Title>
                            <ScaledImage uri={product.image_url} />
                            <Text style={{ marginTop: 15 }}>Code-barres : {product.barcode}</Text>
                            <Text style={{ marginTop: 15 }}>Enseigne : {product.marque}</Text>
                            <Text style={{ marginTop: 15 }}>Date de création : {product.creation_time}</Text>
                            <Text style={{ marginTop: 15 }}>Pays vendeur : {product.pays_vente} </Text>
                            <Text style={{ marginTop: 15 }}>Pays producteur : {product.pays_producteur}</Text>
                            <Markdown style={{ body: {marginTop: 15} }}>{`Classification CIQUAL : ${product.ciqual && product.ciqual.replace(/-/g,"_")}`}</Markdown> 
                            <Text style={{ marginTop: 15}}>Mots-clés : {product.keywords.join(", ")}</Text>
                            
                            <Br/>
                            <Div style={{flex:1, flexDirection: "column", marginVertical: 10, justifyContent: "space-between"}}>   
                                <Button title="Consulter ingrédients" onPress={() => navigation.navigate("Ingrédients")}/>
                                <Br/>
                                { this.props.route.params.fetch ? <Button title="Ajouter aux favoris" color="orange" onPress={() => addFavorite(favorites,product) }/> : <Button title="Supprimer des favoris" color="crimson" onPress={this.confirmDeletion}/> }
                            </Div>
                            
                        </ScrollView>)
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