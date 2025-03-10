import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Company } from "@/models/company";
import { Caixa } from "@/models/caixa";

type EmpresaCaixaContextType = {
    selectedEmpresa: Company | null;
    selectedCaixa: Caixa | null;
    updateEmpresa: (empresa: Company) => Promise<void>;
    updateCaixa: (caixa: Caixa) => Promise<void>;
};

const EmpresaCaixaContext = createContext<EmpresaCaixaContextType | undefined>(undefined);

export const EmpresaCaixaProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedEmpresa, setSelectedEmpresa] = useState<Company | null>(null);
    const [selectedCaixa, setSelectedCaixa] = useState<Caixa | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedEmpresa = await AsyncStorage.getItem("@empresa");
                const savedCaixa = await AsyncStorage.getItem("@caixa");
                
                if (savedEmpresa) setSelectedEmpresa(JSON.parse(savedEmpresa));
                if (savedCaixa) setSelectedCaixa(JSON.parse(savedCaixa));
            } catch (error) {
                console.error("Erro ao carregar empresa e caixa:", error);
            }
        };

        loadData();
    }, []);

    const updateEmpresa = async (empresa: Company) => {
        try {
            await AsyncStorage.setItem("@empresa", JSON.stringify(empresa));
            await AsyncStorage.removeItem("@caixa");
            setSelectedEmpresa(empresa);
            setSelectedCaixa(null);
        } catch (error) {
            console.error("Erro ao salvar a empresa:", error);
        }
    };

    const updateCaixa = async (caixa: Caixa) => {
        try {
            await AsyncStorage.setItem("@caixa", JSON.stringify(caixa));
            setSelectedCaixa(caixa);
        } catch (error) {
            console.error("Erro ao salvar o caixa:", error);
        }
    };

    return (
        <EmpresaCaixaContext.Provider value={{ selectedEmpresa, selectedCaixa, updateEmpresa, updateCaixa }}>
            {children}
        </EmpresaCaixaContext.Provider>
    );
};

export const useEmpresaCaixa = (): EmpresaCaixaContextType => {
    const context = useContext(EmpresaCaixaContext);
    if (!context) {
        throw new Error("useEmpresaCaixa deve ser usado dentro de um EmpresaCaixaProvider");
    }
    return context;
};
