const marcaSelect = document.getElementById('marca');
const modeloSelect = document.getElementById('modelo');
const anoSelect = document.getElementById('ano');

const form = document.getElementById('form');
const resultadoDiv = document.getElementById('resultado');

// Busca marcas FIPE
async function fetchMarcas() {
  try {
    const res = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const marcas = await res.json();
    marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca.codigo;
      option.textContent = marca.nome;
      marcaSelect.appendChild(option);
    });
  } catch (error) {
    alert('Erro ao carregar marcas FIPE.');
  }
}

// Busca modelos da marca selecionada
async function fetchModelos(codigoMarca) {
  modeloSelect.innerHTML = '<option value="">Selecione o modelo</option>';
  modeloSelect.disabled = true;
  anoSelect.innerHTML = '<option value="">Selecione o ano</option>';
  anoSelect.disabled = true;
  if (!codigoMarca) return;

  try {
    const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`);
    const data = await res.json();
    data.modelos.forEach(modelo => {
      const option = document.createElement('option');
      option.value = modelo.codigo;
      option.textContent = modelo.nome;
      modeloSelect.appendChild(option);
    });
    modeloSelect.disabled = false;
  } catch (error) {
    alert('Erro ao carregar modelos FIPE.');
  }
}

// Busca anos do modelo selecionado
async function fetchAnos(codigoMarca, codigoModelo) {
  anoSelect.innerHTML = '<option value="">Selecione o ano</option>';
  anoSelect.disabled = true;
  if (!codigoMarca || !codigoModelo) return;

  try {
    const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`);
    const anos = await res.json();
    anos.forEach(ano => {
      const option = document.createElement('option');
      option.value = ano.codigo;
      option.textContent = ano.nome;
      anoSelect.appendChild(option);
    });
    anoSelect.disabled = false;
  } catch (error) {
    alert('Erro ao carregar anos FIPE.');
  }
}

// Eventos
marcaSelect.addEventListener('change', () => {
  fetchModelos(marcaSelect.value);
});

modeloSelect.addEventListener('change', () => {
  fetchAnos(marcaSelect.value, modeloSelect.value);
});

// Inicializa marcas
fetchMarcas();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const marcaTexto = marcaSelect.options[marcaSelect.selectedIndex]?.text || '';
  const modeloTexto = modeloSelect.options[modeloSelect.selectedIndex]?.text || '';
  const anoSelecionado = anoSelect.value;
  if (!anoSelecionado) {
    alert('Por favor, selecione o ano do veículo.');
    return;
  }
  const ano = parseInt(anoSelecionado.split('-')[0]);

  const valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value);
  const precoLitro = parseFloat(document.getElementById('precoLitro').value);
  const consumoMedio = parseFloat(document.getElementById('consumoMedio').value);
  const custoFixoDiario = parseFloat(document.getElementById('custoFixoDiario').value);
  const valorKm = parseFloat(document.getElementById('valorKm').value);

  // Cálculos
  const kmComCombustivel = (valorCombustivel / precoLitro) * consumoMedio;
  const kmEstimadoPorDia = 100; // valor estimado apenas para dividir custo fixo
  const custoFixoPorKm = custoFixoDiario / kmEstimadoPorDia;
  const custoCombustivelPorKm = precoLitro / consumoMedio;
  const custoTotalMinimoPorKm = custoFixoPorKm + custoCombustivelPorKm;
  const receitaTotal = kmComCombustivel * valorKm;
  const lucroLiquido = receitaTotal - (kmComCombustivel * custoTotalMinimoPorKm);

  resultadoDiv.innerHTML = `
Modelo: ${modeloTexto}
Marca: ${marcaTexto}
Ano: ${ano}

Custo fixo diário informado: R$ ${custoFixoDiario.toFixed(2)}
Consumo médio informado: ${consumoMedio.toFixed(2)} km/l

Com R$ ${valorCombustivel.toFixed(2)} em combustível, você consegue rodar aproximadamente: ${kmComCombustivel.toFixed(2)} km

Custo fixo estimado por km: R$ ${custoFixoPorKm.toFixed(2)}
Custo combustível por km: R$ ${custoCombustivelPorKm.toFixed(2)}
Custo total mínimo por km: R$ ${custoTotalMinimoPorKm.toFixed(2)}

Valor recebido por km: R$ ${valorKm.toFixed(2)}
Receita total estimada: R$ ${receitaTotal.toFixed(2)}
Lucro líquido estimado: R$ ${lucroLiquido.toFixed(2)}
  `;
});
