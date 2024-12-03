import PropTypes from 'prop-types';
import './Header.css';
import LogoEtec from './LogoEtec';

const Header = ({ nome }) => {
    return (
        <header className='header'>
                <LogoEtec/>
                <h2>Sistema de Reserva de Auditório</h2>
                <div className="user-logged">
                    {nome && <p><span>Usuário logado:<br></br></span> {nome}</p>}
                    {/* <p>Usuário Logado:br Murilo Weishaupt</p> */}
                    <img className="img-professor" src="https://www.etecdeembu.com.br/assets/img/funcionarios/23.png" alt="" />
                </div> 
        </header>
    )
}

Header.propTypes = {
    nome: PropTypes.string
}

export default Header