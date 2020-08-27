import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import HomeView from "./src/views/HomeView";
import ScannerView from "./src/views/ScannerView";
import ResultsView from "./src/views/ResultsView";
import IngredientsView from "./src/views/IngredientsView";
import favoriteProductsReducer from "./store/favoriteProducts/reducers";
import errorsReducer from "./store/errors/reducers";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import FavoriteView from "./src/views/FavoriteView";

const store = createStore(combineReducers({
  favoriteProducts: favoriteProductsReducer,
  errors: errorsReducer
}));

const App = ():JSX.Element => {

  const Stack = createStackNavigator();
  /**
   * Mise en place de la navigation inter-écrans
   */
  return (
    <Provider store={store}>
     <NavigationContainer>
       <Stack.Navigator>
          <Stack.Screen name="Accueil" component={HomeView} />
          <Stack.Screen name="Scanner" component={ScannerView}/>
          <Stack.Screen name="Résultats"  component={ResultsView} options={ResultsView.navigationOptions}/>
          <Stack.Screen name="Données produit"  component={ResultsView} />
          <Stack.Screen name="Ingrédients" component={IngredientsView} />
          <Stack.Screen name="Produits favoris" component={FavoriteView} />
       </Stack.Navigator>
     </NavigationContainer>
     </Provider>
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
