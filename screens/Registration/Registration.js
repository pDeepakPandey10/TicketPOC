import React from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Toast from 'react-native-toast-message';
import { dev_config } from '../Constants';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default RegistrationScreen = () => {
    const [FName, setFName] = React.useState("");
    const [LName, setLName] = React.useState("");
    const [userName, setUserName] = React.useState("");
    const [emailAdd, setEmailAdd] = React.useState("");
    const [pssd, setPssd] = React.useState("");
    const [userRoleArray, setUserRoleArray] = React.useState([]);
    const [value, setValue] = React.useState({});
    const [isFocus, setIsFocus] = React.useState(false);

    const navigation = useNavigation();

    const loadDropdown = async () => {
        fetch(dev_config.baseUrlDevice + 'userRoles', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0) {
                    let tempArray = responseJson.map((x) => {
                        return {
                            id: x.UserRoleId,
                            label: x.UserRoleName,
                            value: x.UserRoleName
                        }
                    });
                    setUserRoleArray(tempArray);
                } else {
                    throw 'error';
                }
            })
            .catch((error) => {
                console.log('error ', error)
            })
    }

    React.useEffect(() => {
        loadDropdown()
    }, []);

    const handleFormSubmition = () => {
        if (FName == "" || userName == "" || emailAdd == "" || Object.keys(value).length == 0) {
            return Toast.show({
                type: 'error',
                text1: 'Enter Data',
                text2: 'Field marked * are compulsory 👋'
            })
        }
        fetch(dev_config.baseUrlDevice + 'user', {
            method: 'POST',
            body: JSON.stringify({
                UserFName: FName,
                UserLName: LName,
                UserName: userName,
                UserMail: emailAdd,
                UserPassword: pssd,
                UserRoleId: value.id,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson ', JSON.stringify(responseJson));
                navigation.goBack();
            })
            .catch((error) => {
                console.log('error ', error)
            })
    }

    return (
        <View style={{
            flex: 1,
            padding: 10,
            justifyContent: 'space-between'
        }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ flex: 1 }}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput style={styles.textInput} onChangeText={(val) => {
                            setFName(val);
                        }} placeholder="First Name" value={FName} textAlignVertical={'top'} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ flex: 1 }}>Last Name</Text>
                        <TextInput style={styles.textInput} onChangeText={(val) => {
                            setLName(val);
                        }} placeholder="Last Name" value={LName} textAlignVertical={'top'} />
                    </View>
                </View>
                <Text>Choose your Role <Text style={{ color: 'red' }}>*</Text></Text>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={userRoleArray}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={value.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item);
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={styles.icon}
                            color={isFocus ? 'blue' : 'black'}
                            name="Safety"
                            size={20}
                        />
                    )}
                />


                <Text>User Name<Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput style={styles.textInput} onChangeText={(val) => {
                    setUserName(val);
                }} placeholder="Username" value={userName} textAlignVertical={'top'} />
                <Text>Email <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput style={styles.textInput} onChangeText={(val) => {
                    setEmailAdd(val);
                }} placeholder="Email" value={emailAdd} textAlignVertical={'top'} />
                <Text>Create Password <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput style={styles.textInput} onChangeText={(val) => {
                    setPssd(val);
                }} placeholder="Email" value={pssd} textAlignVertical={'top'} />

            </ScrollView>
            <TouchableOpacity style={{
                height: 45,
                width: 300,
                backgroundColor: '#00008B',
                alignItems: 'center',
                borderRadius: 8,
                marginVertical: 15,
                alignSelf: 'center'
            }}
                onPress={handleFormSubmition}>
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
    )
}

const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        height: 40,
        borderColor: '#DADADA',
        borderWidth: 1,
        marginVertical: 10,
        paddingLeft: 10,
        borderRadius: 8
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 12,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 10
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});