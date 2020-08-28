import React from "react";
import { View as Div, StyleSheet, Dimensions, TextInput } from "react-native";
import Markdown from "react-native-markdown-display";

class SearchView extends React.Component<any,any>
{
    constructor(props:any)
    {
        super(props);
        this.state = {
            barcode: "",
            error: ""
        }
    }

    componentDidUpdate(){
        console.log("component updated")
    }

    handleChange = (value:string) => 
    {   
        this.setState({ barcode: value.replace(/[^0-9]/g,'') })
    }

    render()
    {
        return (<Div style={styles.container}>
                    <Markdown style={{ body: { fontWeight: "bold" }}}>{`### Saisissez le numéro de code-barres d'un produit`}</Markdown>
                 
                            <Div>
                                <TextInput style={{ borderWidth: 1, borderColor: "black", padding: 5, marginTop: 20, borderRadius: 10, width: Dimensions.get("screen").width / 1.5 }} onChangeText={this.handleChange} value={this.state.barcode}/>
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