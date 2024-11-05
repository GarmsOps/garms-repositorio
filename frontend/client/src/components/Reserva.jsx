  import { useState } from 'react';
  import './Reserva.css';
  import Header from './Header';
  import { useAuth } from '../AuthContext';
  import { useNavigate } from 'react-router-dom'
import LogoEtec from './LogoEtec';

  const CadastroReserva = () => {
    const [data, setData] = useState('');
    const [horarioEntrada, setHorarioEntrada] = useState('');
    const [horarioSaida, setHorarioSaida] = useState('');
    const [numeroPessoas, setNumeroPessoas] = useState('');
    const [descricao, setDescricao] = useState('');
    const [turma, setTurma] = useState('');
    const [bloco, setBloco] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate()

    // Definição de turmas e blocos
    const turmas = {
      '1°TRT': ['A', 'B', 'Ambos'],
      '2°TRT': ['A', 'B', 'Ambos'],
      '3°TRT': ['A', 'B', 'Ambos'],
      '1°DSN': ['A', 'B', 'Ambos'],
      '2°DSN': ['A', 'B', 'Ambos'],
      '3°DSN': ['A', 'B', 'Ambos'],
    };

    const verificaReserva = async () => {
      const response = await fetch(`/api/reservas?data=${data}`);
      
      if (!response.ok) {
        setError('Erro ao verificar reservas');
        return false; 
      }

      const reservas = await response.json();

      // Verifica conflito de horários
      return reservas.some(reserva => 
        (reserva.data === data && (horarioEntrada < reserva.horarioSaida && horarioSaida > reserva.horarioEntrada))
      );
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      try {
        const reservaJaExiste = await verificaReserva();

        if (reservaJaExiste) {
          setError('Horário de reserva indisponível');
          setLoading(false);
          return;
        }

        const novaReserva = {
          nome: user.nome,
          data,
          horarioEntrada,
          horarioSaida,
          numeroPessoas: Number(numeroPessoas), // Certificando-se de que é um número
          descricao,
          turma,
          bloco,
        };

        console.log('Nova Reserva:', novaReserva); // Para depuração

        const response = await fetch('/api/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novaReserva),
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Obter mensagem de erro
          throw new Error(`Erro ao cadastrar reserva: ${errorMessage}`);
        }

        const result = await response.json();
        console.log('Reserva cadastrada com sucesso:', result);

        // Limpa os campos do formulário após o cadastro
        // setData('');
        // setHorarioEntrada('');
        // setHorarioSaida('');
        // setNumeroPessoas('');
        // setDescricao('');
        // setTurma('');
        // setBloco('');
        navigate('/quadro-reservas')


      } catch (error) {
        console.log('Erro:', error);
        setError('Erro ao cadastrar reserva. Tente novamente.');
      } finally {
        setLoading(false); 
      }
    };

    return (
      <>
      <LogoEtec/>
        <Header nome={user?.nome} />
        <div className="cadastro-reserva">
          <h2>Cadastro de Reserva do Auditório</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="data">Data:</label>
              <input
                type="date"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horarioEntrada">Horário de entrada:</label>
              <input
                type="time"
                id="horarioEntrada"
                value={horarioEntrada}
                onChange={(e) => setHorarioEntrada(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horarioSaida">Horário de saída:</label>
              <input
                type="time"
                id="horarioSaida"
                value={horarioSaida}
                onChange={(e) => setHorarioSaida(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numeroPessoas">Número de Pessoas:</label>
              <input
                type="number"
                id="numeroPessoas"
                value={numeroPessoas}
                onChange={(e) => setNumeroPessoas(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição:</label>
              <textarea
                className='descricao-fixa'
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="turma">Turma:</label>
              <select
                id="turma"
                value={turma}
                onChange={(e) => {
                  setTurma(e.target.value);
                  setBloco(''); // Reseta o bloco ao mudar a turma
                }}
                required
              >
                <option value="">Selecione uma turma</option>
                {Object.keys(turmas).map((turma, index) => (
                  <option key={index} value={turma}>{turma}</option>
                ))}
              </select>
            </div>

            {turma && (
              <div className="form-group">
                <label htmlFor="bloco">Bloco:</label>
                <select
                  id="bloco"
                  value={bloco}
                  onChange={(e) => setBloco(e.target.value)}
                  required
                >
                  <option value="">Selecione um bloco</option>
                  {turmas[turma].map((bloco, index) => (
                    <option key={index} value={bloco}>{bloco}</option>
                  ))}
                </select>
              </div>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Reserva'}
            </button>
            <a href="/quadro-reservas">
              <button type='button' className='checkList'>Verificar reservas</button>
            </a>
          </form>
        </div>
      </>
    );
  };

  export default CadastroReserva;
