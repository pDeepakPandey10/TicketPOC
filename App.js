import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './screens/context/AuthContext';
import Login from './screens/Login';
import Track from './screens/Track';
import EmergencyAppPage from './screens/EmergencyPage';
import IncidentRaisedPage from './screens/RaisedIncidents';
import RegistrationScreen from './screens/Registration/Registration';
import Toast from 'react-native-toast-message';


const Stack = createNativeStackNavigator();

async function saveTokenToDatabase(token) {
  const userId = auth().currentUser.uid;

  // Add the token to the users datastore
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
}

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [param, setParamFunc] = React.useState({});
  const dispatch = (val, params) => {
    setIsSignedIn(val);
    setParamFunc(params);
  }
  return (
    <NavigationContainer>
      <AuthContext.Provider value={{ isSignedIn, param, dispatch }}>
        <Stack.Navigator>
          {
            isSignedIn ? <>
              <Stack.Screen name="HomePage" component={Track}/>
              <Stack.Screen name="EmergencyAppPage" component={EmergencyAppPage}/>
              <Stack.Screen name="IncidentRaisedPage" component={IncidentRaisedPage}/></> : <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
            </>
          }
        </Stack.Navigator>
      </AuthContext.Provider>
      <Toast />
    </NavigationContainer>
  );
}

export default App;