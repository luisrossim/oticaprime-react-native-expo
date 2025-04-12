import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Animated, Modal } from 'react-native';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';
import { ErrorMessage } from '@/components/ErrorMessage';
import { PageTitle } from '@/components/PageTitle';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { useDateFilter } from '@/context/DateFilterContext';
import { useAuth } from '@/context/AuthContext';
import { ProcessosLiberadosService } from '@/services/processos-service';
import { ProcessosLiberados } from '@/models/processosLiberados';
import { FilterInfoPage } from '@/components/FilterInfoPage';

export default function Processos() {
    const { selectedEmpresa, selectedCaixa } = useEmpresaCaixa();
    const { dateFilter } = useDateFilter();
    const [processos, setProcessos] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalProcessos, setTotalProcessos] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProcessosLiberados | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const {authData} = useAuth();


    useEffect(() => {
        scrollY.setValue(0); 
        setPaginaAtual(1);
        setProcessos([]);
        setIsCompleted(false);
        fetchProcessos(1);
    }, [selectedEmpresa, selectedCaixa, dateFilter]);

    const fetchProcessos = async (pagina: number) => {
        if (loading || isFetchingMore) return;

        if (!selectedEmpresa || !selectedCaixa) {
            setLoading(false);
            setError("Nenhuma empresa/caixa selecionado.");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const processosService = new ProcessosLiberadosService(authData?.accessToken);
            const params: any = {
                caixaId: selectedCaixa?.COD_CAI,
                empId: selectedEmpresa?.COD_EMP,
                dataInicial: dateFilter?.dataInicial,
                dataFinal: dateFilter?.dataFinal,
                page: pagina
            };

            const processos = await processosService.getWithPageable(params);
         
            setTotalProcessos(processos.pageable.totalResults);
            setTotalPages(processos.pageable.totalPages);
            setProcessos((prev): any => (pagina === 1 ? processos.processos : [...prev, ...processos.processos]));
            if (pagina >= processos.pageable.totalPages) setIsCompleted(true);
            setPaginaAtual(pagina);
            
        } catch (err: any) {
            setError(`Error: ${err.response.data.message || err}`);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const carregarProcessos = () => {
        if (!isFetchingMore && !isCompleted && paginaAtual < totalPages) {
            setIsFetchingMore(true);
            fetchProcessos(paginaAtual + 1);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectedItem(null);
        }, 200);
    };

    const ItemRecebimento = React.memo(({ item, onPress }: { item: ProcessosLiberados, onPress: (item: ProcessosLiberados) => void }) => (
        <TouchableOpacity style={styles.itemListCard} onPress={() => onPress(item)}>
            <View style={styles.itemListCardContent}>
                <View style={styles.iconColumn}>
                    <Feather 
                        name="check-circle"
                        size={20} 
                        style={styles.iconElement} 
                    />
                </View>
    
                <View style={styles.infoColumn}>
                    <Text style={styles.title}>
                        {item.NOME_USU}
                    </Text>
    
                    <Text style={styles.subTitle}>
                        {item.TIPO_MOVIMENTO}
                    </Text>
                </View>
    
                <View style={styles.dateColumn}>
                    <Text style={styles.dateText}>
                        {new Date(item.DATA_HORA).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    ));

    const renderItem = useCallback(({ item }: { item: ProcessosLiberados }) => (
        <ItemRecebimento 
            key={item.CODIGO}
            item={item} 
            onPress={(item: ProcessosLiberados) => { 
                setSelectedItem(item);
                setModalVisible(true);
            }} 
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
                                <Text style={styles.navBarTitle}>Processos liberados</Text>
                                <Feather name="chevron-up" color={colors.slate[700]} />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.FlatList
                            ListHeaderComponent={
                                <View style={styles.headerContainer}>
                                    <PageTitle 
                                        title="Processos liberados" 
                                        size="large" 
                                    />
                                    <FilterInfoPage
                                        totalInfo={`${totalProcessos || 0} processos`} 
                                        icon='check-circle'
                                    />
                                </View>
                            }
                            ref={flatListRef}
                            data={processos}
                            keyExtractor={(item, index) => String(item.CODIGO) + "_" + index}
                            initialNumToRender={20}
                            maxToRenderPerBatch={20}
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <ActivityIndicator size="large" color={colors.lime[500]} style={{padding: 40}} />
                                ) : (!isCompleted && processos.length > 0) ? (
                                    <TouchableOpacity 
                                        style={styles.loadMoreButton} 
                                        onPress={carregarProcessos}
                                    >
                                        <Feather size={25} color={colors.lime[600]} name="plus" />
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
                                    <ActivityIndicator size="large" color={colors.lime[500]} style={{padding: 40}} />
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                                    </View>
                                )
                            )}
                            renderItem={renderItem} 
                        />
                    </>
                )
            }

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
                                    <Feather name="x" size={18} style={styles.iconModal} />
                                </TouchableOpacity>
                            </View>

                             <View style={{marginBottom: 30, gap: 6}}>
                                <View style={{alignItems: "center", gap: 5, flexDirection: "row"}}>
                                    <Feather name="user" size={14} color={colors.slate[500]} />
                                    <Text style={styles.modalText}>{selectedItem.NOME_USU}</Text>
                                </View>
                                <View style={{alignItems: "center", gap: 5, flexDirection: "row"}}>
                                    <Feather name="calendar" size={14} color={colors.slate[500]} />
                                    <Text style={styles.modalText}>{new Date(selectedItem.DATA_HORA).toLocaleDateString()}</Text>
                                </View>
                                <View style={{alignItems: "center", gap: 5, flexDirection: "row"}}>
                                    <Feather name="check-circle" size={14} color={colors.slate[500]} />
                                    <Text style={styles.modalText}>{selectedItem.TIPO_MOVIMENTO}</Text>
                                </View>
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
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 45,
        backgroundColor: colors.lime[400],
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10
    },
    navBarTitle: {
        color: colors.slate[700],
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
        backgroundColor: colors.lime[300], 
        color: colors.slate[700]
    },
    title: {
        fontWeight: 600,
        fontSize: 15,
        color: colors.slate[900]
    },
    subTitle: {
        fontSize: 12,
        color: colors.slate[700],
        fontWeight: 300
    },
    dateText: {
        fontSize: 13,
        color: colors.slate[700],
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
        color: colors.slate[500]
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
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    iconModal: {
        color: colors.slate[500],
        backgroundColor: colors.slate[100],
        borderRadius: 60,
        padding: 5
    }
});
