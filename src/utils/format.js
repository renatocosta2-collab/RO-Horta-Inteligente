export function formatarData(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit',
  });
}

export function formatarNumero(valor, casas = 1, unidade = '') {
  if (!Number.isFinite(valor)) return 'sem dado';
  const numero = valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas, maximumFractionDigits: casas,
  });
  return `${numero} ${unidade}`.trim();
}

export function formatarUmidade(umidade) {
  return Number.isFinite(umidade) ? `${Math.round(umidade * 100)}%` : 'sem dado';
}

export function formatarCidade(cidade) {
  return [cidade.name, cidade.admin1, cidade.country].filter(Boolean).join(', ');
}
