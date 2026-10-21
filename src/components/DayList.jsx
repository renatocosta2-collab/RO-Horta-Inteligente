import DayCard from './DayCard';
import '../styles/DayList.css';

export default function DayList({ dias, hoje }) {
  return (
    <ul className="grade" role="list">
      {dias.map((dia) => {
        const ehHoje = dia.data === hoje;
        return (
          <li key={dia.data} className={ehHoje ? 'destaque' : undefined}>
            <DayCard dia={dia} destaque={ehHoje} />
          </li>
        );
      })}
    </ul>
  );
}
