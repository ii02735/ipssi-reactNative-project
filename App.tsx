import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from "./src/views/HomeView";
import ScannerView from "./src/views/ScannerView";
import ResultsView from "./src/views/ResultsView";

const App = ():JSX.Element => {

  const Stack = createStackNavigator();
  /**
   * Mise en place de la navigation inter-écrans
   */
  return (
     <NavigationContainer>
       <Stack.Navigator>
          <Stack.Screen name="Accueil" component={HomeView} />
          <Stack.Screen name="Scanner" component={ScannerView}/>
          <Stack.Screen name="Résultats" component={ResultsView} />
       </Stack.Navigator>
     </NavigationContainer>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
