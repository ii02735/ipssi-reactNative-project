import React from "react";
import { View as Div, Button, Image, Dimensions } from 'react-native';
import Markdown from "react-native-markdown-display";
import { Product } from "../Model/Product";
import { FavProductState } from "../../store/favoriteProducts/types";
import { removeProduct } from "../../store/favoriteProducts/actions";
import { connect } from "react-redux";
import ScaledImage from "./ResizedImage";

const mapDispatchToProps = (dispatch:any) => {
    return {
        removeFavorite: (productState:FavProductState,product:Product) => dispatch(removeProduct(productState,product))
    }
}

const RenderItem = ({ navigation, route, product }:{ navigation: any, route: any, product: Product }) => {
    const details = 
`#### **${product.nom}**
- Identifiant code-barres : **${product.barcode}**
- Date d'ajout : ${product.dateFavori} 
`;
    
    return (<Div key={product.barcode} style={{ borderColor: "black", borderWidth: 1, padding: 30, marginBottom: 50 }}>
            <ScaledImage uri={product.image_url} />
            <Markdown style={{ body: { margin: 10 } }}>
                {details}
            </Markdown>
            <Div>
                <Button title="Consulter" onPress={() => navigation.navigate("Données produit", {product, scanner: false})} />
            </Div>
            </Div>)
}

export default connect(null,mapDispatchToProps)(RenderItem);