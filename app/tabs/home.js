import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { listGigs } from "../../db/gigs";
import { listMerch } from "../../db/merch";

export default function Home() {
    const navigation = useNavigation();
    const [gigsCount, setGigsCount] = useState(0);
    const [merchCount, setMerchCount] = useState(0);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={doLogout}
                        style={{ marginLeft: 15 }}
                    >
                        <Text style={{ fontSize: 16, color: "#ff3b30", fontWeight: "600" }}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    async function loadStats() {
        try {
            const [gigs, merch] = await Promise.all([
                listGigs().catch(() => []),
                listMerch().catch(() => [])
            ]);
            setGigsCount(gigs.length);
            setMerchCount(merch.length);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }


    const doLogout = async () => {
        await signOut(auth);
        router.replace("/auth/login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Bandmate</Text>
                <Text style={styles.subtitle}>Manage your band's gigs and merch</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>🎸</Text>
                    <Text style={styles.statNumber}>{gigsCount}</Text>
                    <Text style={styles.statLabel}>Upcoming Gigs</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>🛍️</Text>
                    <Text style={styles.statNumber}>{merchCount}</Text>
                    <Text style={styles.statLabel}>Merch Items</Text>
                </View>
            </View>

            <View style={styles.optionsContainer}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push("/tabs/gigs")}
                >
                    <View style={styles.optionIconContainer}>
                        <Text style={styles.optionIcon}>📅</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Gigs</Text>
                        <Text style={styles.optionDescription}>
                            Manage your upcoming shows and concerts
                        </Text>
                    </View>
                    <Text style={styles.optionArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push("/tabs/merch")}
                >
                    <View style={styles.optionIconContainer}>
                        <Text style={styles.optionIcon}>🛍️</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Merchandise</Text>
                        <Text style={styles.optionDescription}>
                            Track your inventory and pricing
                        </Text>
                    </View>
                    <Text style={styles.optionArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push("/tabs/contact")}
                >
                    <View style={styles.optionIconContainer}>
                        <Text style={styles.optionIcon}>📧</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Contact</Text>
                        <Text style={styles.optionDescription}>
                            Get in touch and learn more
                        </Text>
                    </View>
                    <Text style={styles.optionArrow}>→</Text>
                </TouchableOpacity>

                {Platform.OS === 'web' && (
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={doLogout}
                    >
                        <View style={styles.optionIconContainer}>
                            <Text style={styles.optionIcon}>🚪</Text>
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Logout</Text>
                            <Text style={styles.optionDescription}>
                                Sign out of your account
                            </Text>
                        </View>
                        <Text style={[styles.optionArrow, styles.logoutArrow]}>→</Text>
                    </TouchableOpacity>
                )}
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
    logoutArrow: {
        color: "#ff3b30",
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    statsContainer: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    optionsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 16,
    },
    optionCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    optionIconContainer: {
        width: 56,
        height: 56,
        backgroundColor: "#f0f0f0",
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    optionIcon: {
        fontSize: 28,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: "#666",
    },
    optionArrow: {
        fontSize: 24,
        color: "#007AFF",
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#ff3b30",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: "auto",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

