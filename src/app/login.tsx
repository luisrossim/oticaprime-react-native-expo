import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert, SafeAreaView } from "react-native";
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.loginContainer}>
                        <View style={{gap: 20}}>
                            <View style={{marginBottom: 40}}>
                                <Image source={require("@/assets/atip-logo.png")} style={styles.logo} />
                            </View>

                            <View>
                                <Text style={styles.title}>Bem vindo!</Text>
                                <Text style={styles.subtitle}>Informe suas credenciais de acesso.</Text>
                            </View>

                            <View style={{gap: 10}}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                    value={email}
                                    placeholderTextColor="#9ca3af"
                                    autoCorrect={false}
                                    spellCheck={false}
                                    autoCapitalize="none"
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Senha"
                                    placeholderTextColor="#9ca3af"
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
                                {'\u00A9'} ATIP INFORMÁTICA 2025 v.1.0.0
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        color: colors.slate[500]
    },
    input: {
        borderWidth: 1,
        borderColor: colors.slate[200],
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        fontSize: 15
    },
    titleFooter: {
        fontSize: 10,
        color: colors.slate[500],
        marginBottom: 3
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    }
});
