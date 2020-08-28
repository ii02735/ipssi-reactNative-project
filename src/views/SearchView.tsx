import React from "react";
import { View as Div, StyleSheet, Dimensions, TextInput, Button, Text } from "react-native";
import Markdown from "react-native-markdown-display";
class SearchView extends React.Component<any,any>
{   

    constructor(props:any)
    {
        super(props);
        this.state = {
            barcode: "",
            error: "",
            disabled: true
        }
    }

    componentDidUpdate(){
        console.log("component updated")
    }

    handleChange = (value:string) => 
    {   
        let disabled:boolean = this.state.disabled;

        const pattern:RegExp = new RegExp(/^\d+$/)
        console.log(this.state.barcode.length,value.length)
        if(value.length <= 13){
            this.setState({ barcode: value })
            disabled = value.length != 13;
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
        this.props.navigation.navigate("Résultats",{ data: this.state.barcode, previousRoute: "Rechercher", fetch: true})
    }

    render()
    {
        return (<Div style={styles.container}>
                    <Markdown style={{ body: { fontWeight: "bold" }}}>{`### Saisissez le numéro de code-barres d'un produit`}</Markdown>
                 
                            <Div>
                                <TextInput style={{ borderWidth: 1, borderColor: "black", padding: 5, marginTop: 20, borderRadius: 5, width: Dimensions.get("screen").width / 1.5 }} onChangeText={this.handleChange} value={this.state.barcode}/>
                                <Div style={{ marginVertical: 30 }}>
                                    <Button disabled={this.state.disabled} title="Rechercher" onPress={this.handleSubmit}/>
                                </Div>
                                <Text style={{ color: "crimson", textAlign: "center" }}>{this.state.error}</Text>
                            </Div>

                </Div>)
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      backgroundColor: '#fff',
      padding: 30,
      alignItems: "center"
    }
})

export default SearchView;