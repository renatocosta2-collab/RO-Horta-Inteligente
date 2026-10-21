import { useState } from 'react';
import '../styles/SearchForm.css';

export default function SearchForm({ onBuscar }) {
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');

  function enviar(evento) {
    evento.preventDefault();
    const nome = texto.trim();
    if (nome.length < 2) {
      setErro('Digite pelo menos 2 letras.');
      return;
    }
    setErro('');
    onBuscar(nome);
  }

  return (
    <form className="busca" onSubmit={enviar} role="search" noValidate>
      <label htmlFor="cidade">Cidade</label>
      <input id="cidade" type="search" value={texto} placeholder="Ex.: Campinas"
        autoComplete="address-level2" onChange={(evento) => setTexto(evento.target.value)}
        aria-invalid={erro ? 'true' : undefined}
        aria-describedby={erro ? 'erro-busca' : undefined} />
      <button type="submit" >Buscar</button>
      {erro && <p id="erro-busca" className="erro-busca" role="alert">{erro}</p>}
    </form>
  );
}
