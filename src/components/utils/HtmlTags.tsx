import React from "react";
import { Text, View, StyleSheet } from "react-native";

/**
 * Multiples composants utilitaires stateless
 * pour pouvoir composer des renders comme à la HTML
 */

export const Title = (props:any):JSX.Element =>{
    let style = {...stylesTitle[props.tag]};
    /**
     * Si on passe des styles supplémentaires, on les merge avec ceux existants
     */
    Object.assign(style,props.style);
    return <Text style={style}>{props.children}</Text>
}

export const Br = ():JSX.Element => <View style={{marginVertical: 10}}></View>

export const Hr = ({margin}:{margin: string}):JSX.Element => <View style={{borderBottomWidth: 1, marginVertical: parseInt(margin)}}></View>

const stylesTitle: any = StyleSheet.create({
    h1: {
        fontSize: 35,
        fontWeight: "bold"
    },
    h2: {
        fontSize: 28,
        fontWeight: "bold"
    },
    h3: {
        fontSize: 24,
        fontWeight: "bold"
    },
    h4: {
        fontSize: 20,
        fontWeight: "bold"
    }
});

