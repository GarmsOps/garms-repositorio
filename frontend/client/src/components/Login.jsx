  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { jwtDecode } from 'jwt-decode';
  import { useAuth } from '../AuthContext';
  import './Login.css';
import LogoEtec from './LogoEtec';

  const Login = () => { // Declara os estados dos dados dos inputs (Iniciando com string vazia) e de erro
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [ra, setRa] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => { 
      e.preventDefault();
      setError('');

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha, ra }) 

        });

        if (!response.ok) {
          throw new Error('Credenciais inválidas'); 
        }

        const data = await response.json(); // Transformar JSON para objeto JS
        login(data.token)
        localStorage.setItem('token', data.token); // Armazenar o token
        console.log('Usuário logado:', data); 
        const decodificaToken = jwtDecode(data.token);
        setEmail(decodificaToken.email)

        const nome = data.nome ||decodificaToken.nome
        localStorage.setItem('nome', nome) 

        navigate('/quadro-reservas'); // Se login bem-sucedido, direciona para a rota /reservar
      } catch (err) {
        setError(err.message); // Mostrar mensagem de erro
      }
    };

    

    return (
      <div className="login-container">
        <LogoEtec/>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ra">RA do professor:</label>
            <input
              type="text"
              id="ra"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">Entrar</button>
        </form>

        {error && <div style={{ color: 'red', marginTop: '10px'}}>{error}</div>} 
        {/* Se tem erro, ativa essa linha acima */}
        {/* <p>
          Não tem uma conta? <a href="/registrar">Cadastre-se</a>
        </p> */}
      </div>
    );
  };

  export default Login;
