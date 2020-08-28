import React from 'react';
import { StyleSheet, View as Div, Text, Dimensions } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

const SquareNavElement = (props:any) => {
    
    const styleContainer = Object.assign({...style.itemContainer},{ backgroundColor: props.color });

    return (
        <TouchableHighlight onPress={() => props.navigation.navigate(props.route)} style={styleContainer} underlayColor={props.underlay}>
        <Div>
            {props.children}
        </Div>
        </TouchableHighlight>
    )
}

export default SquareNavElement;

const style = StyleSheet.create({
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        borderRadius: 5,
        padding: 10,
        height: (Dimensions.get("screen").height / 8),
        width: (Dimensions.get("screen").width / 3)
    }
})