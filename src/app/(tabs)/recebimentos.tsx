import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Animated, Modal } from 'react-native';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';
import { ErrorMessage } from '@/components/ErrorMessage';
import { PageTitle } from '@/components/PageTitle';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { UtilitiesService } from '@/utils/utilities-service';
import { useDateFilter } from '@/context/DateFilterContext';
import { RecebimentosService } from '@/services/recebimentos-service';
import { RecebimentoSummary } from '@/models/recebimento';
import { useAuth } from '@/context/AuthContext';
import { FormaPagamento } from '@/models/formaPagamento';
import { FormasPagamentoService } from '@/services/formas-pagamento-service';
import { router } from 'expo-router';
import { FilterInfoPage } from '@/components/FilterInfoPage';

export default function Recebimentos() {
    const { selectedEmpresa, selectedCaixa } = useEmpresaCaixa();
    const { dateFilter } = useDateFilter();
    const [recebimentosResumo, setRecebimentosResumo] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRecebimentos, setTotalRecebimentos] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
    const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<FormaPagamento | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const {authData} = useAuth();

    useEffect(() => {
        fetchFormasPagamento();
    },[]);

    useEffect(() => {
        scrollY.setValue(0); 
        setPaginaAtual(1);
        setRecebimentosResumo([]);
        setIsCompleted(false);
        fetchRecebimentos(1);
    }, [selectedEmpresa, selectedCaixa, dateFilter, selectedFormaPagamento]);

    const fetchRecebimentos = async (pagina: number) => {
        if (loading || isFetchingMore) return;

        if (!selectedEmpresa || !selectedCaixa) {
            setLoading(false);
            setError("Nenhuma empresa/caixa selecionado.");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const recebimentosService = new RecebimentosService(authData?.accessToken);
            const params: any = {
                caixaId: selectedCaixa?.COD_CAI,
                empId: selectedEmpresa?.COD_EMP,
                dataInicial: dateFilter?.dataInicial,
                dataFinal: dateFilter?.dataFinal,
                page: pagina
            };

            if (selectedFormaPagamento) {
                params.fpId = selectedFormaPagamento.CODIGO;
            }

            const data = await recebimentosService.getWithPageable(params);
         
            setTotalRecebimentos(data.pageable.totalResults);
            setTotalPages(data.pageable.totalPages);
            setRecebimentosResumo((prev): any => (pagina === 1 ? data.registros : [...prev, ...data.registros]));
            if (pagina >= data.pageable.totalPages) setIsCompleted(true);
            setPaginaAtual(pagina);
            
        } catch (err: any) {
            setError(`Error: ${err.response.data.message || err}`);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const fetchFormasPagamento = async () => {
        try {
            const formaPagamentoService = new FormasPagamentoService(authData?.accessToken);
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
            {(selectedFormaPagamento?.CODIGO == item.CODIGO || !selectedFormaPagamento) && (
                <Feather name="check-circle" color={colors.blue[500]} />
            )}
            <Text style={styles.formaPagamentoText}>{item.DESCRICAO}</Text>
        </TouchableOpacity>
    );

    const carregarMaisVendas = () => {
        if (!isFetchingMore && !isCompleted && paginaAtual < totalPages) {
            setIsFetchingMore(true);
            fetchRecebimentos(paginaAtual + 1);
        }
    };

    const ItemRecebimento = React.memo(({ item, onPress }: { item: RecebimentoSummary, onPress: () => void }) => (
        <TouchableOpacity style={styles.itemListCard} onPress={onPress}>
            <View style={styles.itemListCardContent}>
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
                        {item.NOME_CLI.length > 16 ? item.NOME_CLI.slice(0, 16) + "..." : item.NOME_CLI}
                    </Text>
    
                    <Text style={styles.valor}>
                        {UtilitiesService.formatarValor(item.VLRPAGO_CTR)}
                    </Text>
    
                    <Text style={styles.baixa}>
                        {item.COD_BAIXA}
                    </Text>
                </View>
    
                <View style={styles.dateColumn}>
                    <Text style={styles.dataVenda}>{new Date(item.DTPAGTO_CTR).toLocaleDateString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    ));

    const renderItem = useCallback(({ item }: { item: RecebimentoSummary }) => (
        <ItemRecebimento 
            key={item.COD_CTR}
            item={item} 
            onPress={() => {router.push(`/recebimento-details?id=${item.COD_CTR}&sequencia=${item.SEQUENCIA_CTR}`)}}
        />
    ), []);

    return (
        <View style={{ flex: 1 }}>
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
                            <TouchableOpacity
                                style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}
                                onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                            >
                                <Text style={styles.navBarTitle}>Recebimentos de crediário</Text>
                                <Feather name="chevron-up" color={colors.cyan[200]} />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.FlatList
                            ListHeaderComponent={
                                <View style={styles.headerContainer}>
                                    <PageTitle 
                                        title="Recebimentos de crediário" 
                                        size="large" 
                                    />

                                    <FilterInfoPage
                                        totalInfo={`${totalRecebimentos || 0} recebimentos`} 
                                        icon='arrow-down-right'
                                    />

                                    <TouchableOpacity
                                        style={styles.selectButton}
                                        onPress={() => setIsModalVisible(true)}
                                    >
                                        <Text style={styles.selectButtonText}>
                                            {selectedFormaPagamento ? selectedFormaPagamento.DESCRICAO : 'TODAS AS FORMAS DE PAGAMENTO'}
                                        </Text>
                                        <Feather name="chevron-down" size={18} color={colors.slate[400]} />
                                    </TouchableOpacity>
                                </View>
                            }
                            ref={flatListRef}
                            data={recebimentosResumo}
                            keyExtractor={(item, index) => String(item.COD_CTR) + "_" + index}
                            initialNumToRender={20}
                            maxToRenderPerBatch={20}
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <ActivityIndicator size="large" color={colors.indigo[500]} style={{padding: 40}} />
                                ) : (!isCompleted && recebimentosResumo.length > 0) ? (
                                    <TouchableOpacity 
                                        style={styles.loadMoreButton} 
                                        onPress={carregarMaisVendas}
                                    >
                                        <Feather size={25} color={colors.indigo[600]} name="plus" />
                                    </TouchableOpacity>
                                ) : null
                            }
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            scrollEventThrottle={16}
                            ListEmptyComponent={() => (
                                (loading) ? (
                                    <ActivityIndicator size="large" color={colors.indigo[500]} style={{padding: 40}} />
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                                    </View>
                                )
                            )}
                            renderItem={renderItem} 
                        />

                        <Modal
                            visible={isModalVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setIsModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContainer}>
                                    <Text style={styles.modalTitle}>Forma de pagamento</Text>

                                    <FlatList
                                        data={formasPagamento}
                                        keyExtractor={(item) => String(item.CODIGO)}
                                        renderItem={renderFormaPagamentoItem}
                                    />

                                    <View style={styles.buttons}>
                                        <TouchableOpacity onPress={handleClearSelection} style={styles.footerClearButton}>
                                            <Feather name="check-circle" size={16} color={colors.cyan[100]} />
                                            <Text style={styles.modalButtonText}>Selecionar todas</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                            <Text style={styles.footerCancelButton}>
                                                Cancelar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
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
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 45,
        backgroundColor: colors.indigo[600],
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10
    },
    navBarTitle: {
        color: colors.cyan[200],
        fontWeight: 600
    },
    headerContainer: {
        padding: 15,
        paddingTop: 50
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
    },
    dateText: {
        color: colors.slate[500]
    },
    toggleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10
    },
    label: {
        color: colors.slate[500]
    },
    itemContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200]
    },
    loadMoreButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: colors.slate[100]
    },
    scrollToTopButton: {
        position: 'absolute',
        right: 16,
        bottom: 8,
        padding: 5,
        borderRadius: 20,
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
        color: colors.slate[500],
    },
    itemListCard: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200]
    },
    itemListCardContent: {
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
        borderRadius: 60,
        padding: 10,
        backgroundColor: colors.indigo[600], 
        color: colors.cyan[200]
    },
    vendedor: {
        fontWeight: 600,
        fontSize: 15,
        color: colors.slate[800]
    },
    cliente: {
        color: colors.slate[700], 
        fontWeight: 300
    },
    baixa: {
        fontSize: 12,
        color: colors.slate[700], 
        fontWeight: 300,
        marginTop: 5
    },
    valor: {
        fontSize: 14,
        color: colors.slate[700], 
        fontWeight: 300
    },
    dataVenda: {
        fontSize: 13,
        color: colors.slate[700], 
        fontWeight: 300
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.slate[200],
        backgroundColor: colors.slate[50],
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 10,
        borderRadius: 60,
    },
    selectButtonText: {
        fontSize: 12,
        fontWeight: 500,
        color: colors.slate[500],
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '92%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 600,
        color: colors.slate[800],
        marginBottom: 12,
    },
    formaPagamentoItem: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        padding: 10
    },
    formaPagamentoText: {
        color: colors.slate[500],
    },
    buttons: {
        marginTop: 25,
        gap: 10
    },
    footerCancelButton: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: colors.slate[500],
        backgroundColor: colors.slate[100],
        borderRadius: 60
    },
    footerClearButton: {
        fontSize: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: colors.cyan[100],
        backgroundColor: colors.blue[700],
        borderRadius: 60
    },
    modalButtonText: {
        fontSize: 16,
        color: colors.cyan[100],
        textAlign: "center",
    }
});
