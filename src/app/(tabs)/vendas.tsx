import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { VendaService } from '@/services/venda-service';
import { colors } from '@/constants/colors';
import { Venda } from '@/models/venda';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const vendasMock = [
    {
      "COD_VEN": 1,
      "NOME_CLI": "João Silva",
      "NOME_VEND": "Carlos Pereira",
      "NOME_MEDICO": "Dr. Ricardo Mendes",
      "NOME_TPV": "Cartão de Crédito",
      "TOTAL_VEN": 250.75,
      "DATA_VEN": "2024-02-17"
    },
    {
      "COD_VEN": 2,
      "NOME_CLI": "Maria Oliveira",
      "NOME_VEND": "Fernanda Souza",
      "NOME_MEDICO": "Dra. Ana Lima",
      "NOME_TPV": "Dinheiro",
      "TOTAL_VEN": 120.50,
      "DATA_VEN": "2024-02-16"
    },
    {
      "COD_VEN": 3,
      "NOME_CLI": "Carlos Santos",
      "NOME_VEND": "Pedro Almeida",
      "NOME_MEDICO": "Dr. Eduardo Rocha",
      "NOME_TPV": "Boleto",
      "TOTAL_VEN": 320.00,
      "DATA_VEN": "2024-02-15"
    },
    {
      "COD_VEN": 4,
      "NOME_CLI": "Fernanda Lima",
      "NOME_VEND": "Mariana Duarte",
      "NOME_MEDICO": "Dra. Patrícia Gomes",
      "NOME_TPV": "Pix",
      "TOTAL_VEN": 180.90,
      "DATA_VEN": "2024-02-14"
    },
    {
      "COD_VEN": 5,
      "NOME_CLI": "Roberto Almeida",
      "NOME_VEND": "Juliana Matos",
      "NOME_MEDICO": "Dr. Luiz Fernandes",
      "NOME_TPV": "Cartão de Débito",
      "TOTAL_VEN": 290.30,
      "DATA_VEN": "2024-02-13"
    },
    {
      "COD_VEN": 6,
      "NOME_CLI": "Paula Souza",
      "NOME_VEND": "Thiago Ramos",
      "NOME_MEDICO": "Dra. Vanessa Castro",
      "NOME_TPV": "Cartão de Crédito",
      "TOTAL_VEN": 410.60,
      "DATA_VEN": "2024-02-12"
    },
    {
      "COD_VEN": 7,
      "NOME_CLI": "Eduardo Ferreira",
      "NOME_VEND": "Beatriz Oliveira",
      "NOME_MEDICO": "Dr. Marcelo Vieira",
      "NOME_TPV": "Transferência",
      "TOTAL_VEN": 150.00,
      "DATA_VEN": "2024-02-11"
    },
    {
      "COD_VEN": 8,
      "NOME_CLI": "Aline Martins",
      "NOME_VEND": "Ricardo Nunes",
      "NOME_MEDICO": "Dra. Camila Costa",
      "NOME_TPV": "Pix",
      "TOTAL_VEN": 275.45,
      "DATA_VEN": "2024-02-10"
    }
  ]
  

export default function Vendas() {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const hoje = new Date();
    const dataInicialPadrao = new Date();
    dataInicialPadrao.setDate(hoje.getDate() - 31);

    const [dataInicial, setDataInicial] = useState(dataInicialPadrao);
    const [dataFinal, setDataFinal] = useState(hoje);

    useEffect(() => {
        setVendas(vendasMock);
        fetchVendas();
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        hideDatePicker();
    };

    const formatarData = (data: Date): string => {
        return data.toLocaleDateString();
    };

    const fetchVendas = async () => {
        try {
            const service = new VendaService();
            const params = {
                dataInicial: formatarData(dataInicial),
                dataFinal: formatarData(dataFinal),
            };

            const data = await service.getWithParams(params);
            setVendas(data);
        } catch (err) {
            setError('Erro ao carregar vendas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatarFormaPagamento = (forma: string) => {
        const formas = {
            CARTAO_CREDITO: 'Cartão de Crédito',
            CARTAO_DEBITO: 'Cartão de Débito',
            DINHEIRO: 'Dinheiro',
            PIX: 'PIX',
            BOLETO: 'Boleto',
        };
        return formas[forma as keyof typeof formas] || forma;
    };

    const groupVendasByDate = (vendas: Venda[]) => {
        vendas.sort((a, b) => new Date(a.DATA_VEN).getTime() - new Date(b.DATA_VEN).getTime());

        const groupedVendas: { title: string, data: Venda[] }[] = [];

        vendas.forEach((venda) => {
            const vendaDate = new Date(venda.DATA_VEN);
            const dateString = vendaDate.toLocaleDateString();
            
            const existingSection = groupedVendas.find((section) => section.title === dateString);
            if (existingSection) {
                existingSection.data.push(venda);
            } else {
                groupedVendas.push({ title: dateString, data: [venda] });
            }
        });

        return groupedVendas;
    };

    // if (loading) {
    //     return (
    //         <View style={styles.loading}>
    //             <ActivityIndicator size="large" color={colors.sky[500]} />
    //         </View>
    //     );
    // }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    const groupedVendas = groupVendasByDate(vendas);

    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.title}>Vendas</Text>
            </View>

            <View style={styles.datePickerContainer}>
                <Button title="Show Date Picker" onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    display='spinner'
                    locale="pt-BR"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <TouchableOpacity style={styles.filterButton} onPress={fetchVendas}>
                    <Feather name="search" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>

            <SectionList
                sections={groupedVendas}
                keyExtractor={(item) => String(item.COD_VEN)}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Feather name="frown" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhuma venda encontrada.</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push("/venda-details")} 
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.vendedor}>{item.NOME_VEND}</Text>
                        </View>

                        <Text style={styles.formaPagamento}>
                            <Feather name="credit-card" size={14} color={colors.gray[500]} /> {formatarFormaPagamento(item.NOME_TPV)}
                        </Text>

                        <View style={styles.cardFooter}>
                            <Text style={styles.data}>
                                <Feather name="calendar" size={14} color={colors.gray[500]} /> {new Date(item.DATA_VEN).toLocaleDateString()}
                            </Text>
                            <Text style={styles.valor}>R$ {item.TOTAL_VEN.toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: colors.gray[100],
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        gap: 2,
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#FFF",
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: colors.gray[100]
    },
    vendedor: {
        fontSize: 17,
        fontWeight: '600'
    },
    valor: {
        fontSize: 16,
        fontWeight: 600,
        color: colors.emerald[600],
    },
    formaPagamento: {
        fontSize: 14,
        color: colors.gray[500],
    },
    data: {
        fontSize: 14,
        color: colors.gray[500],
    },
    filterButton: {
        backgroundColor: colors.blue[500],
        padding: 8,
        width: 60,
        marginLeft: 17,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: colors.gray[700],
        fontStyle: 'italic',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sectionHeader: {
        backgroundColor: colors.gray[100],
        paddingVertical: 20,
        paddingHorizontal: 22,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 300
    }
});
