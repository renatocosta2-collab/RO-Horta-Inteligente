import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avaliarDia } from '../src/utils/garden.js';

test('solo seco e pouca chuva: regar, e não plantar', () => {
  const r = avaliarDia({ chuva: 1, uv: 3, umidade: 0.185 });
  assert.equal(r.nivel, 'regue');
  assert.equal(r.plantio.estado, 'nao');
  assert.match(r.plantio.texto, /solo seco/);
});

test('chuva forte sem dado de umidade: ainda aguarda a chuva', () => {
  const r = avaliarDia({ chuva: 6, uv: 3, umidade: null });
  assert.equal(r.nivel, 'espere');
  assert.equal(r.plantio.estado, 'sem-dados');
});

test('solo encharcado: não recomenda plantar', () => {
  const r = avaliarDia({ chuva: 0, uv: 3, umidade: 0.4 });
  assert.equal(r.nivel, 'espere');
  assert.match(r.plantio.texto, /solo encharcado/);
});

test('dados ausentes não viram zero nem recomendação', () => {
  const r = avaliarDia({ chuva: null, uv: null, umidade: null });
  assert.equal(r.nivel, 'atencao');
  assert.equal(r.plantio.estado, 'sem-dados');
  assert.equal(r.avisoUv, null);
});

test('condições boas: plantio favorável', () => {
  const r = avaliarDia({ chuva: 1, uv: 3, umidade: 0.25 });
  assert.equal(r.plantio.estado, 'sim');
});

test('nunca recomenda regar e plantar no mesmo dia', () => {
  for (let umidade = 0; umidade <= 0.5; umidade += 0.005) {
    for (let chuva = 0; chuva <= 12; chuva += 0.5) {
      for (let uv = 0; uv <= 10; uv += 1) {
        const r = avaliarDia({ chuva, uv, umidade });
        assert.ok(!(r.nivel === 'regue' && r.plantio.estado === 'sim'),
          `conflito em chuva=${chuva} uv=${uv} umidade=${umidade}`);
      }
    }
  }
});

test('umidade fora de 0 a 1 não produz recomendação de rega ou plantio', () => {
  const r = avaliarDia({ chuva: 0, uv: 4, umidade: -0.2 });
  assert.equal(r.nivel, 'atencao');
  assert.equal(r.plantio.estado, 'sem-dados');
});
