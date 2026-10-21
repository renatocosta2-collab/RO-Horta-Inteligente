import { avaliarDia } from '../utils/garden';
import { formatarData, formatarUmidade, formatarNumero } from '../utils/format';
import '../styles/DayCard.css';

export default function DayCard({ dia, destaque = false }) {
  const resultado = avaliarDia(dia);

  return (
    <article className={`dia ${resultado.nivel}${destaque ? ' destaque' : ''}`}>
      <h3><time dateTime={dia.data}>{destaque ? 'Hoje' : formatarData(dia.data)}</time></h3>
      <p className="veredito">{resultado.titulo}</p>
      <p>{resultado.dica}</p>
      {resultado.avisoUv && <p className="aviso">{resultado.avisoUv}</p>}
      <p className="plantio">{resultado.plantio.texto}</p>
      <dl className="dados">
        <dt>Chuva</dt><dd>{formatarNumero(dia.chuva, 1, 'mm')}</dd>
        <dt>UV máx.</dt><dd>{formatarNumero(dia.uv)}</dd>
        <dt>Solo (0–1 cm)</dt><dd>{formatarUmidade(dia.umidade)}</dd>
      </dl>
    </article>
  );
}
