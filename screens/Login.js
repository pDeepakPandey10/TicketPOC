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
  Text,
  View,
  FlatList
} from 'react-native';

const Login = props => {
  const [listData, setListData] = React.useState([]);

  const randomColorGenerator = () => {
    fetch(
      "https://t7bnqimekxl5w4ekzvnlz6bjve0umjeq.lambda-url.ap-southeast-2.on.aws/v1/documents"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson ", JSON.stringify(responseJson));
        if (responseJson.documents.length > 0) {
          let data = responseJson.documents;
          data.sort((a,b) => {
            let D1 = new Date(a.createdAt);
            let D2 = new Date(b.createdAt);
            if(D1 > D2) {
              return -1
            } else if(D1 < D2) {
              return 1
            }
            return 0
          });
          let tempData = data.slice(0,3);
          setListData(tempData);
        }
        
      })
      .catch((error) => console.log("error api ", error));
  };

  React.useEffect(() => {
    randomColorGenerator();
  }, []);

  const renderListIytem = ({item}) => {
    console.log("item ", item);
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          width: 200,
        }}
      >
        <Text>{item.title}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={listData}
        renderItem={renderListIytem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Login;
