import '../styles/StatusMessage.css';

export default function StatusMessage({ tipo, children }) {
  return (
    <p className={`status status-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
