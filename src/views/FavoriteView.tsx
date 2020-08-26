import React, { useEffect, useState } from "react";
import { StyleSheet, View as Div, Dimensions, Text, FlatList, ActivityIndicator, Button, Image, Alert } from 'react-native';
import { connect } from "react-redux";
import { StateStore } from "../../store/types";
import Product from "../Model/Product";
import { removeProduct } from "../../store/favoriteProducts/actions";
import RenderItem from "../components/RenderItem";
import { Title } from "../components/utils/HtmlTags";
//La seule information qui nous intéresse, sont les produits favoris
const mapStateToProps = (stateStore:StateStore) => {
    return {
        favorites: stateStore.favoriteProducts
    }
}

const mapDispatchToProps = (dispatch: any) => {

    return {
        removeProduct: (stateStore:StateStore,product:Product) => dispatch(removeProduct(stateStore.favoriteProducts,product))
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

    render()
    {
        return (
            <Div style={styles.container}>
    { this.props.favorites.length > 0 ?  <FlatList keyExtractor={(item:Product) => item.barcode} renderItem={this.renderList} data={this.props.favorites}/> : <Title tag="h4">Aucun produit rajouté en favoris</Title> }
            </Div>
        )
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