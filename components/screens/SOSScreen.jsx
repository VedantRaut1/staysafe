import React, { useState, useEffect } from "react";
import { View, Button, Alert, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Accelerometer } from "expo-sensors";

export default function SOSScreen({ navigation }) {
    const [contacts, setContacts] = useState([]);
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState(null);
    const [sosSent, setSosSent] = useState(false); // Track SOS status

    useEffect(() => {
        // Load contacts from AsyncStorage
        const loadContacts = async () => {
            try {
                const savedContacts = await AsyncStorage.getItem("emergencyContacts");
                if (savedContacts) {
                    setContacts(JSON.parse(savedContacts));
                }
            } catch (error) {
                Alert.alert("Error", "Failed to load contacts.");
            }
        };
        loadContacts();

        // Subscribe to the accelerometer
        const subscribe = () => {
            setSubscription(Accelerometer.addListener(setData));
            Accelerometer.setUpdateInterval(1000); // 1 second update interval
        };

        subscribe();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    const isShakeDetected = (data) => {
        const { x, y, z } = data;
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        return totalForce > 3;
    };

    useEffect(() => {
        if (isShakeDetected(data) && !sosSent) {
            getLocationAndSendSMS();
        }
    }, [data, sosSent]);

    const getLocationAndSendSMS = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission denied", "Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const message = `I need help! My current location is: 
            https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;

            if (contacts.length === 0) {
                Alert.alert("No Contacts", "Please add emergency contacts before sending an SOS.");
                return;
            }

            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                const { result } = await SMS.sendSMSAsync(contacts, message);
                if (result === "sent") {
                    setSosSent(true); // Set the flag to true
                    Alert.alert("SOS Sent", "Your SOS message has been sent successfully.");
                }
            } else {
                Alert.alert("Error", "SMS service is not available on this device.");
            }
        } catch (error) {
            Alert.alert("Error", `An error occurred: ${error.message}`);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button
                title="Send SOS"
                onPress={getLocationAndSendSMS}
                color="red"
            />
            {/* <FlatList
                data={contacts}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                        <Text>{item}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            /> */}
            <TouchableOpacity
                onPress={() => navigation.navigate("ManageContacts")}
                style={{
                    backgroundColor: "blue",
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                }}
            >
                <Ionicons
                    name="add"
                    size={30}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );
}
