import express from 'express';
import { comentarioRotas } from './comentario.routes';
import { imagemRotas } from './imagem.routes';
import { usuarioRotas } from './usuario.routes';

export const rotas = express.Router();

rotas.use('/imagem', imagemRotas);
rotas.use('/usuario', usuarioRotas);
rotas.use('/comentario', comentarioRotas);
