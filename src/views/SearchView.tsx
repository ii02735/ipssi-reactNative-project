import React from "react";
import { View as Div, StyleSheet, Dimensions, TextInput, Button, Text, ActivityIndicator, FlatList, Alert } from "react-native";
import Markdown from "react-native-markdown-display";
import { TouchableHighlight } from "react-native-gesture-handler";


type SearchViewState = { barcode: string, disabled: boolean, error: string, request: boolean, data: [] }
type SearchViewProps = { navigation: any }

class SearchView extends React.Component<SearchViewProps,SearchViewState>
{   

    constructor(props:any)
    {
        super(props);
        this.state = {
            barcode: "",
            error: "",
            disabled: true,
            request: false,
            data: []
        }
    }

    componentDidUpdate()
    {
        if(this.state.request){
            let mounted:boolean = true;
            fetch("https://world.openfoodfacts.org/code/"+this.state.barcode+".json")
            .then((response) => response.json())
            .then((data) => mounted && this.setState(data.products.length > 0 ? { error: "", data: data.products, request: false } : { data: [], error: "Aucun produit trouvé", request: false }))
            .catch((error) => { Alert.alert("Erreur",error.message ); this.setState({ request: false }) })

            return function()
            {
                mounted = false;
            }
        }
            
    }

    
    shouldComponentUpdate(nextProps:SearchViewProps,nextState:SearchViewState)
    {
        if(this.state.barcode != nextState.barcode 
            || this.state.error != nextState.error 
            || this.state.disabled != nextState.disabled 
            || this.state.request != nextState.request)
            return true;
        //Important afin de ne pas créer de boucles    
        return false;
    }

    handleChange = (value:string) => 
    {   
        let disabled:boolean = this.state.disabled;

        const pattern:RegExp = new RegExp(/^\d+$/)
        console.log(this.state.barcode.length,value.length)
        disabled = value.length < 7; //on laisse chercher à partir des 7 premiers caractères
        if(value.length <= 13){
            this.setState({ barcode: value })
        }
        if(!pattern.test(value)){
            disabled = true;
            this.setState({ error: "Chiffres uniquement" })
        }else{
            this.setState({ error: "" })
        }
        console.log("local disabled",disabled)
        this.setState({ disabled: disabled })

    }
    
    handleSubmit = () => {
        //Ajouter des x si les 13 chiffres n'ont pas été mis
        let barcode = this.state.barcode;
        if(barcode.length < 13)
        {   
            for(let i:number=0;i<13 - (this.state.barcode.length);i++)
                barcode +="x";
        }
        this.setState({ barcode: barcode })
        this.setState({ request: true })
    }

    render()
    {
        let data = null;
        if(this.state.data)
        {
            data = this.state.data.map((object:any) => ({nom: object.product_name, code: object.code}));
        }

        let render = this.state.request ? <ActivityIndicator size="large" /> : ((data != null && data.length) > 0 && (
                <Div>
                <Markdown>{`**Touchez un résultat pour pouvoir accéder à ses détails**`}</Markdown>
                <FlatList data={data} keyExtractor={(item) => item.code} 
                renderItem={({item}) => <TouchableHighlight style={{ borderWidth: 1, marginBottom: 4, borderRadius: 3, padding: 5 }} onPress={() => this.props.navigation.navigate("Résultats",{data: item.code, fetch: true, previousRoute: "Rechercher"})} ><Markdown>{`**${item.code}**    ${item.nom}`}</Markdown></TouchableHighlight>}
                />
                </Div>
            ));

        return (<Div style={styles.container}>
                    <Markdown style={{ body: { fontWeight: "bold" }}}>{`#### Saisissez au moins 7 numéros du code-barres`}</Markdown>
                 
                            <Div>
                                <TextInput style={{ borderWidth: 1, borderColor: "black", padding: 5, marginTop: 20, borderRadius: 5, width: Dimensions.get("screen").width / 1.5 }} onChangeText={this.handleChange} value={this.state.barcode}/>
                                <Div style={{ marginVertical: 30 }}>
                                    <Button disabled={this.state.disabled} title="Rechercher" onPress={this.handleSubmit}/>
                                </Div>
                                <Text style={{ color: "crimson", textAlign: "center" }}>{this.state.error}</Text>
                            </Div>
                            <Div style={{ marginTop: 5, flex: 1 }}>
                                {render}
                            </Div>

                </Div>)
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      backgroundColor: '#fff',
      padding: 20,
      alignItems: "center"
    },
    code: {
        fontWeight: "bold",
        color: "blue",
        textDecorationLine: "underline"
    }
})

export default SearchView;