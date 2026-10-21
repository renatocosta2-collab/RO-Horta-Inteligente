import { useState } from 'react';
import DayList from './DayList';
import StatusMessage from './StatusMessage';
import { avaliarDia } from '../utils/garden';
import { formatarCidade } from '../utils/format';
import '../styles/ForecastSection.css';

export default function ForecastSection({ cidade, dias }) {
  const [soRegar, setSoRegar] = useState(false);
  const visiveis = soRegar ? dias.filter((d) => avaliarDia(d).nivel === 'regue') : dias;

  return (
    <section aria-label={`Previsão para ${cidade.name}`}>
      <header className="barra">
        <h2>{formatarCidade(cidade)}</h2>
        <label className="filtro">
          <input type="checkbox" checked={soRegar} onChange={(e) => setSoRegar(e.target.checked)} />
          Mostrar só dias para regar
        </label>
      </header>
      {visiveis.length === 0 ? (
        <StatusMessage tipo="info">
          Nenhum dia pede rega nesta semana. Desmarque o filtro para ver todos.
        </StatusMessage>
      ) : (
        <DayList dias={visiveis} hoje={dias[0].data} />
      )}
    </section>
  );
}
