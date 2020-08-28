import React from "react";
import { StyleSheet, View as Div, FlatList, Button, Alert, Text } from 'react-native';
import { HistoryProduct } from "../Model/Product";
import { REMOVE_TO_HISTORY, CLEAR_HISTORY } from "../../store/searchedProduct/types";
import { connect } from "react-redux";
import { StateStore } from "../../store/types";
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import Markdown from "react-native-markdown-display";

const mapStateToProps = (stateStore:StateStore) => {
    return {
        historyProducts: stateStore.searchedProducts.historyProducts
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        removeElement: (id:number) => dispatch({ type: REMOVE_TO_HISTORY, payload: id }),
        removeHistory: () => dispatch({ type: CLEAR_HISTORY })
    }
}

type HistoryViewProps = { navigation: any, route: any, historyProducts: HistoryProduct[], removeHistory: Function }

const HistoryView = ({ navigation, historyProducts, removeHistory }:HistoryViewProps):JSX.Element => {

        const askDelete = () => Alert.alert(
            "Suppression de l'historique",
            "Confirmez-vous la suppression de l'historique ?",
            [
                {
                    text: "NON",
                    onPress: () => console.log("Suppression annulée"),
                    style: "cancel"
                },
                {
                    text: "OUI",
                    onPress: () => removeHistory(),
                    style: "destructive"
                }
            ],{ cancelable: false } 
        ) 

        if(historyProducts.length > 0)
            return (
                <ScrollView>
                    <Markdown style={{ body: { backgroundColor: "#fff", paddingHorizontal: 20 } }}>Cliquez **le code-barres** pour avoir les détails du produit</Markdown>
                <ScrollView horizontal={true} style={styles.container}>
                    <Table borderStyle={{borderColor: 'black', borderWidth: 1}}>
                        <Row textStyle={{ padding: 5, width: 110, fontWeight: "bold" }} data={["code-barres","nom","date"]} />
                        {
                            historyProducts.map((product:HistoryProduct,index:number) => (
                                    <TableWrapper key={product.id} style={{ flexDirection: "row" }}>
                                        <TouchableHighlight style={{borderTopWidth:1, borderRightWidth: 1,borderColor:"black", flex:1 }} underlayColor={"#6393e0"} onPress={() => navigation.navigate("Résultats",{data: product.barcode, fetch: true, previousRoute: "Historique"})}>
                                            <Cell key={index} data={<Text style={{ fontWeight: "bold", textDecorationLine:"underline",color:"#6393e0", width: 110, marginVertical: 10 }}>{product.barcode}</Text>} textStyle={{ padding: 10 }} />
                                        </TouchableHighlight>
                                        <Cell key={index+1} data={<Text style={{ width: 110, padding: 10, marginVertical: 10 }}>{product.nom}</Text>} textStyle={{ padding: 10 }} />
                                        <Cell key={index+2} data={<Text style={{ width: 110, padding: 10, marginVertical: 10 }}>{product.dateSearched}</Text>} />
                                    </TableWrapper>)
                            )
                        }
                    </Table>
                    
                </ScrollView>
                        <Div style={styles.container}>
                         <Button onPress={askDelete} color="crimson" title="Supprimer l'historique" />
                        </Div>
                </ScrollView>
            )
        
        return (
            <Div style={styles.container}>
                <Markdown style={{ body:{ fontWeight: "bold" }  }}>{`### L'historique est vide`}</Markdown>
            </Div>
        )    
}       

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 20,
      flex: 1
    },
    detailsProduct: {
      flex: 3,
      justifyContent: "space-around"
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(HistoryView);