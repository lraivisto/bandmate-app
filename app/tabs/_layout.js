import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs 
            screenOptions={{
                headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
                headerStyle: { backgroundColor: "#fff" },
                tabBarStyle: { display: "none" }, // Hide the tab bar
            }}
        >
            <Tabs.Screen 
                name="home" 
                options={{ 
                    title: "Home",
                    tabBarLabel: "Home",
                    tabBarIcon: () => null,
                }} 
            />
            <Tabs.Screen 
                name="gigs" 
                options={{ 
                    title: "Gigs",
                    tabBarLabel: "Gigs",
                    tabBarIcon: () => null,
                }} 
            />
            <Tabs.Screen 
                name="merch" 
                options={{ 
                    title: "Merchandise",
                    tabBarLabel: "Merch",
                    tabBarIcon: () => null,
                }} 
            />
            <Tabs.Screen 
                name="contact" 
                options={{ 
                    title: "Contact",
                    tabBarLabel: "Contact",
                    tabBarIcon: () => null,
                }} 
            />
        </Tabs>
    );
}