import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import autenticaJWT from './middleware.js';
import jwt from 'jsonwebtoken';
import connectMongo from './database/db.js';
import dotenv from "dotenv";
import Professor from '../src/models/professores.js';
import Reserva from './models/reservas.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3033;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

connectMongo();

app.post('/api/professores', async (req, res) => {
    const { nome, email, senha, ra } = req.body;

    if (!nome || !email || !senha || !ra) {
        return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    const novoProfessor = new Professor({ nome, email, senha, ra });

    try {
        await novoProfessor.save();
        res.status(200).json({ message: "Professor cadastrado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar professor", error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    console.log('Requisição recebida:', req.body);
    const { email, senha, ra } = req.body;

    try {
        const user = await Professor.findOne({ email });
        if (user && user.senha === senha && user.ra === ra) { // Verifica se a senha está correta
            const token = jwt.sign({ id: user.id, ra: user.ra, nome: user.nome }, 'segredo', { expiresIn: '1h' });
            res.status(200).json({ token, nome: user.nome });
        } else {
            res.status(401).json({ message: 'Credenciais Inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar', error: error.message });
    }
});

app.post('/quadro-reservas', autenticaJWT, (req, res) => {
    res.send('Reserva realizada com sucesso!');
});

app.post('/api/reservas', async (req, res) => {
    const {id, nome, data, horarioEntrada, horarioSaida, numeroPessoas, descricao, turma, bloco } = req.body;

    if (!data || !horarioEntrada || !horarioSaida || !numeroPessoas || !descricao || !turma || !bloco) {
        return res.status(400).json({ message: 'Registre todos os campos' });
    }

    const horarioConflito = await Reserva.findOne({
        data,
        $or: [
            { horarioEntrada: { $lt: horarioSaida, $gte: horarioEntrada } },
            { horarioSaida: { $gt: horarioEntrada, $lte: horarioSaida } }
        ]
    });

    if (horarioConflito) {
        return res.status(400).json({ message: 'Horário de reserva indisponível' });
    }

    const novaReserva = new Reserva({
        id,
        nome,
        data,
        horarioEntrada,
        horarioSaida,
        numeroPessoas,
        descricao,
        turma,
        bloco,
    });

    try {
        await novaReserva.save();
        res.status(201).json({ message: 'Reserva criada com sucesso', novaReserva });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar reserva', error: error.message });
    }
});

app.get('/api/reservas', async (req, res) => {
    try {
        const reservas = await Reserva.find();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reservas', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço: http://localhost:${PORT}`);
});
