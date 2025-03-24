import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constants/colors";
import CustomButton from "@/components/CustomButton";
import { AuthRequest, AuthResponse } from "@/models/auth";
import { AuthService } from "@/services/auth-service";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { updateAuth } = useAuth();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleLogin = async () => {
        setLoading(true);

        if (!email || !password) {
            setLoading(false);
            Alert.alert("Preencha os campos obrigatórios.");
            return;
        }

        try {
            const credenciais: AuthRequest = {
                login: email,
                password: password
            }

            const authService = new AuthService();
            const res: AuthResponse = await authService.login(credenciais);

            if (res) {
                updateAuth(res);
            }

        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data ||
                "Erro ao realizar login.";
        
            Alert.alert(errorMessage);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground 
                    source={{ uri: "https://images.unsplash.com/photo-1639781895346-054825a58d4a?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} 
                    style={styles.image}
                    resizeMode="cover"
                >
                </ImageBackground>

                <View style={styles.loginContainer}>
                    <View style={{gap: 20}}>
                        <View>
                            <Text style={styles.title}>Acessar</Text>
                            <Text style={styles.subtitle}>Informe suas credenciais de acesso.</Text>
                        </View>

                        <View style={{gap: 10}}>
                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                keyboardType="email-address"
                                value={email}
                                placeholderTextColor="#999"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="none"
                                onChangeText={setEmail}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Senha"
                                placeholderTextColor="#999"
                                secureTextEntry={!passwordVisible}
                                value={password}
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="none"
                                onChangeText={setPassword}
                            />
                        </View>

                        {loading ? (
                                <ActivityIndicator size="small" color={colors.blue[500]} style={{padding: 15}} />
                            ) : (
                                <CustomButton label="Acessar" onPress={handleLogin} />
                            )
                        }
                    </View>

                    <View style={{alignItems: "center", gap: 1}}>
                        <Text style={styles.titleFooter}>
                            ÓTICA PRIME
                        </Text>
                        <Text style={styles.titleFooter}>
                            {'\u00A9'} ATIP INF. 2025 v.1.2
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    loginContainer: {
        flex: 1, 
        justifyContent: "space-between", 
        flexDirection: "column", 
        paddingHorizontal: 20, 
        paddingVertical: 40, 
        gap: 20
    },
    title: {
        fontSize: 32,
        fontWeight: 600,
        marginBottom: 4
    },
    subtitle: {
        fontWeight: "300",
        color: colors.gray[500]
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        padding: 14,
        borderRadius: 8,
        fontSize: 15
    },
    image: {
        width: "100%",
        height: 240,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray[100]
    },
    titleFooter: {
        fontSize: 10,
        color: colors.gray[400],
        marginBottom: 3
    }
});
