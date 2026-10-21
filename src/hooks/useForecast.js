import { useEffect, useRef, useState } from 'react';
import { buscarCidades, buscarPrevisao } from '../services/openMeteo';

export function useForecast() {
  const [estado, setEstado] = useState('inicio');
  const [cidades, setCidades] = useState([]);
  const [cidade, setCidade] = useState(null);
  const [dias, setDias] = useState([]);
  const controlador = useRef(null);
  useEffect(() => () => controlador.current?.abort(), []);

  function iniciar() {
    controlador.current?.abort();
    controlador.current = new AbortController();
    setEstado('carregando');
    return controlador.current.signal;
  }

  async function carregar(escolhida) {
    const signal = iniciar();
    setCidade(escolhida);
    setDias([]);
    try {
      const previsao = await buscarPrevisao(escolhida, signal);
      if (signal.aborted) return;
      setDias(previsao);
      setEstado('ok');
    } catch {
      if (!signal.aborted) setEstado('erro');
    }
  }

  async function buscar(nome) {
    const signal = iniciar();
    setCidades([]);
    setCidade(null);
    setDias([]);
    try {
      const encontradas = await buscarCidades(nome, signal);
      if (signal.aborted) return;
      setCidades(encontradas);
      if (encontradas.length === 1) {
        await carregar(encontradas[0]); // uma só opção: não há o que escolher
        return;
      }
      setEstado(encontradas.length ? 'escolher' : 'vazio');
    } catch {
      if (!signal.aborted) setEstado('erro');
    }
  }

  return { estado, cidades, cidade, dias, buscar, carregar };
}
