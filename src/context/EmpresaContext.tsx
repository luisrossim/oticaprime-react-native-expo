import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Company } from "@/models/company";

type EmpresaContextType = {
    selectedCompany: Company | null;
    updateCompany: (company: Company) => Promise<void>;
};

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export const EmpresaProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    useEffect(() => {
        const loadCompany = async () => {
            try {
                const savedCompany = await AsyncStorage.getItem("@selectedCompany");

                if (!savedCompany) {
                    setSelectedCompany(null);
                    return;
                }

                setSelectedCompany(JSON.parse(savedCompany));
                
            } catch (error) {
                console.error("Erro ao carregar a empresa:", error);
            }
        };

        loadCompany();
    }, []);

    const updateCompany = async (company: Company) => {
        try {
            await AsyncStorage.setItem("@selectedCompany", JSON.stringify(company));
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
