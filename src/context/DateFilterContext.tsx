import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateFilter } from "@/models/dates";

type DateFilterContextType = {
    dateFilter: DateFilter | null;
    updateDateFilter: (dateFilter: DateFilter) => Promise<void>;
};

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export const DateFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);

    useEffect(() => {
        const loadDateFilter = async () => {
            try {
                const storedDateFilter = await AsyncStorage.getItem("@dateFilter");
                if (storedDateFilter) {
                    setDateFilter(JSON.parse(storedDateFilter));
                }
            } catch (error) {
                console.error("Erro ao carregar filtro de datas:", error);
            }
        };
    
        loadDateFilter();
    }, []);

    const updateDateFilter = async (dateFilter: DateFilter) => {
        try {
            await AsyncStorage.setItem("@dateFilter", JSON.stringify(dateFilter));
            setDateFilter(dateFilter);
        } catch (error) {
            console.error("Erro ao filtro de data:", error);
        }
    };

    return (
        <DateFilterContext.Provider value={{ dateFilter, updateDateFilter }}>
            {children}
        </DateFilterContext.Provider>
    );
};

export const useDateFilter = (): DateFilterContextType => {
    const context = useContext(DateFilterContext);
    if (!context) {
        throw new Error("useDateFilter deve ser usado dentro de um DateFilterProvider");
    }
    return context;
};
