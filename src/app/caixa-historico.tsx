import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { useDateFilter } from '@/context/DateFilterContext';
import { useAuth } from '@/context/AuthContext';
import { CustomHeader } from '@/components/CustomHeader';
import { CaixaService } from '@/services/caixa-service';
import { CaixaAnalitico, CaixaLancamentosHistorico } from '@/models/caixa';
import { LineDetail } from '@/components/LineDetail';
import SectionTitle from '@/components/SectionTitle';
import { PageTitle } from '@/components/PageTitle';
import { UtilitiesService } from '@/utils/utilities-service';
import { FilterInfoPage } from '@/components/FilterInfoPage';
import { LoadingIndicator } from '@/components/LoadingIndicator';

type IconName = "arrow-up" | "arrow-down" | "circle";

export default function CaixaHistorico() {
    const [analitico, setAnalitico] = useState<CaixaAnalitico | null>(null);
    const [historico, setHistorico] = useState<CaixaLancamentosHistorico[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalLancamentos, setTotalLancamentos] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CaixaLancamentosHistorico | null>(null);

    const {selectedEmpresa, selectedCaixa} = useEmpresaCaixa();
    const {dateFilter} = useDateFilter();
    const {authData} = useAuth();

    const flatListRef = useRef<FlatList>(null);


    useEffect(() => {
        setPaginaAtual(1);
        setHistorico([]);
        setAnalitico(null);
        setIsCompleted(false);
        fetchCaixaHistorico(1);
    }, [])

    const fetchCaixaHistorico = async (pagina: number) => {
        if (loading || isFetchingMore) return;

        if (!selectedEmpresa || !selectedCaixa || !dateFilter) {
            setLoading(false);
            setError("Parâmetros inválidos.");
            return;
        }
        
        setError(null);

        if (pagina === 1) {
            setLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const caixaService = new CaixaService(authData?.accessToken);
            const params: any = {
                dataInicial: dateFilter.dataInicial,
                dataFinal: dateFilter.dataFinal,
                empId: selectedEmpresa.COD_EMP,
                caixaId: selectedCaixa.COD_CAI,
                page: pagina
            };

            const data = await caixaService.getCaixaAnalitico(params);

            setTotalLancamentos(data.pageable.totalResults);
            setTotalPages(data.pageable.totalPages);

            if (pagina === 1) {
                setHistorico(data.analitico.historico);
                setAnalitico(data.analitico);
            } else {
                setHistorico((prev) => [...prev, ...data.analitico.historico]);
            }

            if (data.pageable.totalPages <= pagina) {
                setIsCompleted(true);
            } else {
                setPaginaAtual(pagina);
            }

        } catch (err: any) {
            setError(`Error: ${err.response.data.message || err}`);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };


    const carregarMaisHistorico = () => {
        if (!isFetchingMore && !isCompleted && paginaAtual < totalPages) {
            setIsFetchingMore(true); 
            fetchCaixaHistorico(paginaAtual + 1);
        }
    };

    const handleDateText = (): string => {
        if (!dateFilter) {
            return "-";
        }

        if (dateFilter?.dataInicial == dateFilter?.dataFinal) {
            return String(dateFilter?.dataInicial);
        }

        return `${String(dateFilter?.dataInicial)} até ${String(dateFilter?.dataFinal)}`
    }

    const getIconConfig = (record: CaixaLancamentosHistorico): { name: IconName, backgroundColor: string } => {
        if (record.FLAG_SOMAR.includes('S')) {
            if (record.DEB_CRED.includes('D')) {
                return { name: "arrow-up", backgroundColor: colors.red[600] };
            } else {
                return { name: "arrow-down", backgroundColor: colors.emerald[600] };
            }
        } 
        return { name: "circle", backgroundColor: colors.slate[400] };
    };

    const ItemHistorico = React.memo(({ item, onPress }: { item: CaixaLancamentosHistorico, onPress: (item: CaixaLancamentosHistorico) => void }) => {
        const { name, backgroundColor } = getIconConfig(item);
    
        return (
            <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
                <View style={styles.cardContent}>
                    <View style={styles.iconColumn}>
                        <Feather 
                            name={name}
                            size={20} 
                            style={[styles.iconElement, { backgroundColor }]} 
                        />
                    </View>
        
                    <View style={styles.infoColumn}>
                        <Text style={styles.vendedor}>{item.NOME_USU}</Text>
        
                        <Text style={styles.valor}>
                            {UtilitiesService.formatarValor(item.VALOR)}
                        </Text>
        
                        <Text style={styles.formaPagamento}>
                            {item.TIPO_MOVIMENTO}
                        </Text>
                    </View>
        
                    <View style={styles.dateColumn}>
                        <Text style={styles.dataVenda}>
                            {new Date(item.DATA).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    const renderItem = useCallback(({ item }: { item: CaixaLancamentosHistorico }) => (
        <ItemHistorico 
            key={item.CODIGO} 
            item={item} 
            onPress={(item: CaixaLancamentosHistorico) => { 
                setSelectedItem(item);
                setModalVisible(true);
            }} 
        />
    ), []);

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectedItem(null);
        }, 200);
    };

    
    if (error) {
        return <ErrorMessage error={error} />
    }
    
    
    return (
        <View style={styles.container}>
            <CustomHeader title="Saldo e Lançamentos" />

            {loading ? (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <ActivityIndicator size="large" color={colors.sky[500]} style={{padding: 40}} />
                </View>
            ) : (
                <FlatList
                    ListHeaderComponent={
                        <View>
                            <View style={styles.cardSection}>
                                <View style={{backgroundColor: colors.blue[600], padding: 40, gap: 10}}>
                                    <Text style={{color: colors.cyan[300], textAlign: "center"}}>
                                        {selectedCaixa?.DESC_CAI}
                                    </Text>  

                                    <Text style={{textAlign: "center", fontSize: 32, fontWeight: 500, color: colors.cyan[200]}}>
                                        {UtilitiesService.formatarValor(analitico?.saldoFinal || 0)}
                                    </Text>

                                    <View style={{alignItems: "center"}}>
                                        <Text style={{color: colors.cyan[300]}}>
                                            {String(dateFilter?.dataFinal)}
                                        </Text>
                                    </View> 
                                </View>

                                <View>
                                    <SectionTitle 
                                        title="ATUAL"
                                        subtitle={handleDateText()}
                                    />
                                    <LineDetail
                                        label="SAÍDA"
                                        value={analitico?.saldoAtual.debito || 0}
                                        isBRL={true}
                                        color={colors.red[600]}
                                    />
                                    <LineDetail
                                        label="ENTRADA"
                                        value={analitico?.saldoAtual.credito || 0}
                                        isBRL={true}
                                        color={colors.emerald[600]}
                                    />
                                    <LineDetail
                                        label="Saldo"
                                        value={analitico?.saldoAtual.saldo || 0}
                                        isBRL={true}
                                        color={colors.blue[600]}
                                    />
                                </View>

                                <View>
                                    <SectionTitle 
                                        title="ANTERIOR" 
                                        subtitle={`até ${dateFilter?.dataInicial}`}
                                    />
                                    <LineDetail
                                        label="SAÍDA"
                                        value={analitico?.saldoAnterior.debito || 0}
                                        isBRL={true}
                                        color={colors.red[600]}
                                    />
                                    <LineDetail
                                        label="ENTRADA"
                                        value={analitico?.saldoAnterior.credito || 0}
                                        isBRL={true}
                                        color={colors.emerald[600]}
                                    />
                                        <LineDetail
                                        label="SALDO"
                                        value={analitico?.saldoAnterior.saldo || 0}
                                        isBRL={true}
                                        color={colors.blue[600]}
                                    />
                                </View>
                            </View>

                            <View style={{paddingHorizontal: 20, paddingTop: 50, marginBottom: 10}}>
                                <PageTitle 
                                    title="Lançamentos" 
                                    size="large" 
                                />
                                <FilterInfoPage 
                                    totalInfo={`${totalLancamentos || 0} lançamentos`} 
                                    icon='repeat'
                                />       
                            </View>
                        </View>
                    }
                    ref={flatListRef}
                    data={historico}
                    keyExtractor={(item, index) => String(item.CODIGO) + "_" + index}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        isFetchingMore ? (
                            <ActivityIndicator size="large" color={colors.slate[500]} style={{padding: 40}} />
                        ) : !isCompleted && historico.length > 0 ? (
                            <TouchableOpacity 
                                style={styles.loadMoreButton}
                                onPress={carregarMaisHistorico} 
                            >
                                <Feather size={25} color={colors.slate[700]} name="plus" />
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
            )}

            {selectedItem && (
                <Modal
                    visible={modalVisible}
                    onRequestClose={closeModal}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes</Text>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Feather name="x" size={20} style={styles.iconModal} />
                                </TouchableOpacity>
                            </View>

                            <View style={{marginBottom: 20, gap: 5}}>
                                <View style={{alignItems: "center", gap: 5, flexDirection: "row"}}>
                                    <Feather name="user" size={14} color={colors.slate[500]} />
                                    <Text style={styles.modalText}>{selectedItem.NOME_USU}</Text>
                                </View>
                                <View style={{alignItems: "center", gap: 5, flexDirection: "row"}}>
                                    <Feather name="calendar" size={14} color={colors.slate[500]} />
                                    <Text style={styles.modalText}>{new Date(selectedItem.DATA).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.modalText}>{UtilitiesService.formatarValor(selectedItem.VALOR)}</Text>
                            </View>

                            <Text style={styles.modalText}>{selectedItem.HISTORICO}</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: colors.gray[500],
    },
    card: {
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
    iconElement: {
        borderRadius: 60,
        color: colors.slate[50],
        padding: 10
    },
    loadMoreButton:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: colors.gray[100]
    },
    gridContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "100%",
    },
    gridItem: {
        flex: 1,
        fontSize: 12,
        textAlign: "center",
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '92%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 500
    },
    modalText: {
        color: colors.gray[500]
    },
    closeButton: {
        borderRadius: 4,
        alignSelf: "center",
        padding: 7
    },
    modalHeader: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20
    },
    iconModal: {
        color: colors.slate[500],
        backgroundColor: colors.slate[100],
        borderRadius: 60,
        padding: 5
    },
    cardSection: {
        marginTop: 20,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 16,
        overflow: "hidden"
    }
});
