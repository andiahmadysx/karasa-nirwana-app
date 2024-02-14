import React, { useState, useEffect, useCallback } from 'react';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    NativeEventEmitter,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Text,
    ToastAndroid,
    View,
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import {
    Badge, BadgeText,
    Button,
    ButtonText,
    Center, CloseIcon,
    Heading,
    Icon,
    Modal,
    ModalBackdrop, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader
} from "@gluestack-ui/themed";
import {COLORS, SIZES} from "../../constants";
import ItemList from "../dummy/ItemList";
import {styles} from "../dummy/styles";

const ModalSetting = ({showModal, setShowModal}) => {
    const [pairedDevices, setPairedDevices] = useState([]);
    const [foundDs, setFoundDs] = useState([]);
    const [bleOpend, setBleOpend] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [boundAddress, setBoundAddress] = useState('');

    useEffect(() => {
        BluetoothManager.isBluetoothEnabled().then(
            enabled => {
                setBleOpend(Boolean(enabled));
                setLoading(false);
            },
            err => {
                err;
            },
        );




        if (Platform.OS === 'ios') {
            let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
                deviceAlreadPaired(rsp);
            });
            bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
                deviceFoundEvent(rsp);
            });
            bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                setName('');
                setBoundAddress('');
            });
        } else if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
                deviceAlreadPaired(rsp);
            });
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
                deviceFoundEvent(rsp);
            });
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                setName('');
                setBoundAddress('');
            });
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
                ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
            });
        }
        if (pairedDevices.length < 1) {
            scan();
        }
    }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

    const deviceAlreadPaired = useCallback(
        rsp => {
            var ds = null;
            if (typeof rsp.devices === 'object') {
                ds = rsp.devices;
            } else {
                try {
                    ds = JSON.parse(rsp.devices);
                } catch (e) {}
            }
            if (ds && ds.length) {
                let pared = pairedDevices;
                if (pared.length < 1) {
                    pared = pared.concat(ds || []);
                }
                setPairedDevices(pared);
            }
        },
        [pairedDevices],
    );

    const deviceFoundEvent = useCallback(
        rsp => {
            var r = null;
            try {
                if (typeof rsp.device === 'object') {
                    r = rsp.device;
                } else {
                    r = JSON.parse(rsp.device);
                }
            } catch (e) {
                // ignore error
            }

            if (r) {
                let found = foundDs || [];
                if (found.findIndex) {
                    let duplicated = found.findIndex(function (x) {
                        return x.address == r.address;
                    });
                    if (duplicated == -1) {
                        found.push(r);
                        setFoundDs(found);
                    }
                }
            }
        },
        [foundDs],
    );

    const connect = row => {
        setLoading(true);
        BluetoothManager.connect(row.address).then(
            s => {
                setLoading(false);
                setBoundAddress(row.address);
                setName(row.name || 'UNKNOWN');
            },
            e => {
                setLoading(false);
                alert(e);
            },
        );
    };

    const unPair = address => {
        setLoading(true);
        BluetoothManager.unpaire(address).then(
            s => {
                setLoading(false);
                setBoundAddress('');
                setName('');
            },
            e => {
                setLoading(false);
                alert(e);
            },
        );
    };

    const scanDevices = useCallback(() => {
        setLoading(true);
        BluetoothManager.scanDevices().then(
            s => {
                // const pairedDevices = s.paired;
                var found = s.found;
                try {
                    found = JSON.parse(found); //@FIX_it: the parse action too weired..
                } catch (e) {
                    //ignore
                }
                var fds = foundDs;
                if (found && found.length) {
                    fds = found;
                }
                setFoundDs(fds);
                setLoading(false);
            },
            er => {
                setLoading(false);
                // ignore
            },
        );
    }, [foundDs]);

    const scan = useCallback(() => {
        try {
            async function blueTooth() {
                const permissions = {
                    title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
                    message: 'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
                    buttonNeutral: 'Lain Waktu',
                    buttonNegative: 'Tidak',
                    buttonPositive: 'Boleh',
                };

                const bluetoothConnectGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    permissions,
                );
                if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    const bluetoothScanGranted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        permissions,
                    );
                    if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
                        scanDevices();
                    }
                } else {
                    // ignore akses ditolak
                }
            }
            blueTooth();
        } catch (err) {
            console.warn(err);
        }
    }, [scanDevices]);

    const scanBluetoothDevice = async () => {
        setLoading(true);
        try {
            const request = await requestMultiple([
                PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ]);

            if (request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED) {
                scanDevices();
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <Center>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                }}
                size={'md'}
            >
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg"></Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <ScrollView style={styles.container}>
                            <View style={styles.bluetoothStatusContainer}>

                                <Text style={[styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA'),
                                    {borderRadius: SIZES.small}
                                ]}>
                                    Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
                                </Text>
                            </View>
                            {!bleOpend && <Text style={styles.bluetoothInfo}>Please enable your Bluetooth</Text>}
                            <Text style={styles.sectionTitle}>Connected Printer : </Text>
                            {boundAddress.length > 0 && (
                                <ItemList
                                    label={name}
                                    value={boundAddress}
                                    onPress={() => unPair(boundAddress)}
                                    actionText="Disconnect"
                                    color="#E9493F"
                                />
                            )}
                            {boundAddress.length < 1 && (
                                <Text style={styles.printerInfo}>No printer connected.</Text>
                            )}
                            <Text style={styles.sectionTitle}>Connected Bluetooth : </Text>
                            {loading ? <ActivityIndicator animating={true}/> : null}
                            <View style={styles.containerList}>
                                {pairedDevices.map((item, index) => {
                                    return (
                                        <ItemList
                                            key={index}
                                            onPress={() => connect(item)}
                                            label={item.name}
                                            value={item.address}
                                            connected={item.address === boundAddress}
                                            actionText="Connect"
                                            color={COLORS.secondary}
                                        />
                                    );
                                })}
                            </View>
                            <Button
                                onPress={() => scanBluetoothDevice()}
                                style={{
                                    borderRadius: SIZES.small,
                                    height: SIZES.xxLarge + SIZES.medium,
                                    backgroundColor: COLORS.primary
                                }}
                            >
                                <ButtonText>Scan Bluetooth</ButtonText>
                            </Button>
                            <View style={{height: 100}}/>
                        </ScrollView>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            size="sm"
                            action="primary"
                            borderWidth="$0"

                            style={{
                                borderRadius: SIZES.small,
                                paddingHorizontal: SIZES.xxLarge
                            }}
                            onPress={() => {
                                setShowModal(false)
                            }}
                            bg="$success700"
                            $hover-bg="$success800"
                            $active-bg="$success900"
                        >
                            <ButtonText>OK</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    );
};

export default ModalSetting;
