import { StyleSheet, View as Div } from 'react-native';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import { Br } from "../components/utils/HtmlTags";
import React from "react";
import { ScrollView } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import Ingredient from '../Model/Ingredient';

const IngredientsView = ({navigation, route}:any) => {
    const { product } = route.params;

    const content = (
    <ScrollView style={{ flex: 1}}>
    <Markdown style={{ body: { backgroundColor: "#fff", paddingHorizontal: 20 } }}>En **_italique_** : les ingrédients allergènes</Markdown>
    <ScrollView horizontal={true} style={styles.container}>
        <Table borderStyle={{borderColor: 'black', borderWidth: 1}}>
            
            <Row textStyle={{ padding: 5, width: 200, fontWeight: "bold" }} data={["Intitulé","Composition min", "Composition max", "Végétarien ?", "Végan ?", "Sous-ingrédients ?"]}/>
            {
                product.ingredients.map((object:Ingredient,index:number) => (
                    <TableWrapper key={index} style={{ flexDirection: "row" }}>
                    {Object.values(object).map((cellData,index) => {

                        switch(index)
                        {
                            case 0: //parser le contenu pour les allergènes (écrit en markdown : _text_)
                                return (<Cell key={index} data={<Markdown style={{ body: { width: 200, padding: 5 }}}>{cellData}</Markdown>} textStyle={{ marginVertical: 5 }} />);
                            case 3:
                                const vegetarianStyle:string = (cellData === "yes") ? "green" : ( cellData === "maybe" ? "orange"  : "red" );
                                return (<Cell key={index} data={cellData} textStyle={{ width: 200, marginVertical: 5, padding: 5, color: vegetarianStyle }}/>);
                            case 4:
                                const veganStyle:string = (cellData === "yes") ? "green" : ( cellData === "maybe" ? "orange"  : "red" );
                                return (<Cell key={index} data={cellData} textStyle={{ width: 200, marginVertical: 5, padding: 5, color: veganStyle }}/>);
                            default: 
                                return (<Cell key={index} data={cellData} textStyle={{ width: 200, marginVertical: 5, padding: 5 }}/>);
                        }
                        
                    
                    
                    })}
                    </TableWrapper>
                ))
            }
        </Table>
        </ScrollView>
    </ScrollView>);

    return content;
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    }
});

export default IngredientsView;