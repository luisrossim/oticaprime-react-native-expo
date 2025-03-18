import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardFilterContextType {
    selectedRange: number;
    setSelectedRange: (range: number) => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export const DashboardFilterProvider = ({ children }: { children: ReactNode }) => {
    const [selectedRange, setSelectedRange] = useState<number>(24);

    return (
        <DashboardFilterContext.Provider value={{ selectedRange, setSelectedRange }}>
            {children}
        </DashboardFilterContext.Provider>
    );
};

export const useDashboardFilter = () => {
    const context = useContext(DashboardFilterContext);
    if (!context) {
        throw new Error('useDashboardFilter deve ser usado dentro de um DashboardFilterContext');
    }
    return context;
};