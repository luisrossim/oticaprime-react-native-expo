import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type EmpresaContextType = {
    selectedCompany: string;
    updateCompany: (company: string) => Promise<void>;
};

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export const EmpresaProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCompany, setSelectedCompany] = useState<string>("");

    useEffect(() => {
        const loadCompany = async () => {
            try {
                const savedCompany = await AsyncStorage.getItem("@selectedCompany");
                if (savedCompany) {
                    setSelectedCompany(savedCompany);
                }
            } catch (error) {
                console.error("Erro ao carregar a empresa:", error);
            }
        };

        loadCompany();
    }, []);

    const updateCompany = async (company: string) => {
        try {
            await AsyncStorage.setItem("@selectedCompany", company);
            setSelectedCompany(company);
        } catch (error) {
            console.error("Erro ao salvar a empresa:", error);
        }
    };

    return (
        <EmpresaContext.Provider value={{ selectedCompany, updateCompany }}>
            {children}
        </EmpresaContext.Provider>
    );
};

export const useEmpresa = (): EmpresaContextType => {
    const context = useContext(EmpresaContext);
    if (!context) {
        throw new Error("useEmpresa error!");
    }
    return context;
};
