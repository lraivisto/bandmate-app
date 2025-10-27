import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Platform, Alert, Modal } from "react-native";
import { router, useNavigation } from "expo-router";
import { listGigs, addGig, deleteGig } from "../../db/gigs";

export default function Gigs() {
    const navigation = useNavigation();
    const [gigs, setGigs] = useState([]);
    const [title, setTitle] = useState("");
    // date selectors: day, month (1-12), year
    const [day, setDay] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [showDayModal, setShowDayModal] = useState(false);
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [showYearModal, setShowYearModal] = useState(false);
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
        // If a full date is selected, build an ISO-like YYYY-MM-DD string
        let dateStr = "";
            if (day !== null && month !== null && year !== null) {
            const selected = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            selected.setHours(0, 0, 0, 0);
                // Check the constructed date matches inputs (catches invalid combos like Feb 31)
                if (selected.getFullYear() !== year || selected.getMonth() !== (month - 1) || selected.getDate() !== day) {
                    Alert.alert("Error", "Invalid date for the selected month/year. Please choose a valid date.");
                    return;
                }
                if (selected < today) {
                Alert.alert("Error", "Date cannot be in the past. Please select today or a future date.");
                return;
            }
            const mm = String(month).padStart(2, "0");
            const dd = String(day).padStart(2, "0");
            dateStr = `${year}-${mm}-${dd}`;
        }

        try {
            setBusy(true);
            await addGig({
                title: title.trim(),
                date: dateStr,
                venue: venue.trim(),
                city: city.trim(),
            });
            setTitle("");
            setDay(null);
            setMonth(null);
            setYear(null);
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
                {/* Date selectors: Day / Month / Year */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowDayModal(true)}>
                        <Text style={styles.selectorText}>{day ? String(day).padStart(2, '0') : 'Day'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowMonthModal(true)}>
                        <Text style={styles.selectorText}>{month ? String(month).padStart(2, '0') : 'Month'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowYearModal(true)}>
                        <Text style={styles.selectorText}>{year ? String(year) : 'Year'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Day selector modal */}
                <Modal visible={showDayModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Day</Text>
                            <FlatList
                                data={Array.from({ length: 31 }, (_, i) => i + 1)}
                                keyExtractor={(n) => String(n)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => { setDay(item); setShowDayModal(false); }}
                                    >
                                        <Text style={styles.modalItemText}>{String(item).padStart(2, '0')}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setShowDayModal(false)} style={styles.modalClose}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Month selector modal */}
                <Modal visible={showMonthModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Month</Text>
                            <FlatList
                                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                                keyExtractor={(n) => String(n)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => { setMonth(item); setShowMonthModal(false); }}
                                    >
                                        <Text style={styles.modalItemText}>{String(item).padStart(2, '0')}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setShowMonthModal(false)} style={styles.modalClose}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Year selector modal */}
                <Modal visible={showYearModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Year</Text>
                            <FlatList
                                data={Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i)}
                                keyExtractor={(n) => String(n)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => { setYear(item); setShowYearModal(false); }}
                                    >
                                        <Text style={styles.modalItemText}>{String(item)}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setShowYearModal(false)} style={styles.modalClose}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    selector: {
        flex: 1,
        backgroundColor: "#fafafa",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectorText: {
        fontSize: 16,
        color: '#1a1a1a',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: '80%',
        padding: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    modalItemText: {
        fontSize: 16,
        color: '#1a1a1a',
    },
    modalClose: {
        marginTop: 8,
        padding: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#007AFF',
        fontSize: 16,
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