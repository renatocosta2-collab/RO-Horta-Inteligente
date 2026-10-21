import { LIMITES as L } from './limits.js';
import { formatarNumero } from './format.js';

const faltaDado = (...valores) => valores.some((valor) => !Number.isFinite(valor));
const umidadeValida = (valor) => Number.isFinite(valor) && valor >= 0 && valor <= 1;
const chuvaValida = (valor) => Number.isFinite(valor) && valor >= 0;

function decidirRega({ chuva, umidade }) {
  if (chuvaValida(chuva) && chuva >= L.chuvaSuficiente) {
    return { nivel: 'espere', titulo: 'Aguarde a chuva',
      dica: `Há ${formatarNumero(chuva, 1, 'mm')} previstos. Confira o solo antes de regar.` };
  }
  if (!chuvaValida(chuva) || !umidadeValida(umidade)) {
    return { nivel: 'atencao', titulo: 'Confira o solo',
      dica: 'Faltam dados de chuva ou umidade. Verifique a terra antes de regar.' };
  }
  if (umidade >= L.soloUmido) {
    return { nivel: 'espere', titulo: 'Solo superficial úmido',
      dica: 'A camada superficial está úmida. Verifique a terra antes de regar.' };
  }
  if (umidade < L.soloSeco && chuva < L.chuvaPouca) {
    return { nivel: 'regue', titulo: 'Considere regar',
      dica: 'Pouca chuva prevista e camada superficial relativamente seca.' };
  }
  if (umidade < L.soloSeco) {
    return { nivel: 'atencao', titulo: 'Solo seco, com alguma chuva',
      dica: 'Há chuva prevista. Confira o solo antes de regar.' };
  }
  return { nivel: 'atencao', titulo: 'Confira o solo',
    dica: 'Umidade intermediária. Verifique a terra antes de decidir.' };
}

export function avaliarPlantio({ chuva, uv, umidade }) {
  if (!chuvaValida(chuva) || !umidadeValida(umidade) || !Number.isFinite(uv) || uv < 0 || uv > 30) {
    return { estado: 'sem-dados', texto: 'Plantio: dados insuficientes.' };
  }
  const motivos = [];
  if (chuva >= L.chuvaForte) motivos.push('chuva forte');
  if (uv >= L.uvAlto) motivos.push('UV alto');
  if (umidade < L.soloSeco) motivos.push('solo seco');
  if (umidade > L.soloEncharcado) motivos.push('solo encharcado');
  if (motivos.length) return { estado: 'nao', texto: `Evite plantar: ${motivos.join(', ')}.` };
  return { estado: 'sim', texto: 'Condições favoráveis para plantar.' };
}

export function avaliarDia(dia) {
  return {
    ...decidirRega(dia),
    avisoUv: Number.isFinite(dia.uv) && dia.uv >= L.uvAlto
      ? 'UV elevado: prefira atividades no início ou fim do dia.' : null,
    plantio: avaliarPlantio(dia),
  };
}
