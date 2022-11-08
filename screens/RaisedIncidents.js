import * as React from 'react';

import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Modal,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Loader from './components/Loader';

const map_status = {
    1: 'Pending',
    2: 'Assigned',
    3: 'Completed',
    4: 'Aborted'
}


const IncidentRaisedPage = (props) => {
    const buttonRefs = React.useRef([]);
    const [showMaap, setShowMap] = React.useState(false);
    const [loader, setLoader] = React.useState(false)
    const [EmergencyTypeArrayData, setEmergencyTypeArrayData] = React.useState([]);
    const [staffLocation, setStaffLocation] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
    });

    React.useEffect(() => {
        setLoader(true);
        getAllRaisedIncidents();
    }, []);

    const getAllRaisedIncidents = () => {
        fetch('http://127.0.0.1:8000/emergencyresponseapp/raiseIncident', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('raised Incident: ' + JSON.stringify(responseJson));
                setEmergencyTypeArrayData(responseJson.reverse());
                setLoader(false);
                buttonRefs.current = buttonRefs.current.slice(0, EmergencyTypeArrayData.length);
            })
            .catch((error) => {
                console.log('error ' + error);
                setLoader(false);
            })
    }

    const handleStaffUpdate = (item) => {
        setLoader(true);
        item.StaffAssignedId = props.route.params.UserID;
        fetch('http://127.0.0.1:8000/emergencyresponseapp/raiseIncident/' + item.IncidentReportId, {
            method: 'PUT',
            body: JSON.stringify(item)
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('responseJson update', responseJson);
                await getUserLocation(item);
                setShowMap(true);
                getAllRaisedIncidents();
            })
            .catch((err) => {
                console.log(err);
                getAllRaisedIncidents();
            })
    }

    const getUserLocation = async (item) => {
        await fetch('http://127.0.0.1:8000/emergencyresponseapp/userLocation/' + item.StaffAssignedId, {
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
    }



    if (loader) {
        return <Loader />
    }
    return (
        <View style={[{ flex: 1 }]}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    {
                        EmergencyTypeArrayData.map((item, index) => (
                            <View key={index} ref={el => buttonRefs.current[index] = el}
                                style={[{ height: 80, margin: 10, paddingHorizontal: 10 }, styles.borderSettings]}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-between', marginVertical: 10 }}>
                                        <Text>Incident Id: {item.IncidentReportId}</Text>
                                        <Text>Status: {map_status[item.IncidentStatusId]}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-between', marginVertical: 10 }}>
                                        {
                                            item.StaffAssignedId == 0 ? <TouchableOpacity onPress={() => handleStaffUpdate(item)}
                                                style={[{ height: 25, backgroundColor: 'green', borderRadius: 8 }, styles.alignment]}>
                                                <Text style={{ color: 'white' }}>Accept</Text>
                                            </TouchableOpacity> : <View onPress={() => setShowMap(true)}
                                                style={[{ height: 25, backgroundColor: 'green', borderRadius: 8 }, styles.alignment]}>
                                                <Text style={{ color: 'white' }}>Show Map</Text>
                                            </View>
                                        }

                                        <TouchableOpacity style={[{ height: 25, backgroundColor: 'red', borderRadius: 8 }, styles.alignment]}>
                                            <Text style={{ color: 'white' }}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            <Modal visible={showMaap}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 400, width: 400 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            initialRegion={{
                                latitude: staffLocation.latitude,
                                longitude:staffLocation.longitude,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => setShowMap(false)}
                        style={[{ height: 25, backgroundColor: 'green', borderRadius: 8 }, styles.alignment]}>
                        <Text style={{ color: 'white' }}>Back</Text>
                    </TouchableOpacity>
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
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#363636'
    }
});

export default IncidentRaisedPage;