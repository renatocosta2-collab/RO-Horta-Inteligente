const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST = 'https://api.open-meteo.com/v1/forecast';

async function obterJson(url, signal) {
  const resposta = await fetch(url, { signal });
  if (!resposta.ok) throw new Error(`Serviço indisponível (${resposta.status}).`);
  const dados = await resposta.json();
  if (dados.error) throw new Error(dados.reason || 'Erro no serviço meteorológico.');
  return dados;
}

// Agrupa as leituras horárias pela data local retornada pela API e calcula a média de cada dia.
function mediasDiarias(horarios = [], valores = []) {
  const grupos = new Map();
  horarios.forEach((hora, i) => {
    if (typeof hora !== 'string' || !Number.isFinite(valores[i])
      || valores[i] < 0 || valores[i] > 1) return;
    const dia = hora.slice(0, 10);
    const grupo = grupos.get(dia) ?? { soma: 0, total: 0 };
    grupo.soma += valores[i];
    grupo.total += 1;
    grupos.set(dia, grupo);
  });
  return new Map([...grupos].map(([dia, g]) => [dia, g.soma / g.total]));
}

export async function buscarCidades(nome, signal) {
  const params = new URLSearchParams({ name: nome, count: '10', language: 'pt', format: 'json' });
  const dados = await obterJson(`${GEO}?${params}`, signal);
  return dados.results ?? [];
}

function validarMedida(valor, minimo, maximo) {
  return Number.isFinite(valor) && valor >= minimo && valor <= maximo ? valor : null;
}

export async function buscarPrevisao({ latitude, longitude }, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude),
    hourly: 'soil_moisture_0_to_1cm',
    daily: 'precipitation_sum,uv_index_max',
    timezone: 'auto', forecast_days: '7',
  });
  const dados = await obterJson(`${FORECAST}?${params}`, signal);
  if (!Array.isArray(dados.daily?.time) || !dados.daily.time.length) {
    throw new Error('A previsão desta cidade está indisponível.');
  }
  const umidades = mediasDiarias(dados.hourly?.time, dados.hourly?.soil_moisture_0_to_1cm);
  return dados.daily.time.map((data, indice) => ({
    data,
    umidade: umidades.get(data) ?? null,
    chuva: validarMedida(dados.daily.precipitation_sum?.[indice], 0, Infinity),
    uv: validarMedida(dados.daily.uv_index_max?.[indice], 0, 30),
  }));
}
