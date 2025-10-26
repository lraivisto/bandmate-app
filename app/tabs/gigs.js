import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Platform, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { listGigs, addGig, deleteGig } from "../../db/gigs";

export default function Gigs() {
    const navigation = useNavigation();
    const [gigs, setGigs] = useState([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");
    const [city, setCity] = useState("");
    const [busy, setBusy] = useState(false);

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

    async function refreshGigs() {
        try {
            const items = await listGigs();
            setGigs(items);
        } catch (error) {
            if (Platform.OS === 'web') {
                console.log('Database not available on web');
            } else {
                console.error('Error loading gigs:', error);
            }
        }
    }

    async function onAddGig() {
        if (!title.trim()) {
            Alert.alert("Error", "Title is required");
            return;
        }

        try {
            setBusy(true);
            await addGig({
                title: title.trim(),
                date: date.trim(),
                venue: venue.trim(),
                city: city.trim(),
            });
            setTitle("");
            setDate("");
            setVenue("");
            setCity("");
            await refreshGigs();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setBusy(false);
        }
    }

    async function onDeleteGig(id) {
        Alert.alert(
            "Delete Gig",
            "Are you sure you want to delete this gig?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteGig(id);
                            await refreshGigs();
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    },
                },
            ]
        );
    }

    useEffect(() => {
        refreshGigs();
    }, []);

    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Gigs</Text>
                <Text style={styles.subtitle}>Manage your upcoming shows</Text>
                
                <View style={styles.placeholderBox}>
                    <Text style={styles.placeholderText}>💻</Text>
                    <Text style={styles.placeholderTitle}>Web Platform</Text>
                    <Text style={styles.placeholderDesc}>
                        SQLite database is only available on iOS and Android.
                        Please use the mobile app for full functionality.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gigs</Text>
            <Text style={styles.subtitle}>Manage your upcoming shows</Text>

            {/* Add Gig Form */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Add New Gig</Text>
                
                <TextInput
                    placeholder="Title *"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Date (e.g., 2025-11-15 19:00)"
                    placeholderTextColor="#999"
                    value={date}
                    onChangeText={setDate}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Venue"
                    placeholderTextColor="#999"
                    value={venue}
                    onChangeText={setVenue}
                    style={styles.input}
                />
                <TextInput
                    placeholder="City"
                    placeholderTextColor="#999"
                    value={city}
                    onChangeText={setCity}
                    style={styles.input}
                />
                
                <TouchableOpacity
                    style={[styles.submitButton, busy && styles.buttonDisabled]}
                    onPress={onAddGig}
                    disabled={busy}
                >
                    <Text style={styles.submitButtonText}>
                        {busy ? "Adding..." : "Add Gig"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List of Gigs */}
            {gigs.length === 0 ? (
                <View style={styles.placeholderBox}>
                    <Text style={styles.placeholderText}>📅</Text>
                    <Text style={styles.placeholderTitle}>No gigs yet</Text>
                    <Text style={styles.placeholderDesc}>
                        Add your first gig using the form above
                    </Text>
                </View>
            ) : (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Gigs ({gigs.length})</Text>
                    <FlatList
                        data={gigs}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <View style={styles.gigItem}>
                                <View style={styles.gigHeader}>
                                    <Text style={styles.gigTitle}>{item.title}</Text>
                                    <TouchableOpacity
                                        onPress={() => onDeleteGig(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.deleteButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                                {item.date && <Text style={styles.gigDetail}>📅 {item.date}</Text>}
                                {item.venue && <Text style={styles.gigDetail}>🏟️ {item.venue}</Text>}
                                {item.city && <Text style={styles.gigDetail}>📍 {item.city}</Text>}
                            </View>
                        )}
                    />
                </View>
            )}
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
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 12,
    },
    input: {
        backgroundColor: "#fafafa",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        color: "#1a1a1a",
    },
    submitButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 14,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 12,
    },
    gigItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    gigHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    gigTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        flex: 1,
    },
    deleteButton: {
        backgroundColor: "#ff3b30",
        borderRadius: 20,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    gigDetail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    placeholderBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 32,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    placeholderText: {
        fontSize: 48,
        marginBottom: 12,
    },
    placeholderTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 8,
    },
    placeholderDesc: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    logoutButton: {
        backgroundColor: "#ff3b30",
        borderRadius: 8,
        padding: 14,
        marginTop: 16,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});