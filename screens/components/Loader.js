import * as React from 'react';

import {
    View,
    ActivityIndicator
} from 'react-native';


const Loader = () => {
    return(
        <View style={{flex:1, backgroundColor:"#000", opacity:0.5, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size='large' color="blue" />
        </View>
    )
}

export default Loader;