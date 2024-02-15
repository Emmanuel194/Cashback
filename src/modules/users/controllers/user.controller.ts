import { Request, Response, request } from "express";
import * as bcrypt from "bcrypt";
import User from "../entities/user.entity";
import { AppDataSource } from "../../../../banco";
import { DeepPartial } from "typeorm";
import jwt from "jsonwebtoken";
import console from "console";
import * as nodemailer from "nodemailer";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const useremailExist = await AppDataSource.getRepository(User).findOneBy({
    email,
  });

  if (useremailExist) {
    return res.status(400).json({ message: "Este e-mail já está em uso." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepository.create({
    name,
    email,
    password: passwordHash,
  } as DeepPartial<User>);

  try {
    await userRepository.save(user);
    return res
      .status(200)
      .json({ ok: true, message: "User Created Successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: "Error trying to create user. " });
  }
};
// * Login

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  try {
    const user = await AppDataSource.getRepository(User).find({
      where: {
        email,
      },
    });

    if (await bcrypt.compare(password, user[0].password)) {
      const data = {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
      };
      return response.json({ data });
    } else {
      return response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return response.status(422).json({ message: "Error in entities!" });
  }
};

// *  Recuperação de senha

// Função para verificar se o email existe
export const checkEmailExists = async (req: Request, res: Response) => {
  const { email } = request.body;
  try {
    const existingUser = await AppDataSource.getRepository(User).find({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.redirect("/email.controller.ts");
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// * Função para enviar email de confirmação
export const sendPasswordResetEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // * Crie um token JWT com o email (substitua pela sua chave secreta real)
    const secretKey = "KHBDASHD912731237N9S7";
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

    // Configurações do Nodemailer (substitua pelas suas configurações reais)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "suportebellitate@gmail.com",
        pass: "bellitate123",
      },
    });

    // Opções do email
    const mailOptions = {
      from: "suportebellitate@gmail.com",
      to: email,
      subject: "Redefinição de Senha",
      text: "Clique no link para redefinir sua senha",
      html: `<p>Clique no link para redefinir sua senha!</p>${token}`,
    };

    // Envie o email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Email de confirmação enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar email de confirmação:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// * get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    return res.status(200).json({ ok: true, users });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: "Error trying to list users. " });
  }
};

// * search user
export const search = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const query = userRepository.createQueryBuilder("users");
    if (name) query.andWhere("users.name = :name", { name });
    if (email) query.andWhere("users.email  = :email", { email });
    const user = await query.getOne();
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ ok: false, error: "User not found." });
  }
};

// * update user
export const updateUser = async (req: Request, res: Response) => {
  const { name, password, email } = req.body;

  try {
    const user = await userRepository.findOne({ where: { name } });
    if (!user) {
      return res.status(400).json({ ok: false, error: "User not found." });
    }

    if (name) user.name = name;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (email) user.email = email;

    await userRepository.save(user);
    return res
      .status(200)
      .json({ ok: true, message: "User Updated Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error updating user" });
  }
};
// * delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const user = await userRepository.findOne({ where: { name } });
    if (!user)
      return res.status(404).json({ ok: false, error: "User not found." });

    await userRepository.softRemove(user);
    return res
      .status(200)
      .json({ ok: true, message: "User  successfully deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error deleting user." });
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: email },
      select: ["id", "name", "email", "password"],
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ ok: false, error: "Invalid password" });
    }

    // Gera token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.status(200).json({ ok: true, token });
  } catch (error) {
    console.log(error, "Error in authenticating");
    res.status(500).send({ ok: false, error: "Error authenticating user" });
  }
};
