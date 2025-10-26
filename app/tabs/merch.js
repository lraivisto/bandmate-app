import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Platform, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { listMerch, addMerch, deleteMerch, updateMerchStock } from "../../db/merch";

export default function Merch() {
    const navigation = useNavigation();
    const [merch, setMerch] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
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

    async function refreshMerch() {
        try {
            const items = await listMerch();
            setMerch(items);
        } catch (error) {
            if (Platform.OS === 'web') {
                console.log('Database not available on web');
            } else {
                console.error('Error loading merch:', error);
            }
        }
    }

    async function onAddMerch() {
        if (!name.trim()) {
            Alert.alert("Error", "Item name is required");
            return;
        }

        try {
            setBusy(true);
            await addMerch({
                name: name.trim(),
                price: parseFloat(price) || 0,
                stock: parseInt(stock, 10) || 0,
            });
            setName("");
            setPrice("");
            setStock("");
            await refreshMerch();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setBusy(false);
        }
    }

    async function onDeleteMerch(id) {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMerch(id);
                            await refreshMerch();
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    },
                },
            ]
        );
    }

    async function updateStock(item, increment) {
        const newStock = item.stock + increment;
        if (newStock < 0) {
            Alert.alert("Error", "Stock cannot be negative");
            return;
        }

        try {
            await updateMerchStock(item.id, newStock);
            await refreshMerch();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    }

    useEffect(() => {
        refreshMerch();
    }, []);

    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Merchandise</Text>
                <Text style={styles.subtitle}>Manage your band merchandise</Text>
                
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
            <Text style={styles.title}>Merchandise</Text>
            <Text style={styles.subtitle}>Track your inventory and pricing</Text>

            {/* Add Merch Form */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Add New Item</Text>
                
                <TextInput
                    placeholder="Item name *"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Price (e.g., 20)"
                    placeholderTextColor="#999"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Stock (e.g., 50)"
                    placeholderTextColor="#999"
                    value={stock}
                    onChangeText={setStock}
                    keyboardType="number-pad"
                    style={styles.input}
                />
                
                <TouchableOpacity
                    style={[styles.submitButton, busy && styles.buttonDisabled]}
                    onPress={onAddMerch}
                    disabled={busy}
                >
                    <Text style={styles.submitButtonText}>
                        {busy ? "Adding..." : "Add Item"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List of Merch */}
            {merch.length === 0 ? (
                <View style={styles.placeholderBox}>
                    <Text style={styles.placeholderText}>🛍️</Text>
                    <Text style={styles.placeholderTitle}>No items yet</Text>
                    <Text style={styles.placeholderDesc}>
                        Add your first item using the form above
                    </Text>
                </View>
            ) : (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Inventory ({merch.length})</Text>
                    <FlatList
                        data={merch}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <View style={styles.merchItem}>
                                <View style={styles.merchHeader}>
                                    <Text style={styles.merchName}>{item.name}</Text>
                                    <TouchableOpacity
                                        onPress={() => onDeleteMerch(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.deleteButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.merchDetail}>💰 €{Number(item.price || 0).toFixed(2)}</Text>
                                <View style={styles.stockContainer}>
                                    <Text style={styles.merchDetail}>📦 Stock: {item.stock}</Text>
                                    <View style={styles.stockControls}>
                                        <TouchableOpacity
                                            onPress={() => updateStock(item, -1)}
                                            style={[styles.stockButton, styles.decrementButton]}
                                        >
                                            <Text style={styles.stockButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => updateStock(item, 1)}
                                            style={[styles.stockButton, styles.incrementButton]}
                                        >
                                            <Text style={styles.stockButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {item.stock === 0 && (
                                    <Text style={styles.outOfStock}>Out of Stock</Text>
                                )}
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
    merchItem: {
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
    merchHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    merchName: {
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
    merchDetail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    stockContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    stockControls: {
        flexDirection: 'row',
        gap: 8,
    },
    stockButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stockButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    incrementButton: {
        backgroundColor: '#34C759',
    },
    decrementButton: {
        backgroundColor: '#ff3b30',
    },
    outOfStock: {
        color: "#ff3b30",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 8,
        textAlign: "center",
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
});