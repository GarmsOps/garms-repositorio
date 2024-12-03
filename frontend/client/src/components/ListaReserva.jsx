import { useEffect, useState } from 'react';
import { format, parseISO} from 'date-fns'
import './ListaReserva.css'; 
import Header from './Header'
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext';
import LogoEtec from './LogoEtec';

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const { user } = useAuth()

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch('/api/reservas')
        const data= await response.json()
        setReservas(data)
      } catch (error) {
        console.log('Erro ao buscar reservas: ', error)
      }
    }

    fetchReservas()
  }, [])

  return (
    <div className="container">
      <div className="lista-reservas">
        <LogoEtec/>
        <Header nome={user?.nome}/>
        <h2>Lista de Reservas</h2>
        <table>
          <thead>
            <tr>
              <th>Nome do Professor</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Descrição</th>
              <th>Turma</th>
              <th>Bloco</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(reserva => (
              <tr key={reserva.id}>
                <td>{reserva.nome}</td>
                <td>{format(parseISO(reserva.data), 'dd/MM/yyyy')}</td>
                <td><p>Das {reserva.horarioEntrada}h às {reserva.horarioSaida}h</p></td>
                <td>{reserva.descricao}</td>
                <td>{reserva.turma}</td>
                <td>{reserva.bloco}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttonReservar">
          <button><a href="/reservar">Faça a sua reserva</a></button>
        </div>
      </div>
    </div>
  );

};

ListaReservas.propTypes = {
  nome: PropTypes.string,  
}

export default ListaReservas;
