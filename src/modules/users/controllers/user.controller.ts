import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import User from "../entities/user.entity";
import { AppDataSource } from "../../../../banco";
import { DeepPartial } from "typeorm";
import jwt from "jsonwebtoken";

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
