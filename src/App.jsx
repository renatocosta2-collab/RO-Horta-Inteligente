import Header from './components/Header';
import SearchForm from './components/SearchForm';
import CityList from './components/CityList';
import StatusMessage from './components/StatusMessage';
import ForecastSection from './components/ForecastSection';
import Footer from './components/Footer';
import { useForecast } from './hooks/useForecast';
import { MENSAGENS } from './utils/messages';

export default function App() {
  const { estado, cidades, cidade, dias, buscar, carregar } = useForecast();
  const mensagem = MENSAGENS[estado];

  return (
    <section className="aplicacao" aria-label="Horta Inteligente">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <SearchForm onBuscar={buscar} />
        {mensagem && <StatusMessage tipo={mensagem[0]}>{mensagem[1]}</StatusMessage>}
        <CityList cidades={cidades} selecionada={cidade} onEscolher={carregar} />
        {estado === 'ok' && <ForecastSection cidade={cidade} dias={dias} />}
      </main>
      <Footer />
    </section>
  );
}
