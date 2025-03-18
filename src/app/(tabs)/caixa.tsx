import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageTitle } from "@/components/PageTitle";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { CaixaDetails } from "@/models/caixa";
import { CaixaService } from "@/services/caixa-service";
import { colors } from "@/utils/constants/colors";
import { useEffect, useRef, useState } from "react";
import { LineChart } from "@/components/LineChart";
import { UtilitiesService } from "@/utils/utilities-service";
import { LineDetail } from "@/components/LineDetail";
import SectionTitle from "@/components/SectionTitle";
import { Feather } from "@expo/vector-icons";
import { useDateFilter } from "@/context/DateFilterContext";
import { useAuth } from "@/context/AuthContext";
import { DateFilterInfo } from "@/components/DateFilterInfo";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";

export default function Caixa() {
  const [caixaDetails, setCaixaDetails] = useState<CaixaDetails | null>(null);
  const { selectedCaixa, selectedEmpresa } = useEmpresaCaixa();

  const { dateFilter } = useDateFilter();
  const { authData } = useAuth();

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    scrollY.setValue(0);
    setCaixaDetails(null);
    fetchCaixaDetails();
  }, [selectedEmpresa, selectedCaixa, dateFilter]);

  const fetchCaixaDetails = async () => {
    setLoading(true);
    setError(null);

    if (!selectedCaixa || !selectedEmpresa) {
      setLoading(false);
      setError("Nenhum caixa selecionado.");
      return;
    }

    try {
      const params = {
        caixaId: selectedCaixa.COD_CAI,
        empId: selectedEmpresa.COD_EMP,
        dataInicial: dateFilter?.dataInicial,
        dataFinal: dateFilter?.dataFinal,
      };

      const caixaService = new CaixaService(authData?.accessToken);
      const result = await caixaService.getCaixaDetails(params);

      if (result) {
        setCaixaDetails(result);
      }

    } catch (err: any) {
      setError(`Error: ${err.response.data.message || err}`);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{ flex: 1 }}>
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <Animated.View
            style={[
              styles.navBar,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [100, 200],
                      outputRange: [-100, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.navBarTitle}>Caixa</Text>
            <TouchableOpacity
              style={styles.scrollToTopButton}
              onPress={() =>
                scrollViewRef.current?.scrollTo({ y: 0, animated: true })
              }
            >
              <Feather
                name="chevron-up"
                size={18}
                color={colors.fuchsia[200]}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.ScrollView
            ref={scrollViewRef}
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 100 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          >
            <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
              <PageTitle title="Caixa" size="large" />

              {error ? (
                <ErrorMessage error={error} />
              ) : (
                <DateFilterInfo />
              )}
            </View>

            {caixaDetails && (
              <View>
                <View style={styles.caixaSection}>
                  <SectionTitle title="TOTAL RECEBIDO" />

                  <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.totalValue}>
                      {UtilitiesService.formatarValor(
                        caixaDetails.TOTAL_RECEBIDO
                      )}
                    </Text>
                  </View>

                  <LineDetail
                    label="BAIXAS"
                    value={caixaDetails.TOTAL_BAIXAS}
                    isBRL={false}
                  />
                  <LineDetail
                    label="ACRÉSCIMO RECEBIDO"
                    value={caixaDetails.TOTAL_ACRESCIMO_RECEBIDO}
                    isBRL={true}
                  />
                  <LineDetail
                    label="DESCONTO CONCEDIDO"
                    value={caixaDetails.TOTAL_DESCONTO_CONCEDIDO}
                    isBRL={true}
                  />
                  <LineChart
                    total={caixaDetails.TOTAL_RECEBIDO}
                    values={caixaDetails.FORMAS_PAGAMENTO}
                    type="recebimentos"
                  />
                </View>

                <View style={styles.caixaSection}>
                  <SectionTitle title="TOTAL ANALÍTICO DE VENDAS" />

                  <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.totalValue}>
                      {UtilitiesService.formatarValor(
                        caixaDetails.VENDAS.TOTAL_VALOR_VENDAS || 0
                      )}
                    </Text>
                  </View>

                  <LineDetail
                    label="VENDAS CONCLUÍDAS"
                    value={(caixaDetails.VENDAS.TOTAL_VENDAS - caixaDetails.VENDAS.TOTAL_CORTESIAS_OUTROS) || 0}
                    isBRL={false}
                  />
                  <LineDetail
                    label="CORTESIAS E OUTROS"
                    value={caixaDetails.VENDAS.TOTAL_CORTESIAS_OUTROS || 0}
                    isBRL={false}
                  />
                  <LineDetail
                    label="CANCELADAS"
                    value={caixaDetails.VENDAS.TOTAL_VENDAS_CANCELADAS || 0}
                    isBRL={false}
                  />
                  <LineDetail
                    label="DESCONTO EM ITENS"
                    value={caixaDetails.VENDAS.TOTAL_DESCONTO_VENDAS || 0}
                    isBRL={true}
                  />
                  <LineChart
                    total={caixaDetails.VENDAS.TOTAL_VALOR_VENDAS}
                    values={caixaDetails.VENDAS.FORMAS_PAGAMENTO_VENDAS}
                    type="vendas"
                  />
                </View>

                <View style={styles.caixaSection}>
                  <SectionTitle title="TOTAL DE CONTAS A RECEBER PENDENTES" />

                  <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.totalValue}>
                      {UtilitiesService.formatarValor(
                        caixaDetails.TOTAL_CONTAS_RECEBER || 0
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: "#FFF",
  },
  caixaDetailsHeader: {
    marginTop: 10,
    marginBottom: 3,
  },
  caixaSection: {
    marginTop: 10,
    marginBottom: 50,
  },
  lineContainer: {
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[300],
  },
  value: {
    color: colors.gray[500],
    fontWeight: 400,
  },
  label: {
    fontSize: 13,
    color: colors.gray[500],
  },
  totalValue: {
    fontSize: 32,
    color: colors.gray[900],
    marginTop: 15,
    marginBottom: 5
  },
  scrollToTopButton: {
    position: "absolute",
    right: 16,
    bottom: 8,
    padding: 5,
    borderRadius: 20,
  },
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: colors.purple[600],
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  navBarTitle: {
    color: colors.fuchsia[200],
    fontWeight: 600,
  },
});
