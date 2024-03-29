import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Modal,
    ActivityIndicator
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import Loader from './components/Loader';
import { dev_config } from '../screens/Constants';


const EmergencyAppPage = (props) => {
    console.log(' props ',props)
    const buttonRefs = React.useRef([]);
    const [incidentRaisedModal, setIncidentRaisedModal] = React.useState(false);
    const [showStaffLocation, setShowStaffMap] = React.useState(false);
    const [staffLocation, setStaffLocation] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
    });
    const [loader, setLoader] = React.useState(false)
    const [EmergencyTypeArrayData, setEmergencyTypeArrayData] = React.useState([]);
    let updateCalls;
    let staffLocUpdate;

    React.useEffect(() => {
        setLoader(true);
        handleCustomerThings()
    }, []);

    const handleCustomerThings = async () => {
        fetch(dev_config.baseUrlDevice + 'raiseIncident/' + props.route.params.UserID, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('raised Incident ',responseJson)
                setLoader(false);
                const isIncidentUnAssigned = responseJson.filter((item) => {
                    return item.IncidentStatusId == 1 && item.StaffAssignedId == 0
                });

                const isIncidentAssignedButPending = responseJson.filter((item) => {
                    return item.IncidentStatusId == 1 && item.StaffAssignedId != 0
                });

                console.log(isIncidentUnAssigned , ' ', isIncidentAssignedButPending);

                if (isIncidentUnAssigned.length != 0) {
                    setIncidentRaisedModal(true);
                    getIncidentUpdate();
                } else if (isIncidentAssignedButPending.length != 0) {
                    getStaffLocation(isIncidentAssignedButPending[0])
                } else {
                    getAllEmergencyTypes();
                }
            })
            .catch((error) => {
                console.log('getIncidentUpdate error ', error);
            })
    }

    const getIncidentUpdate = () => {
        updateCalls = setInterval(async () => {
            await fetch(dev_config.baseUrlDevice + 'raiseIncident/' + props.route.params.UserID, {
                method: 'GET'
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    const isIncidentUnAssigned = responseJson.filter((item) => {
                        return item.IncidentStatusId && item.StaffAssignedId == 0
                    });
                    if (isIncidentUnAssigned.length == 0) {
                        clearInterval(updateCalls);
                        updateCalls = null;
                        setIncidentRaisedModal(false);
                    }
                })
                .catch((error) => {
                    console.log('getIncidentUpdate error ', error);
                })
        }, 3000);
    }

    const getAllEmergencyTypes = () => {
        fetch(dev_config.baseUrlDevice + 'emergencyTypes', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('getAllEmergencyTypes: ' + JSON.stringify(responseJson));
                setEmergencyTypeArrayData(responseJson);
                buttonRefs.current = buttonRefs.current.slice(0, EmergencyTypeArrayData.length);
                setLoader(false);
            })
            .catch((error) => {
                console.log('error ' + error);
                setLoader(false);
            })
    }

    const handleRaiseIncident = (item) => {
        setLoader(true);
        const IncidentData = {
            RaisedById: props.route.params.UserID,
            StaffAssignedId: 0,
            IncidentStatusId: 1,
            EmergencyTypeId: item.EmergencyTypeId
        }

        fetch(dev_config.baseUrlDevice + 'raiseIncident', {
            method: 'POST',
            body: JSON.stringify(IncidentData)
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('raisedIncident ' + JSON.stringify(responseJson));
                setLoader(false);
                setIncidentRaisedModal(true);
                getIncidentUpdate();
            })
            .catch((error) => {
                console.log('error ' + error);
                setLoader(false);
            })
    }

    const getStaffLocation = (incident_data) => {
        console.log('getStaffLocation: ' + JSON.stringify(incident_data));
        setShowStaffMap(true);
        staffLocUpdate = setInterval(async () => {
            await fetch('http://3.111.96.253:8000/emergencyresponseapp/userLocation/' + incident_data.StaffAssignedId, {
                method: 'GET'
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('getStaffLocation: ' + JSON.stringify(responseJson));
                    setStaffLocation({
                        latitude: responseJson.LocationLatitude,
                        longitude: responseJson.LocationLongitude
                    });

                })
                .catch((error) => {
                    console.log('getStaffLocation error ' + error);
                })
        }, 5000);
    }

    if (loader) {
        return <Loader />
    }
    if (showStaffLocation) {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 400, width: 400 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: staffLocation.latitude,
                            longitude: staffLocation.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        <Marker
                        coordinate={{latitude : staffLocation.latitude , longitude : staffLocation.longitude}}
                        />
                    </MapView>
                </View>
            </View>
        )
    }
    return (
        <View style={[{ flex: 1 }]}>
            {
                !showStaffLocation && EmergencyTypeArrayData.map((item, index) => (
                    <TouchableOpacity key={index} ref={el => buttonRefs.current[index] = el}
                        onPress={() => handleRaiseIncident(item)}
                        style={[styles.alignment, { height: 54, width: '80%', marginVertical: 10, alignSelf: 'center' }, styles.borderSettings]}>
                        <Text>{item.EmergencyType}</Text>
                    </TouchableOpacity>
                ))
            }
            <Modal visible={incidentRaisedModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: 200, width: '80%', justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: '#fff', elevation: 5 }}>
                        <ActivityIndicator size="small" color="blue" />
                        <Text style={{ marginVertical: 20 }}>Please wait while we get a staff for you</Text>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    alignment: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    borderSettings: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#363636'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

export default EmergencyAppPage;