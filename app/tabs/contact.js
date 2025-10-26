import { View, Text, Linking, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Contact() {
    const navigation = useNavigation();

    useEffect(() => {
        if (Platform.OS !== 'web') {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginRight: 15 }}
                    >
                        <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "600" }}>
                            ← Back
                        </Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact</Text>
            <Text style={styles.subtitle}>Get in touch with the developer</Text>

            <View style={styles.contactBox}>
                <Text style={styles.contactIcon}>📧</Text>
                <Text style={styles.contactLabel}>Developer</Text>
                <Text style={styles.contactName}>Luka Raivisto</Text>
                <Text style={styles.contactEmail}>lraivisto@outlook.com</Text>

                <TouchableOpacity
                    style={styles.emailButton}
                    onPress={() => Linking.openURL("mailto:lraivisto@outlook.com")}
                >
                    <Text style={styles.emailButtonText}>Send Email</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.aboutBox}>
                <Text style={styles.aboutTitle}>About Bandmate</Text>
                <Text style={styles.aboutText}>
                    Bandmate is a cross-platform mobile application designed to help independent bands
                    manage their gigs, merchandise, and contacts in one place.
                </Text>
                <Text style={styles.aboutText}>
                    Built with Expo, React Native, Firebase Authentication, and SQLite.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Platform.OS === 'web' ? '5% 15%' : 20,
        backgroundColor: "#f5f5f5",
        alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
        maxWidth: Platform.OS === 'web' ? 1200 : undefined,
        alignSelf: Platform.OS === 'web' ? 'center' : undefined,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 32,
    },
    contactBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contactIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    contactLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    contactName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    contactEmail: {
        fontSize: 14,
        color: "#007AFF",
        marginBottom: 16,
    },
    emailButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    emailButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    aboutBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    aboutTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 12,
    },
    aboutText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 8,
    },
});