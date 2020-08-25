import React from "react";
import { ReactElement } from "react";
import { Text, View, StyleSheet } from "react-native";

export function Title(props:any):JSX.Element
{
    return <Text style={stylesTitle[props.tag]}>{props.children}</Text>
}

export const Br = ():JSX.Element => <View style={{marginVertical: 10}}></View>

export const Hr = ({margin}:{margin: string}):JSX.Element => <View style={{borderBottomWidth: 1, marginVertical: parseInt(margin)}}></View>

const stylesTitle: any = StyleSheet.create({
    h1: {
        fontSize: 40,
        fontWeight: "bold"
    },
    h2: {
        fontSize: 30,
        fontWeight: "bold"
    },
    h3: {
        fontSize: 20,
        fontWeight: "bold"
    },
    h4: {
        fontSize: 15,
        fontWeight: "bold"
    }
});

