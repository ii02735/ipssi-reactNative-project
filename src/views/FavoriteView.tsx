import React, { useEffect, useState } from "react";
import { StyleSheet, View as Div, FlatList, Button, Alert } from 'react-native';
import { connect } from "react-redux";
import { StateStore } from "../../store/types";
import { Product } from "../Model/Product";
import { removeProduct } from "../../store/favoriteProducts/actions";
import RenderItem from "../components/RenderItem";
import { CLEAR_PRODUCTS } from "../../store/favoriteProducts/types";
import Markdown from "react-native-markdown-display";
//La seule information qui nous intéresse, sont les produits favoris
const mapStateToProps = (stateStore:StateStore) => {
    return {
        favorites: stateStore.favoriteProducts
    }
}

const mapDispatchToProps = (dispatch: any) => {

    return {
        removeProduct: (stateStore:StateStore,product:Product) => dispatch(removeProduct(stateStore.favoriteProducts,product)),
        clearFavorites: () => dispatch({ type: CLEAR_PRODUCTS })
    }
}

//TODO définir le type du State, et du Props (cf ResultsView)
class FavoriteView extends React.Component<any,any>
{
    constructor(props:any)
    {
        super(props);
    }

    renderList = ({ item }:{ item: Product }):JSX.Element => {
        return <RenderItem product={item} route={this.props.route} navigation={this.props.navigation} />
    }

    askDelete = () => Alert.alert(
        "Suppression des favoris",
        "Confirmez-vous la suppression de tous les favoris ?",
        [
            {
                text: "NON",
                onPress: () => console.log("Suppression annulée"),
                style: "cancel"
            },
            {
                text: "OUI",
                onPress: () => this.props.clearFavorites(),
                style: "destructive"
            }
        ],{ cancelable: false } 
    )

    render()
    {   
        let render = this.props.favorites.length > 0 
            ?  
            <Div style={styles.container}>  
                <FlatList keyExtractor={(item:Product) => item.barcode} renderItem={this.renderList} data={this.props.favorites}/>
                <Div style={{ paddingTop: 15 }}>
                    <Button color={"crimson"} title="Supprimer les favoris" onPress={this.askDelete}/>
                </Div> 
            </Div>
            : <Markdown style={{ body: {flex: 1, fontWeight: "bold" ,backgroundColor: "#fff", padding: 20, alignItems: "center"} }}>{`### Aucun produit rajouté en favoris`}</Markdown>

      
        

        return render;
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FavoriteView);

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