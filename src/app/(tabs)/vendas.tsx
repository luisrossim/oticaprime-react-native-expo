import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Animated, Modal } from 'react-native';
import { VendaService } from '@/services/venda-service';
import { colors } from '@/utils/constants/colors';
import { VendaSummary } from '@/models/venda';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { UtilitiesService } from '@/utils/utilities-service';
import { PageTitle } from '@/components/PageTitle';
import { useDateFilter } from '@/context/DateFilterContext';
import { DateFilterInfo } from '@/components/DateFilterInfo';
import { FilterInfo } from '@/components/FilterInfo';
import { useAuth } from '@/context/AuthContext';
import { FormasPagamentoService } from '@/services/formas-pagamento-service';
import { FormaPagamento } from '@/models/formaPagamento';

export default function Vendas() {
    const [vendasPaginadas, setVendasPaginadas] = useState<VendaSummary[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalVendas, setTotalVendas] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
    const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<FormaPagamento | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {selectedEmpresa} = useEmpresaCaixa();
    const {dateFilter} = useDateFilter();
    const {authData} = useAuth();

    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchFormasPagamento();
    },[]);

    useEffect(() => {
        scrollY.setValue(0); 
        setPaginaAtual(1);
        setVendasPaginadas([]);
        setIsCompleted(false);
        fetchVendas(1);
    }, [selectedEmpresa, dateFilter, selectedFormaPagamento])

    const fetchVendas = async (pagina: number) => {
        if (loading || isFetchingMore) return;

        setLoading(true);
        setError(null);

        if (pagina === 1) {
            setLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const vendaService = new VendaService(authData?.token);
            const params: any = {
                dataInicial: dateFilter?.dataInicial,
                dataFinal: dateFilter?.dataFinal,
                empId: selectedEmpresa?.COD_EMP,
                page: pagina
            };

            if (selectedFormaPagamento) {
                params.fpId = selectedFormaPagamento.CODIGO;
            }

            const data = await vendaService.getWithPageable(params);

            setTotalVendas(data.pageable.totalResults);
            setTotalPages(data.pageable.totalPages);

            if (pagina === 1) {
                setVendasPaginadas(data.vendas);
            } else {
                setVendasPaginadas((prev) => [...prev, ...data.vendas]);
            }

            if (data.pageable.totalPages <= pagina) {
                setIsCompleted(true);
            } else {
                setPaginaAtual(pagina);
            }

        } catch (err) {
            setError(`Erro ao buscar vendas.`);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const fetchFormasPagamento = async () => {
        try {
            const formaPagamentoService = new FormasPagamentoService(authData?.token);
            const data = await formaPagamentoService.getAll();
            setFormasPagamento(data);

        } catch (err) {
            setError(`Erro ao buscar formas de pagamento.`);
        }
    };

    const handleFormaPagamentoSelect = (formaPagamento: FormaPagamento) => {
        setSelectedFormaPagamento(formaPagamento);
        setIsModalVisible(false);
    };

    const handleClearSelection = () => {
        setSelectedFormaPagamento(null);
        setIsModalVisible(false);
    };

    const renderFormaPagamentoItem = ({ item }: { item: FormaPagamento }) => (
        <TouchableOpacity
            style={styles.formaPagamentoItem}
            onPress={() => handleFormaPagamentoSelect(item)}
        >
            <Text style={styles.formaPagamentoText}>{item.DESCRICAO}</Text>
        </TouchableOpacity>
    );

    const carregarMaisVendas = () => {
        if (!isFetchingMore && !isCompleted && paginaAtual < totalPages) {
            setIsFetchingMore(true); 
            fetchVendas(paginaAtual + 1);
        }
    };

    const ItemVenda = React.memo(({ item, onPress }: { item: VendaSummary, onPress: () => void }) => (
        <TouchableOpacity style={styles.vendaCard} onPress={onPress}>
            <View style={styles.cardContent}>
                <View style={styles.iconColumn}>
                    <Feather 
                        name={
                            item.NOME_TPV.includes("A PRAZO") || ["CARTAO", "A VISTA"].includes(item.NOME_TPV)
                                ? "dollar-sign" 
                                : "star"
                        } 
                        size={20} 
                        style={styles.iconElement} 
                    />
                </View>
    
                <View style={styles.infoColumn}>
                    <Text style={styles.vendedor}>{item.NOME_VEND}</Text>
    
                    <Text style={styles.cliente}>
                        {item.NOME_CLI.length > 16 ? item.NOME_CLI.slice(0, 16) + "..." : item.NOME_CLI}
                    </Text>
    
                    <Text style={styles.valor}>
                        {UtilitiesService.formatarValor(item.TOTAL_VEN)}
                    </Text>
    
                    <Text style={styles.formaPagamento}>
                        {item.NOME_TPV.startsWith("A PRAZO") ? "A PRAZO" : item.NOME_TPV}
                    </Text>
                </View>
    
                <View style={styles.dateColumn}>
                    <Text style={styles.dataVenda}>{new Date(item.DATA_VEN).toLocaleDateString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    ));

    const renderItem = useCallback(({ item }: { item: VendaSummary }) => (
        <ItemVenda 
            key={item.COD_VEN} 
            item={item} 
            onPress={() => router.push(`/venda-details?id=${item.COD_VEN}`)} 
        />
    ), []);

    
    return (
        <View style={styles.container}>
            {error 
                ? (
                    <ErrorMessage error={error} />
                ) : (
                    <>
                        <Animated.View 
                            style={[styles.navBar, { 
                                transform: [{
                                    translateY: scrollY.interpolate({
                                        inputRange: [100, 200],
                                        outputRange: [-100, 0], 
                                        extrapolate: 'clamp'
                                    })
                                }]
                            }]}
                        > 
                            <Text style={styles.navBarTitle}>
                                Vendas
                            </Text>
                            <TouchableOpacity 
                                style={styles.scrollToTopButton} 
                                onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                            >
                                <Feather name="chevron-up" size={18} color={colors.cyan[200]} />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.FlatList
                            ListHeaderComponent={
                                <View style={styles.headerContainer}>
                                    <PageTitle 
                                        title="Vendas" 
                                        size="large" 
                                    />
                                    <DateFilterInfo />
                                    <FilterInfo 
                                        totalInfo={`${totalVendas || 0} vendas`} 
                                        icon='dollar-sign'
                                    />
                                    <TouchableOpacity
                                        style={styles.selectButton}
                                        onPress={() => setIsModalVisible(true)}
                                    >
                                        <Text style={styles.selectButtonText}>
                                            {selectedFormaPagamento ? selectedFormaPagamento.DESCRICAO : 'TODAS AS FORMAS DE PAGAMENTO'}
                                        </Text>
                                        <Feather name="chevron-down" size={18} color={colors.green[500]} />
                                    </TouchableOpacity>
                                </View>
                            }
                            ref={flatListRef}
                            data={vendasPaginadas}
                            keyExtractor={(item, index) => String(item.COD_VEN) + "_" + index}
                            initialNumToRender={20}
                            maxToRenderPerBatch={20}
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <ActivityIndicator size="large" color={colors.green[500]} style={{padding: 40}} />
                                ) : !isCompleted && vendasPaginadas.length > 0 ? (
                                    <TouchableOpacity 
                                        style={styles.loadMoreButton}
                                        onPress={carregarMaisVendas} 
                                    >
                                        <Feather size={25} color={colors.green[600]} name="plus" />
                                    </TouchableOpacity>
                                ) : null
                            }
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                                </View>
                            )}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            scrollEventThrottle={16}
                            renderItem={renderItem}
                        />

                        <Modal
                            visible={isModalVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setIsModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Selecione a forma de pagamento</Text>
                                    <FlatList
                                        data={formasPagamento}
                                        keyExtractor={(item) => String(item.CODIGO)}
                                        renderItem={renderFormaPagamentoItem}
                                    />
                                    <TouchableOpacity
                                        style={styles.clearSelectionButton}
                                        onPress={handleClearSelection}
                                    >
                                        <Text style={styles.clearSelectionText}>Limpar Seleção</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Fechar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                )
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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
        backgroundColor: colors.green[500],
        borderRadius: 60,
        color: colors.green[200],
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
    loadMoreButton:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: colors.gray[100]
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 45,
        backgroundColor: colors.green[600],
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10
    },
    navBarTitle: {
        color: colors.green[200],
        fontWeight: 600
    },
    scrollToTopButton: {
        position: 'absolute',
        right: 16,
        bottom: 8,
        padding: 5,
        borderRadius: 20,
    },
    headerContainer: {
        padding: 20,
        paddingTop: 50
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: colors.green[100],
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    selectButtonText: {
        marginRight: 10,
        color: colors.green[700],
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 500,
        marginBottom: 10
    },
    formaPagamentoItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    formaPagamentoText: {
        color: colors.gray[500],
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: colors.red[500],
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    clearSelectionButton: {
        marginTop: 30,
        backgroundColor: colors.gray[500],
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    clearSelectionText: {
        color: 'white',
        fontSize: 16,
    },
});
