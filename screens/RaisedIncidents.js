import * as React from 'react';

import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Modal,
    ScrollView
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Loader from './components/Loader';
import { dev_config } from '../screens/Constants';
import { useAuthContext } from './context/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const map_status = {
    1: 'Pending',
    2: 'Assigned',
    3: 'Completed',
    4: 'Aborted'
}


const IncidentRaisedPage = (props) => {
    const [showMap, setShowMap] = React.useState(false);
    const [loader, setLoader] = React.useState(false)
    const [EmergencyTypeArrayData, setEmergencyTypeArrayData] = React.useState([]);
    const [staffLocation, setStaffLocation] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
    });
    const [selectedIncident, setSelectedIncident] = React.useState({});
    const [showQrModal, setShowQrModal] = React.useState(false);

    const { param } = useAuthContext();

    React.useEffect(() => {
        setLoader(true);
        getAllRaisedIncidents();
    }, []);

    const getAllRaisedIncidents = () => {
        fetch(dev_config.baseUrlDevice + 'raiseIncident', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('raised Incident: ' + JSON.stringify(responseJson));
                setEmergencyTypeArrayData(responseJson.reverse());
                setLoader(false);
            })
            .catch((error) => {
                console.log('error ' + error);
                setLoader(false);
            })
    }

    const handleStaffUpdate = (item) => {
        setLoader(true);
        setSelectedIncident(item);
        const _data = {
            IncidentReportId: item.IncidentReportId,
            StaffAssignedId: param.UserID
        }
        fetch(dev_config.baseUrlDevice + 'raiseIncident/' + item.IncidentReportId, {
            method: 'PUT',
            body: JSON.stringify(_data)
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
        setSelectedIncident(item);
        await fetch(dev_config.baseUrlDevice + 'userLocation/' + item.RaisedById, {
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

    const handleStatusUpdate = () => {
        setLoader(true);
        const _data = {
            IncidentReportId: selectedIncident.IncidentReportId,
            IncidentStatusId: 3
        }
        fetch(dev_config.baseUrlDevice + 'raiseIncident/' + selectedIncident.IncidentReportId, {
            method: 'PUT',
            body: JSON.stringify(_data)
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('responseJson update', responseJson);
                setLoader(false);
                setShowMap(false);
                getAllRaisedIncidents();
            })
            .catch((err) => {
                console.log(err);
                setLoader(false);
                getAllRaisedIncidents();
            })
    }

    const handleListItemClick = (item) => {
        setSelectedIncident(item);
        setShowQrModal(true);
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
                            <TouchableOpacity onPress={() => handleListItemClick(item)}
                                key={index} style={[{ height: 80, margin: 10, paddingHorizontal: 10 }, styles.borderSettings]}>
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
                                            </TouchableOpacity> : item.IncidentStatusId == 1 ? <TouchableOpacity onPress={async () => {
                                                setShowMap(true);
                                                await getUserLocation(item)
                                            }}
                                                style={[{ height: 25, backgroundColor: 'green', borderRadius: 8 }, styles.alignment]}>
                                                <Text style={{ color: 'white' }}>Show Map</Text>
                                            </TouchableOpacity> : <View style={[{ height: 25, backgroundColor: 'green', borderRadius: 8 }, styles.alignment]}>
                                                <Text style={{ color: 'white' }}>Completed</Text>
                                            </View>
                                        }

                                        <TouchableOpacity style={[{ height: 25, backgroundColor: 'red', borderRadius: 8 }, styles.alignment]}>
                                            <Text style={{ color: 'white' }}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
            <Modal visible={showMap}>
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
                                coordinate={{ latitude: staffLocation.latitude, longitude: staffLocation.longitude }}
                            />
                        </MapView>
                    </View>
                    <TouchableOpacity onPress={() => setShowMap(false)}
                        style={[{ height: 40, backgroundColor: 'green', borderRadius: 8, margin: 10 }, styles.alignment]}>
                        <Text style={{ color: 'white' }}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleStatusUpdate}
                        style={[{ height: 40, backgroundColor: 'green', borderRadius: 8, margin: 10 }, styles.alignment]}>
                        <Text style={{ color: 'white' }}>Complete</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal visible={showQrModal}>
                <View style={{
                    flex: 1
                }}>
                    <TouchableOpacity onPress={() => setShowQrModal(false)}>
                        <Ionicons name='arrow-back-circle' size={30} color={'#333'} />
                    </TouchableOpacity>

                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <QRCode value={JSON.stringify(selectedIncident)} />
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
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#363636'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

export default IncidentRaisedPage;