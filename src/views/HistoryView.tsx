import React from "react";
import { StyleSheet, View as Div, FlatList, Button, Alert, Text } from 'react-native';
import { HistoryProduct } from "../Model/Product";
import { Title, Br } from "../components/utils/HtmlTags";
import { REMOVE_TO_HISTORY } from "../../store/searchedProduct/types";
import { connect } from "react-redux";
import { StateStore } from "../../store/types";
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import { ScrollView } from "react-native-gesture-handler";

const mapStateToProps = (stateStore:StateStore) => {
    return {
        historyProducts: stateStore.searchedProducts.historyProducts
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        removeElement: (id:number) => dispatch({ type: REMOVE_TO_HISTORY, payload: id })
    }
}

type HistoryViewProps = { navigation: any, route: any, historyProducts: HistoryProduct[] }

const HistoryView = ({ navigation, route, historyProducts }:HistoryViewProps):JSX.Element => {
    
        if(historyProducts.length > 0)
            return (
                <ScrollView>
                <ScrollView horizontal={true} style={styles.container}>
                    <Table borderStyle={{borderColor: 'black', borderWidth: 1}}>
                        <Row textStyle={{ padding: 5, width: 110, fontWeight: "bold" }} data={["code-barres","nom","date"]} />
                        {
                            historyProducts.map((product:HistoryProduct,index:number) => (
                                    <TableWrapper key={product.id} style={{ flexDirection: "row" }}>
                                        <Cell key={index} data={<Text style={{ fontWeight: "bold", width: 110, marginVertical: 10 }}>{product.barcode}</Text>} textStyle={{ padding: 10 }} />
                                        <Cell key={index+1} data={<Text style={{ width: 110, padding: 10, marginVertical: 10 }}>{product.nom}</Text>} textStyle={{ padding: 10 }} />
                                        <Cell key={index+2} data={<Text style={{ width: 110, padding: 10, marginVertical: 10 }}>{product.dateSearched}</Text>} />
                                    </TableWrapper>)
                            )
                        }
                    </Table>
                    
                </ScrollView>
                
                </ScrollView>
            )
        
        return (
            <Div style={styles.container}>
                <Title tag="h3">L'historique est vide</Title>
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