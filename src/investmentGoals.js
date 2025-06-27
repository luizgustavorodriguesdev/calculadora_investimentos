// Função para converter uma taxa de retorno anual em taxa de retorno mensal
function convertToMontlyReturnRate(yearlyReturnRate) {
  // Utiliza a fórmula de radiciação para converter taxa anual em mensal
  return yearlyReturnRate ** (1 / 12);
}

// Função principal para gerar o array de retornos de investimento ao longo do tempo
export function generateReturnsArray(
  startingAmount = 0, // Valor inicial investido
  timeHorizon = 0, // Prazo do investimento (em meses ou anos)
  timePeriod = "monthly", // Periodicidade do prazo ("monthly" ou "yearly")
  monthlyContribution = 0, // Valor do aporte mensal
  returnRate = 0, // Taxa de retorno (mensal ou anual)
  returnTimeFrame = "monthly" // Periodicidade da taxa de retorno ("monthly" ou "yearly")
) {
  // Validação: exige valores positivos para investimento inicial e prazo
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      "Investimento inicial e prazo devem ser preenchidos com valores positivos."
    );
  }

  // Calcula a taxa de retorno final de acordo com a periodicidade informada
  const finalReturnRate =
    returnTimeFrame === "monthly"
      ? 1 + returnRate / 100 // Se mensal, soma 1 à taxa percentual
      : convertToMontlyReturnRate(1 + returnRate / 100); // Se anual, converte para mensal

  // Ajusta o prazo final para meses, se necessário
  const finalTimeHorizon =
    timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

  // Objeto de referência para o primeiro mês (mês 0)
  const referenceInvestmentObject = {
    investedAmount: startingAmount, // Valor investido até o momento
    interestReturns: 0, // Juros do mês
    totalInterestReturns: 0, // Juros acumulados
    month: 0, // Mês atual
    totalAmount: startingAmount, // Valor total acumulado
  };

  // Inicializa o array de retornos com o objeto de referência
  const returnsArray = [referenceInvestmentObject];
  // Loop para calcular os retornos mês a mês
  for (
    let timeReference = 1;
    timeReference <= finalTimeHorizon;
    timeReference++
  ) {
    // Calcula o valor total acumulado no mês atual
    const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      monthlyContribution;
    // Calcula o valor de juros do mês
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);
    // Calcula o valor total investido até o mês atual
    const investedAmount = startingAmount + monthlyContribution * timeReference;
    // Calcula o total de juros acumulados
    const totalInterestReturns = totalAmount - investedAmount;
    // Adiciona os dados do mês atual ao array
    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }

  // Retorna o array com os dados de todos os meses
  return returnsArray;
}
