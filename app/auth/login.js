import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [busy, setBusy] = useState(false);

    const onLogin = async () => {
        try {
            setBusy(true);
            await signInWithEmailAndPassword(auth, email.trim(), pw);
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
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your Bandmate account</Text>
                
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
                
                <TouchableOpacity 
                    style={[styles.button, (busy || !email || !pw) && styles.buttonDisabled]} 
                    onPress={onLogin} 
                    disabled={busy || !email || !pw}
                >
                    {busy ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => router.push("/auth/signup")}
                >
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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