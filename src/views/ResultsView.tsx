import React from "react";
import fetch from "isomorphic-fetch";
import { StyleSheet, View as Div, Dimensions, Text, ActivityIndicator, Button, Image, Alert } from 'react-native';
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
import { fetchProducts } from "../../store/fetch/actions";
import { fetchStateType } from "../../store/fetch/types";

/**
 * 
 * On effectue le wiring des du store aux props + des actions aux props
 */

//Nécessaire de récupérer le state des produits favoris pour pouvoir l'envoyer dans la fonction de mise à jour du state de ce dernier (updateFavorite)
const mapStateToProps = (stateStore:StateStore) => {
    return {
        favorites: stateStore.favoriteProducts,
        errors: stateStore.errors,
        history: stateStore.searchedProducts.historyProducts,
        fetch: stateStore.fetch
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        addFavorite: (productState:FavProductState,product:Product) => dispatch(addNewProduct(productState,product)),
        removeFavorite: (productState:FavProductState,product:Product) => dispatch(removeProduct(productState,product)),
        updateHistory: (product:HistoryProduct) => dispatch({ type: ADD_TO_HISTORY, payload: product }),
        setCurrentProduct: (product:Product) => dispatch({ type: SET_PRODUCT, payload: product }),
        removeLastError: () => dispatch({ type: REMOVE_ERROR }),
        fetchProducts: (barecode:string) => dispatch(fetchProducts(barecode))
    }
}


 type ResultsProps = { route: any, navigation: any, favorites: Product[], 
                       errors: string[], history: HistoryProduct[], fetch: fetchStateType,
                       addFavorite: Function, removeFavorite: Function, 
                       removeLastError: Function, updateHistory: Function, 
                       setCurrentProduct: Function, fetchProducts: Function }

//Pas d'état propre à la classe (second paramètre à any)
//On utilise le store de Redux à la place
class ResultsView extends React.Component<ResultsProps,any>
{   

    constructor(props:ResultsProps)
    {
        super(props);
    }   

    /**
     * Propriété statique uniquement utilisée pour les résultats du scanner
     * On ne revient pas sur l'écran du scanner lorsqu'on clique sur le bouton headerLeft du StackNavigator
     */
    // static navigationOptions = ({navigation}:any) => {
        
    //     return {
    //         headerLeft: (props:any) => (<HeaderBackButton {...props} onPress={() => navigation.navigate("Accueil")} />)
    //     }
    // }

    /**
     * On fetch les data dès que le composant a été monté
     */

    componentDidMount = () => {
        //Si on est passé par la route du scanner, on scanne le nouveau produit
        if(this.props.route.params.fetch){

                
                let mounted:boolean = true;
               
                    if(mounted){ //modifier l'état uniquement lorsque le component est bien monté (durant exécution de useEffect / componentDidMount)
                        this.props.fetchProducts(this.props.route.params.data)
                        const product:Product|null =  this.props.fetch.loading ? null : this.props.fetch.data as Product;
                        if(product){
                            const nextHistoryId:number = this.props.history.length;
                            const searchedProduct:HistoryProduct = { id: nextHistoryId, barcode: product.barcode, nom: product.nom as string, dateSearched: Moment(new Date).format("DD/MM/YYYY") }
                            this.props.updateHistory(searchedProduct)
                            //On conserve le produit recherché pour ensuite le récupérer depuis la liste des ingrédients
                            this.props.setCurrentProduct(this.props.fetch.data);
                        }
                        
                    }
                    return function (){
                        mounted = false;
                    }
            
        }else{ //sinon on est venu depuis la route des favoris, le produit étant déjà injecté : pas la peine de fetch
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
    shouldComponentUpdate = (nextProps:ResultsProps) =>
    {
        console.log("shouldComponentUpdate")
        let result:boolean = false;
        //Si on a supprimé un produit des favoris, on revient en arrière    
        if(!this.props.route.params.fetch && this.props.favorites.length != nextProps.favorites.length)
        {
            this.props.navigation.goBack();
            result = false //on ne met pas à jour l'écran des résultats pour économiser des ressources
        }

        //Si les données ont été récupérées, on met à jour l'affichage
        //Si la liste des favoris a été mise à jour, on met à jour l'affichage pour l'alerte
        if( nextProps.fetch.data != this.props.fetch.data
        || (nextProps.favorites.length != this.props.favorites.length)) {
            console.log("Mise à jour composant")
            result = true;
        }
        //Afficher l'alerte si la prochaine prop contient une erreur
        if(nextProps.fetch.error && (this.props.fetch.error != nextProps.fetch.error))
        {
            console.log("asking for retry")
            this.askRetry();
            result = false;
        }

        //Permettre l'affichage du spinner
        if(nextProps.fetch.loading && (this.props.fetch.loading != nextProps.fetch.loading))
        {
            console.log("Mise à jour composant")
            result = true;
        }

        if((this.props.errors.length != nextProps.errors.length))
        {
            console.log("Mise à jour composant")
            result = true;
        }

        if(!result)
            console.log("no update")

        return result;
        
    }

    componentDidUpdate = (prevProps:any) => {
        console.log("ResultsView UPDATED")
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
                    onPress: () => this.props.removeFavorite(this.props.favorites,this.props.route.params.product),
                    style: "destructive"
                }
            ],{ cancelable: false } 
        )
    }
    //FIXME Trouver un moyen de revenir sur l'écran d'accueil en passant les tabs
    render(){
        const {navigation,favorites,addFavorite} = this.props;
        let product:Product = this.props.fetch.data;
        let render = null;
        console.log("result render LOADING",this.props.fetch.loading)
        if(product)
        {   
            render =  (<ScrollView>
                            <Markdown style={{ body: { fontWeight: "bold" } }}>{`## ${product.nom}`}</Markdown>
                            <ScaledImage uri={product.image_url} />
                            <Div style={styles.separator}>
                                <Text style={{ marginTop: 15, fontWeight: "bold" }}>Code-barres : {product.barcode}</Text>
                            </Div>
                            <Div style={styles.separator}>
                                <Text style={{ marginTop: 15 }}>Enseigne : {product.marque}</Text>
                            </Div>
                            <Div style={styles.separator}>
                                <Text style={{ marginTop: 15 }}>Date de création : {product.creation_time}</Text>
                            </Div>
                            <Div style={styles.separator}>
                                <Text style={{ marginTop: 15 }}>Pays vendeur : {product.pays_vente} </Text>
                            </Div>
                            <Div style={styles.separator}>
                                <Text style={{ marginTop: 15 }}>Pays producteur : {product.pays_producteur}</Text>
                            </Div>
                            <Div style={styles.separator}>
                                <Markdown style={{ body: {marginTop: 15} }}>{`Classification CIQUAL : ${product.ciqual && product.ciqual.replace(/-/g,"_")}`}</Markdown> 
                            </Div>
                            <Div style={styles.separator}>
                                <Text style={{ marginVertical: 15}}>Mots-clés : {product.keywords.join(", ")}</Text>
                            </Div>
                            
                            <Div style={{flex:1, flexDirection: "column", marginVertical: 10, justifyContent: "space-between"}}>   
                                <Button title="Consulter ingrédients" onPress={() => navigation.navigate("Ingrédients")}/>
                                <Div style={{ marginBottom: 10 }}></Div>
                                { this.props.route.params.fetch ? <Button title="Ajouter aux favoris" color="orange" onPress={() => addFavorite(favorites,product) }/> : <Button title="Supprimer des favoris" color="crimson" onPress={this.confirmDeletion}/> }
                            </Div>
                            
                        </ScrollView>)
        }else if(this.props.fetch.loading){
            console.log("loading...")
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
    },
    separator: {
        borderBottomColor: "black",
        borderWidth: 1,
        marginVertical: 3,
        padding: 3
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(ResultsView);