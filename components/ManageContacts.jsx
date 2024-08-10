import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ManageContacts({ navigation }) {
    const [contacts, setContacts] = useState([]); // Local state for contacts
    const [contact, setContact] = useState("");

    useEffect(() => {
        loadContacts();
    }, []);

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

    const saveContacts = async (newContacts) => {
        try {
            await AsyncStorage.setItem("emergencyContacts", JSON.stringify(newContacts));
            setContacts(newContacts);
        } catch (error) {
            Alert.alert("Error", "Failed to save contacts.");
        }
    };

    const addContact = () => {
        const phoneNumber = contact.replace(/\D/g, ""); // Remove non-digit characters
        if (phoneNumber.length === 10) {
            if (contacts.includes(phoneNumber)) {
                Alert.alert("Error", "This number is already in the list.");
                return;
            }
            const newContacts = [...contacts, phoneNumber];
            saveContacts(newContacts);
            setContact("");
            Keyboard.dismiss(); // Close the keyboard after adding contact
        } else {
            Alert.alert("Error", "Please enter a valid 10-digit phone number.");
        }
    };

    const removeContact = (index) => {
        const newContacts = contacts.filter((_, i) => i !== index);
        saveContacts(newContacts);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Manage Emergency Contacts</Text>
            <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder="Enter a valid 10-digit phone number"
                keyboardType="phone-pad"
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, width: "80%" }}
                onSubmitEditing={addContact} // Handle submit action
                returnKeyType="done" // Show "Done" button on keyboard
            />
            <Button
                title="Add Contact"
                onPress={addContact}
            />
            <FlatList
                data={contacts}
                renderItem={({ item, index }) => (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                        <Text>{item}</Text>
                        <Button
                            title="Remove"
                            onPress={() => removeContact(index)}
                            color="red"
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}
