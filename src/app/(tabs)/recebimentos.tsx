import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { UtilitiesService } from '@/utils/utilities-service';
import { PageTitle } from '@/components/PageTitle';
import { DatePickerContainer } from '@/components/DatePicker';
import { RecebimentoSummary } from '@/models/recebimento';
import { RecebimentosService } from '@/services/recebimentos-service';

export default function Recebimentos() {
    const {selectedEmpresa, selectedCaixa} = useEmpresaCaixa();
    const [recebimentosResumo, setRecebimentosResumo] = useState<RecebimentoSummary[]>([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRecebimentos, setTotalRecebimentos] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hoje = new Date();
    const dataInicialPadrao = new Date();
    dataInicialPadrao.setDate(hoje.getDate() - 31);

    const [dataInicial, setDataInicial] = useState(dataInicialPadrao);
    const [dataFinal, setDataFinal] = useState(hoje);


    useEffect(() => {
        setPaginaAtual(1);
        setRecebimentosResumo([]);
        setIsCompleted(false);
        fetchRecebimentosCred(1);
    }, [selectedEmpresa, selectedCaixa, dataInicial, dataFinal])

    const fetchRecebimentosCred = async (pagina: number) => {
        if (loading || isFetchingMore) return;

        setLoading(true);
        setError(null);

        if (pagina === 1) {
            setLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const recebimentosService = new RecebimentosService();

            const params = {
                caixaId: selectedCaixa?.COD_CAI,
                empId: selectedEmpresa?.COD_EMP,
                ano: 2025,
                mes: 1,
                page: pagina
            };

            const data = await recebimentosService.getWithPageable(params);

            setTotalRecebimentos(data.pageable.totalResults);
            setTotalPages(data.pageable.totalPages);

            if (pagina === 1) {
                setRecebimentosResumo(data.registros);
            } else {
                setRecebimentosResumo((prev) => [...prev, ...data.registros]);
            }

            if (totalPages == pagina) {
                setIsCompleted(true);
            } else {
                setPaginaAtual(pagina);
            }

        } catch (err) {
            setError(`Erro ao buscar recebimentos de crediário.`);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const carregarMaisVendas = () => {
        if (!isFetchingMore && !isCompleted && paginaAtual < totalPages) {
            setIsFetchingMore(true); 
            fetchRecebimentosCred(paginaAtual + 1);
        }
    };

    const ItemRecebimento = React.memo(({ item, onPress }: { item: RecebimentoSummary, onPress: () => void }) => (
        <TouchableOpacity style={styles.vendaCard} onPress={onPress}>
            <View style={styles.cardContent}>
                <View style={styles.iconColumn}>
                    <Feather 
                        name="arrow-down-right"
                        size={20} 
                        style={styles.iconElement} 
                    />
                </View>
    
                <View style={styles.infoColumn}>
                    <Text style={styles.vendedor}>{item.NUMDOCUMENTO_CTR}</Text>
    
                    <Text style={styles.cliente}>
                        {item.COD_CTR}
                    </Text>
    
                    <Text style={styles.valor}>
                        {item.VLRPAGO_CTR ? (
                            UtilitiesService.formatarValor(item.VLRPAGO_CTR)
                        ) : (
                            UtilitiesService.formatarValor(item.VALOR_CTR)
                        )}
                    </Text>
    
                    <Text style={styles.formaPagamento}>
                        {item.COD_VENDA}
                    </Text>
                </View>
    
                <View style={styles.dateColumn}>
                    {item.DTPAGTO_CTR 
                    ? (
                        <Text style={styles.dataVenda}>{new Date(item.DTPAGTO_CTR).toLocaleDateString()}</Text>
                    ) : (
                        <Text style={styles.dataVenda}>{new Date(item.VENCTO_CTR).toLocaleDateString()}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    ));

    const renderItem = useCallback(({ item }: { item: RecebimentoSummary }) => (
        <ItemRecebimento key={item.COD_CTR} item={item} onPress={() => {}} />
    ), [router]);

    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
                <PageTitle title="Recebimentos de crediário" size="large" />

                {error && (
                    <ErrorMessage error={error} />
                )}

                <DatePickerContainer
                    dataInicial={dataInicial}
                    dataFinal={dataFinal}
                    onDateChange={(inicio, fim) => {
                        setDataInicial(inicio);
                        setDataFinal(fim);
                    }}
                />

                {totalRecebimentos > 0 && (
                    <View style={styles.totalResults}>
                        <Feather name="arrow-down-right" size={22} color={colors.gray[500]} />
                        <Text style={{color: colors.gray[500]}}>{totalRecebimentos} recebimentos</Text>
                    </View>
                )}
            </View>

            <FlatList
                data={recebimentosResumo}
                keyExtractor={(item, index) => String(item.COD_CTR) + "_" + index}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                ListFooterComponent={
                    isFetchingMore ? (
                        <View style={{ padding: 10 }}>
                            <LoadingIndicator />
                        </View>
                    ) : !isCompleted && recebimentosResumo.length > 0 ? (
                        <TouchableOpacity 
                            style={styles.pageButton}
                            onPress={carregarMaisVendas} 
                        >
                            <Feather size={25} color={colors.cyan[600]} name="plus" />
                        </TouchableOpacity>
                    ) : null
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                    </View>
                )}
                renderItem={renderItem}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#FFF"
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 12
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
    totalResults: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 20,
        gap: 10,
        marginBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: colors.gray[500],
    },
    vendaCard: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200]
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    iconColumn: {
        width: '18%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    infoColumn: {
        width: '57%',
        justifyContent: 'center',
        gap: 3
    },
    dateColumn: {
        width: '25%',
        justifyContent: 'flex-end',
        alignItems: "flex-end",
        alignSelf: 'flex-start'
    },
    iconElement: {
        backgroundColor: colors.cyan[500],
        borderRadius: 999,
        color: colors.cyan[50],
        padding: 10
    },
    vendedor: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.gray[800]
    },
    cliente: {
        fontSize: 15,
        color: colors.gray[500]
    },
    formaPagamento: {
        fontSize: 12,
        color: colors.gray[500],
        marginTop: 5
    },
    valor: {
        fontSize: 15,
        color: colors.gray[500]
    },
    dataVenda: {
        fontSize: 13,
        color: colors.gray[500],
        fontWeight: 300
    },
    pageButton:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: colors.cyan[100]
    }
});
