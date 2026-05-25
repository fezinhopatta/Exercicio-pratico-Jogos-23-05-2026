import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Cadastrar Gêneros
app.post('/generos', async (req, res) => {
  const { nome } = req.body;
  const genero = await prisma.genero.create({ data: { nome } });
  res.status(201).json(genero);
});

// Cadastrar Plataformas
app.post('/plataformas', async (req, res) => {
  const { nome } = req.body;
  const plataforma = await prisma.plataforma.create({ data: { nome } });
  res.status(201).json(plataforma);
});

// Cadastrar Jogos
app.post('/jogos', async (req, res) => {
  const { titulo, idGenero } = req.body;
  const jogo = await prisma.jogo.create({
    data: { titulo, idGenero }
  });
  res.status(201).json(jogo);
});

// Relacionar jogos com plataformas (Muitos-para-Muitos)
app.post('/jogos/:id/plataformas', async (req, res) => {
  const { id } = req.params;
  const { plataformas } = req.body; // Ex: { "plataformas": [1, 2] }

  const jogo = await prisma.jogo.update({
    where: { id: Number(id) },
    data: {
      plataformas: {
        connect: plataformas.map((platId: number) => ({ id: platId }))
      }
    },
    include: { plataformas: true }
  });
  res.json(jogo);
});

// Listar os dados cadastrados
app.get('/generos', async (req, res) => {
  const generos = await prisma.genero.findMany({ include: { jogos: true } });
  res.json(generos);
});

app.get('/plataformas', async (req, res) => {
  const plataformas = await prisma.plataforma.findMany();
  res.json(plataformas);
});

app.get('/jogos', async (req, res) => {
  const jogos = await prisma.jogo.findMany({
    include: { genero: true, plataformas: true }
  });
  res.json(jogos);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
