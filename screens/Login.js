/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useAuthContext} from './context/AuthContext';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {dev_config} from '../screens/Constants';

const Login = props => {
  const isDarkMode = useColorScheme() === 'dark';
  const [user_name, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const backgroundStyle = {
    backgroundColor: '#fff',
  };

  React.useEffect(() => {
    console.log(dev_config.baseUrlLS + 'user');
    fetch(dev_config.baseUrlLS + 'user', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('users ' + JSON.stringify(responseJson));
        setUsers(responseJson);
      })
      .catch(error => {
        console.log('users error ' + error);
      });
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location',
          message: 'Grant Location Acess',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location ', granted);
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const updateLocation = (coordinates, user_data) => {
    console.log('coordinates: ' + JSON.stringify(coordinates) + ' ', user_data);
    const location_data = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };
    fetch(dev_config.baseUrlLS + 'userLocation/' + user_data.UserID, {
      method: 'PATCH',
      body: JSON.stringify(location_data),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('updateLocation: ' + responseJson);
      })
      .catch(error => {
        console.log('updateLocation error ' + error);
      });
  };

  const {dispatch} = useAuthContext();

  const handleSignIn = async () => {
    if (user_name == '' || password == '') {
      Alert.alert('Please enter username and password');
      return;
    }
    const filter_user = users.filter(item => {
      return item.UserName == user_name;
    });
    if (filter_user.length > 0) {
      Geolocation.getCurrentPosition(info => {
        updateLocation(info.coords, filter_user[0]);
      });
      dispatch(true, filter_user[0]);
    } else {
      console.log('error');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/images/ticket.jpeg')}
            style={{width: 150, height: 140, alignSelf: 'center'}}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={val => {
              setUserName(val);
            }}
            placeholder="Username"
            value={user_name}
            textAlignVertical={'top'}></TextInput>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="Password"
            onChangeText={val => {
              setPassword(val);
            }}
            secureTextEntry={true}
            textAlignVertical={'top'}></TextInput>
          <TouchableOpacity
            style={{
              height: 45,
              width: 300,
              backgroundColor: '#00008B',
              alignItems: 'center',
              borderRadius: 8,
              marginVertical: 15,
            }}
            onPress={handleSignIn}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: Colors.white,
                },
              ]}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 12,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textInput: {
    width: 300,
    height: 40,
    borderColor: '#DADADA',
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 10,
    borderRadius: 8,
  },
});

export default Login;
