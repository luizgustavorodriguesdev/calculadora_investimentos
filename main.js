// Importa funções de cálculo, gráficos e tabela
import { generateReturnsArray } from './src/investmentGoals';
import { Chart } from 'chart.js/auto';
import { createTable } from './src/table';

// Referências aos elementos do DOM
const finalMoneyChart = document.getElementById('final-money-distribution'); // Gráfico doughnut
const progressionChart = document.getElementById('progression'); // Gráfico de barras
const form = document.getElementById('investment-form'); // Formulário principal
const clearFormButton = document.getElementById('clear-form'); // Botão de limpar formulário
// const calculateButton = document.getElementById('calculate-results');
let doughnutChartReference = {}; // Referência ao gráfico doughnut
let progressionChartReference = {}; // Referência ao gráfico de barras

// Definição das colunas da tabela de resultados
const columnsArray = [
  { columnLabel: 'Mês', accessor: 'month' },
  {
    columnLabel: 'Total Investido',
    accessor: 'investedAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Rendimento Mensal',
    accessor: 'interestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Rendimento Total',
    accessor: 'totalInterestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Quantia Total',
    accessor: 'totalAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

// Formata valores para moeda brasileira para exibição na tabela
function formatCurrencyToTable(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata valores para exibição nos gráficos (duas casas decimais)
function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

// Função principal para processar o formulário e renderizar gráficos e tabela
function renderProgression(evt) {
  evt.preventDefault(); // Evita recarregar a página
  if (document.querySelector('.error')) {
    return; // Não processa se houver erro de validação
  }
  resetCharts(); // Limpa gráficos anteriores
  // Coleta e converte os valores do formulário
  // const startingAmount = Number(form['startingAmount'].value);
  const startingAmount = Number(
    document.getElementById('starting-amount').value.replace(',', '.')
  );
  const additionalContribution = Number(
    document.getElementById('additional-contribution').value.replace(',', '.')
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(
    document.getElementById('return-rate').value.replace(',', '.')
  );
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(
    document.getElementById('tax-rate').value.replace(',', '.')
  );

  // Gera o array de resultados do investimento
  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  // Pega o último objeto (resultado final)
  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  // Cria o gráfico doughnut de distribuição final
  doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  // Cria o gráfico de barras de evolução mensal
  progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: 'Total Investido',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Retorno do Investimento',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturns)
          ),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  // Cria a tabela de resultados
  createTable(columnsArray, returnsArray, 'results-table');
}

// Função utilitária para verificar se um objeto está vazio
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Destroi os gráficos existentes antes de criar novos
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

// Limpa o formulário e os gráficos
function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribution'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

  resetCharts();

  const errorInputContainers = document.querySelectorAll('.error');

  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove('error');
    errorInputContainer.parentElement.querySelector('p').remove();
  }
}

// Validação dos campos do formulário
function validateInput(evt) {
  if (evt.target.value === '') {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(',', '.');

  if (
    !parentElement.classList.contains('error') &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    // objetivo: <p class="text-red-500">Insira um valor numérico e maior que zero</p>
    const errorTextElement = document.createElement('p'); //<p></p>
    errorTextElement.classList.add('text-red-500'); //<p class='text-red-500'></p>
    errorTextElement.innerText = 'Insira um valor numérico e maior que zero'; //<p class="text-red-500">Insira um valor numérico e maior que zero</p>

    parentElement.classList.add('error');
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains('error') &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove('error');
    grandParentElement.querySelector('p').remove();
  }
}

// Adiciona evento de validação para cada input do formulário
for (const formElement of form) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validateInput);
  }
}

// Referências para o carrossel de slides
const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

// Eventos para navegação do carrossel
nextButton.addEventListener('click', () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});
previousButton.addEventListener('click', () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});

// Eventos principais do formulário
form.addEventListener('submit', renderProgression);
// calculateButton.addEventListener('click', renderProgression);
clearFormButton.addEventListener('click', clearForm);
