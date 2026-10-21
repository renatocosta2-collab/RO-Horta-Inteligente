import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="rodape" role="contentinfo">
      <p>
        Dados de previsão e geocodificação:{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>{' '}
        (CC BY 4.0). A umidade é a da camada superficial do solo (0 a 1 cm) e as recomendações são
        estimativas.
      </p>
    </footer>
  );
}
