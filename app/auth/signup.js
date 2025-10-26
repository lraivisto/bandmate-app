import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);

    const onSignup = async () => {
        if (pw !== confirm) return alert("Passwords do not match");
        try {
            setBusy(true);
            await createUserWithEmailAndPassword(auth, email.trim(), pw);
            router.replace("/tabs/home");
        } catch (e) {
            alert(e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Join Bandmate</Text>
                <Text style={styles.subtitle}>Create your account to get started</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={pw}
                    onChangeText={setPw}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={[styles.button, (busy || !email || !pw || pw !== confirm) && styles.buttonDisabled]}
                    onPress={onSignup}
                    disabled={busy || !email || !pw || pw !== confirm}
                >
                    {busy ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push("/auth/login")}
                >
                    <Text style={styles.linkText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
    },
    innerContainer: {
        width: "100%",
        maxWidth: 420,
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
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        color: "#1a1a1a",
    },
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    linkButton: {
        marginTop: 16,
        alignItems: "center",
    },
    linkText: {
        color: "#007AFF",
        fontSize: 14,
    },
});