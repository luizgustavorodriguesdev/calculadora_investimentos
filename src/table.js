// Função utilitária para verificar se um elemento é um array não vazio
const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};

// Função principal para criar uma tabela dinâmica
export const createTable = (columnsArray, dataArray, tableId) => {
  // Validação dos parâmetros de entrada
  if (
    !isNonEmptyArray(columnsArray) &&
    !isNonEmptyArray(dataArray) &&
    !tableId
  ) {
    throw new Error(
      'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado'
    );
  }
  // Seleciona o elemento da tabela pelo id
  const tableElement = document.getElementById(tableId);
  // Verifica se o elemento existe e se é uma tabela
  if (!tableElement || tableElement.nodeName !== 'TABLE') {
    throw new Error('Id informado não corresponde a nenhum elemento table');
  }

  // Cria o cabeçalho e o corpo da tabela
  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

// Função para criar o cabeçalho da tabela
function createTableHeader(tableReference, columnsArray) {
  /*    <table></table> || 
        <table>
          <thead></thead>
          <tbody></tbody>
        </table> */
  // Cria o elemento thead, se não existir
  function createTheadElement(tableReference) {
    const thead = document.createElement('thead'); //<thead></thead>
    tableReference.appendChild(thead); //<table><thead></thead></table>
    return thead;
  }
  // Seleciona ou cria o thead
  const tableHeaderReference =
    tableReference.querySelector('thead') ?? createTheadElement(tableReference);
  //<table><thead></thead></table>
  // Cria a linha do cabeçalho
  const headerRow = document.createElement('tr'); //<tr></tr>
  // Adiciona classes CSS para estilização do cabeçalho
  ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) =>
    headerRow.classList.add(cssClass)
  );
  // Para cada coluna, cria um elemento <th> com o nome da coluna
  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class='text-center' >${tableColumnObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement;
  }
  //<tr><th class='text-center'>NomeDaColuna</th><th class='text-center'>NomeDaColuna</th></tr>
  tableHeaderReference.appendChild(headerRow);
}

// Função para criar o corpo da tabela
function createTableBody(tableReference, tableItems, columnsArray) {
  // Cria o elemento tbody, se não existir
  function createTbodyElement(tableReference) {
    const tbody = document.createElement('tbody');
    tableReference.appendChild(tbody);
    return tbody;
  }
  // Seleciona ou cria o tbody
  const tableBodyReference =
    tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

  // Para cada item (linha) dos dados
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement('tr');
    // Adiciona cor de fundo alternada para linhas ímpares
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add('bg-blue-200');
    }
    // Para cada coluna, cria uma célula <td> com o valor formatado
    for (const tableColumn of columnsArray) {
      // Usa função de formatação se existir, senão retorna o valor puro
      const formatFn = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class='text-center'>${formatFn(
        tableItem[tableColumn.accessor]
      )}</td>`;
    }
    // Adiciona a linha ao corpo da tabela
    tableBodyReference.appendChild(tableRow);
  }
}
