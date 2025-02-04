import { prisma } from '../../../prisma';
import { TipoDeCargo, Usuario } from '../../../domain/entities/usuario';
import { UsuarioRepositorio } from '../UsuarioRepositorio';
import { ApiError } from '../../../helpers/types/api-error';
import { usuarios } from '@prisma/client';

export class PrismaUsuarioRepositorio implements UsuarioRepositorio {
	async findById(id: string): Promise<Usuario | null> {
		const usuario = await prisma.usuarios.findFirst({
			where: { id: id },
		});

		if (!usuario) return null;

		return this.formatarUsuario(usuario);
	}

	async findByEmail(email: string): Promise<Usuario | null> {
		const usuario = await prisma.usuarios.findFirst({
			where: { email: email },
		});

		if (!usuario) return null;

		return this.formatarUsuario(usuario);
	}

	async create(data: Usuario): Promise<Usuario> {
		if (
			(await this.findById(data.id)) ||
			(await this.findByEmail(data.props.email))
		) {
			throw new ApiError(`Usuario ${data.id} já existe.`, 400);
		}

		const usuario = await prisma.usuarios.create({
			data: {
				id: data.id,
				nome: data.props.nome,
				email: data.props.email,
				senha: data.props.senha,
				imagem_de_perfil: data.props.imagemDePerfil,
				cargo: data.props.cargo,
				atualizado_em: data.atualizadoEm,
				criado_em: data.criadoEm,
				deletado_em: data.deletadoEm,
			},
		});

		return this.formatarUsuario(usuario);
	}

	private formatarUsuario(usuario: usuarios): Usuario {
		return Usuario.criar(
			{
				nome: usuario.nome,
				email: usuario.email,
				senha: usuario.senha,
				imagemDePerfil: usuario.imagem_de_perfil,
				cargo: usuario.cargo as TipoDeCargo,
			},
			usuario.criado_em,
			usuario.atualizado_em,
			usuario.id,
			usuario.deletado_em ?? undefined,
		);
	}
}
