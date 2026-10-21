import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buscarPrevisao } from '../src/services/openMeteo.js';

const cidade = { latitude: -22.9, longitude: -47.06 };

function simularApi(dados) {
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => dados });
}

function horas(dia, valores) {
  return valores.map((_, h) => `${dia}T${String(h).padStart(2, '0')}:00`);
}

test('calcula a média diária da umidade e ignora leituras nulas', async () => {
  const dia1 = Array(24).fill(0.2);
  const dia2 = [...Array(12).fill(null), ...Array(12).fill(0.3)];
  simularApi({
    daily: { time: ['2026-10-20', '2026-10-21'], precipitation_sum: [0.5, null], uv_index_max: [7.2, 8.1] },
    hourly: {
      time: [...horas('2026-10-20', dia1), ...horas('2026-10-21', dia2)],
      soil_moisture_0_to_1cm: [...dia1, ...dia2],
    },
  });
  const dias = await buscarPrevisao(cidade);
  assert.equal(dias.length, 2);
  assert.ok(Math.abs(dias[0].umidade - 0.2) < 1e-9);
  assert.ok(Math.abs(dias[1].umidade - 0.3) < 1e-9);
  assert.equal(dias[1].chuva, null);
  assert.equal(dias[0].uv, 7.2);
});

test('dia sem leitura horária fica com umidade nula', async () => {
  simularApi({ daily: { time: ['2026-10-20'], precipitation_sum: [0], uv_index_max: [5] } });
  const [dia] = await buscarPrevisao(cidade);
  assert.equal(dia.umidade, null);
});

test('erro retornado pela API vira exceção', async () => {
  simularApi({ error: true, reason: 'limite de requisições' });
  await assert.rejects(() => buscarPrevisao(cidade), /limite de requisições/);
});

test('previsão vazia é tratada como indisponível', async () => {
  simularApi({ daily: { time: [] } });
  await assert.rejects(() => buscarPrevisao(cidade), /indisponível/);
});

test('descarta umidade, chuva e UV fora da faixa válida', async () => {
  simularApi({ daily: { time: ['2026-10-20'], precipitation_sum: [-2], uv_index_max: [-1] },
    hourly: { time: ['2026-10-20T12:00'], soil_moisture_0_to_1cm: [1.3] } });
  const [dia] = await buscarPrevisao(cidade);
  assert.equal(dia.umidade, null);
  assert.equal(dia.chuva, null);
  assert.equal(dia.uv, null);
});
