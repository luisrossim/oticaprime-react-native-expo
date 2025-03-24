import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageTitle } from "@/components/PageTitle";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { CaixaService } from "@/services/caixa-service";
import { colors } from "@/utils/constants/colors";
import { useEffect, useState } from "react";
import { LineChart } from "@/components/LineChart";
import { UtilitiesService } from "@/utils/utilities-service";
import { LineDetail, LineDetailButton } from "@/components/LineDetail";
import { useDateFilter } from "@/context/DateFilterContext";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { CaixaDetails } from "@/models/caixa";
import SectionTitle from "@/components/SectionTitle";


export default function Caixa() {
  const [caixaDetails, setCaixaDetails] = useState<CaixaDetails | null>(null);
  const {selectedCaixa, selectedEmpresa} = useEmpresaCaixa();

  const { dateFilter } = useDateFilter();
  const { authData } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    setCaixaDetails(null);
    fetchCaixaInfo();
  }, [selectedEmpresa, selectedCaixa, dateFilter]);

  const fetchCaixaInfo = async () => {
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
    <View style={{flex: 1}}>
      {error ? (
        <ErrorMessage error={error} />
      ) 
      : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={{ paddingHorizontal: 15, marginBottom: 25 }}>
            <PageTitle title="Caixa" size="large" />
            <Text style={{color: colors.slate[500], fontWeight: 300}}>Análise de saldo, lançamentos, recebimentos de crediário e outras informações do caixa.</Text>

            {error && (
              <ErrorMessage error={error} />
            )}
          </View>

          {caixaDetails && (
            <View>
              <View style={styles.caixaSection}>
                <SectionTitle title="ANALÍTICO DO CAIXA" />

                <LineDetailButton
                  label="Saldo e Lançamentos"
                  onPress={() => {router.push("/caixa-historico")}}
                />
              </View>

              <View style={styles.caixaSection}>
                <SectionTitle title="TOTAL DE RECEBIMENTO DE CREDIÁRIO" />

                <View style={{ paddingHorizontal: 15 }}>
                  <Text style={styles.totalValue}>
                    {UtilitiesService.formatarValor(
                      caixaDetails.TOTAL_RECEBIDO
                    )}
                  </Text>
                </View>

                <LineDetail
                  label="Baixas"
                  value={caixaDetails.TOTAL_BAIXAS}
                  isBRL={false}
                />
                <LineDetail
                  label="Acréscimo recebido"
                  value={caixaDetails.TOTAL_ACRESCIMO_RECEBIDO}
                  isBRL={true}
                />
                <LineDetail
                  label="Desconto concedido"
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
                <SectionTitle title="ANALÍTICO DE VENDAS" />

                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={styles.totalValue}>
                    {UtilitiesService.formatarValor(
                      caixaDetails.VENDAS.TOTAL_VALOR_VENDAS || 0
                    )}
                  </Text>
                </View>

                <LineDetail
                  label="Vendas concluídas"
                  value={(caixaDetails.VENDAS.TOTAL_VENDAS - caixaDetails.VENDAS.TOTAL_CORTESIAS_OUTROS) || 0}
                  isBRL={false}
                />
                <LineDetail
                  label="Cortesias e outros"
                  value={caixaDetails.VENDAS.TOTAL_CORTESIAS_OUTROS || 0}
                  isBRL={false}
                />
                <LineDetail
                  label="Canceladas"
                  value={caixaDetails.VENDAS.TOTAL_VENDAS_CANCELADAS || 0}
                  isBRL={false}
                />
                <LineDetail
                  label="Desconto em itens"
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

                <View style={{ paddingHorizontal: 15 }}>
                  <Text style={styles.totalValue}>
                    {UtilitiesService.formatarValor(
                      caixaDetails.TOTAL_CONTAS_RECEBER || 0
                    )}
                  </Text>
                  <Text style={styles.tip}>
                    *de acordo com a data de vencimento
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
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
    marginBottom: 30,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 16,
    overflow: "hidden"
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
  tip: {
    color: colors.gray[500], 
    fontWeight: 300, 
    paddingBottom: 20
  }
});
