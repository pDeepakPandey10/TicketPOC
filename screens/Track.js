/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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
  Dimensions,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';


import { useAuthContext } from './context/AuthContext';

const Track= (props) => {
  console.log('initial params ',props);
  const isDarkMode = useColorScheme() === 'dark';
  let deviceWidth = Dimensions.get('window').width;
  let deviceHeight = Dimensions.get('window').height;


  const backgroundStyle = {
    backgroundColor: '#fff',
  };

  const { param } = useAuthContext();

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
          <View style={{flexDirection:'row', alignItems:'center', }}>
          <TextInput style={[styles.textInput, {width:150, marginHorizontal:10}]} placeholder="Seat Number" textAlignVertical={'top'}></TextInput>
          <TouchableOpacity onPress={()=> {
            if(param.UserRoleId == 1){
              props.navigation.navigate('IncidentRaisedPage',{...param})
            } else {
              props.navigation.navigate('EmergencyAppPage',{...param})
            }
            
          }}
          style={{height:45, width:150, marginHorizontal:10, backgroundColor:'#00008B', alignItems:'center', borderRadius:8, marginVertical:15}}> 
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: Colors.white,
                },
              ]}>
              Submit
            </Text>
          </TouchableOpacity>
          </View>
          
          <Image
            source={require('../assets/images/seating.png')}
            style={{width: deviceWidth - 40, height: deviceHeight- 40, alignSelf: 'center', marginTop:-10}}
          />
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
    alignSelf:'center',
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
  textInput : {
      width:300,
      height:40,
      borderColor:'#DADADA',
      borderWidth:1,
      marginVertical:10,
      paddingLeft:10,
      borderRadius:8
  }
});

export default Track;
