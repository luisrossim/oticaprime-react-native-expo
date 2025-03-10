import { UtilitiesService } from "@/utils/utilities-service";
import { startOfMonth, endOfMonth, format } from "date-fns";

export const dashboardFilterData = [
    {
        label: "Mês atual",
        range: 0,
        sublabel: `${format(startOfMonth(new Date()), "dd/MM/yyyy")} - ${format(endOfMonth(new Date()), "dd/MM/yyyy")}`
    },
    {
        label: "Mês passado",
        range: 1,
        sublabel: UtilitiesService.generateSublabel(1)
    },
    {
        label: "Últimos 2 meses",
        range: 2,
        sublabel: UtilitiesService.generateSublabel(2)
    },
    {
        label: "Últimos 3 meses",
        range: 3,
        sublabel: UtilitiesService.generateSublabel(3)
    },
    {
        label: "Últimos 6 meses",
        range: 6,
        sublabel: UtilitiesService.generateSublabel(6)
    },
    {
        label: "Últimos 12 meses",
        range: 12,
        sublabel: UtilitiesService.generateSublabel(12)
    }
];
