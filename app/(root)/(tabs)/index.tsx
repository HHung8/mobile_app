import { useAuth } from "@/context/AuthContext";
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
    const {signOut} = useAuth();
    return (
        <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
            <Text>HomeScreennnnnnnn</Text>
            <Text>HomeScreennnnnnnn</Text>
            <Text>HomeScreennnnnnnn</Text>
            <Text>HomeScreennnnnnnn</Text>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    )
}