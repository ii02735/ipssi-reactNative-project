import React from "react";
import { StyleSheet, View as Div, Dimensions, Text } from 'react-native';
import { Title } from "../components/utils/HtmlTags";

const ResultsView = ({ navigation, route }:any) => {

    return (
        <Div>
            <Text>{JSON.stringify(route.params)}</Text>
        </Div>
    );
}

export default ResultsView;