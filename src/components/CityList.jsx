
import { useState } from 'react';
import { formatarCidade } from '../utils/format';
import '../styles/CityList.css';

export default function CityList({ cidades, selecionada, onEscolher }) {
  const [aberta, setAberta] = useState(false);

  if (cidades.length < 2) return null;

  function escolherCidade(cidade) {
    onEscolher(cidade);
    setAberta(false);
  }

  const cidadeAtual = cidades.find(
    (cidade) => cidade.id === selecionada?.id
  );

  return (
    <section aria-label="Seleção de cidades">
      <details
        open={aberta}
        onToggle={(evento) => setAberta(evento.currentTarget.open)}
      >
        <summary>
          {cidadeAtual
            ? `Cidade selecionada: ${formatarCidade(cidadeAtual)}`
            : 'Selecione a cidade correta'}
          {' — '}
          {aberta ? 'Ocultar opções' : 'Ver opções'}
        </summary>

        <h2 id="titulo-cidades">Selecione a cidade correta</h2>

        <ul className="cidades" aria-labelledby="titulo-cidades">
          {cidades.map((cidade) => {
            const ativa = cidade.id === selecionada?.id;

            return (
              <li key={cidade.id}>
                <button
                  type="button"
                  className={ativa ? 'cidade ativa' : 'cidade'}
                  aria-pressed={ativa}
                  onClick={() => escolherCidade(cidade)}
                >
                  {formatarCidade(cidade)}
                </button>
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}
