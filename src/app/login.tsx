import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { AuthRequest, AuthResponse } from "@/models/auth";
import { UserService } from "@/services/user-service";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { updateAuth } = useAuth();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);

        try {
            const credenciais: AuthRequest = {
                login: email,
                password: password
            }

            const userService = new UserService();
            const res: AuthResponse = await userService.login(credenciais);

            if (res) {
                updateAuth(res);
            }

        } catch (err) {
            setError(`Erro ao buscar vendas.`);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground 
                    source={{ uri: "https://images.unsplash.com/photo-1601031368146-49b73fcaebb1?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} 
                    style={styles.image}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <Feather name="layers" size={32} color={"rgba(255,255,255, 0.7)"} />
                    </View>
                </ImageBackground>

                <View style={{flex: 1, justifyContent: "space-between", flexDirection: "column", paddingHorizontal: 20, paddingVertical: 40}}>
                    <View>
                        <Text style={styles.title}>Acessar</Text>
                        <Text style={styles.subtitle}>Informe suas credenciais de acesso.</Text>

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

                        <CustomButton label="Acessar" onPress={handleLogin} />
                    </View>

                    <View style={{alignItems: "center"}}>
                        <Text style={styles.titleFooter}>
                            ÓTICA PRIME FINANCE
                        </Text>
                        <Text style={styles.titleFooter}>
                            {'\u00A9'} ATIP 2025 v.1.0
                        </Text>
                    </View>
                </View>

                {loading && (
                    <LoadingIndicator />
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 32,
        fontWeight: 600,
        marginBottom: 4
    },
    subtitle: {
        fontWeight: "300",
        color: colors.gray[500],
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        padding: 14,
        marginBottom: 10,
        borderRadius: 5,
        fontSize: 15
    },
    image: {
        width: "100%",
        height: 220,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray[100]
    },
    titleFooter: {
        fontSize: 10,
        fontWeight: 300,
        color: colors.gray[400],
        marginBottom: 3
    },
    overlay: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255, 0.7)",
        padding: 10,
        borderRadius: 5
    }
});
