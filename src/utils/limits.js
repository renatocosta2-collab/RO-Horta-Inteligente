// Limites usados nas regras. São estimativas didáticas, não uma norma agronômica.
export const LIMITES = {
  chuvaPouca: 2, // mm: abaixo disso conta como pouca chuva
  chuvaSuficiente: 5, // mm: a chuva já molha a horta
  chuvaForte: 10, // mm: ruim para plantar
  soloSeco: 0.22, // m³/m³: abaixo disso a camada superficial está seca
  soloUmido: 0.3, // m³/m³: a partir disso já está úmida
  soloEncharcado: 0.38, // m³/m³: acima disso é ruim para plantar
  uvAlto: 8,
};
