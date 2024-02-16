import { Request, Response } from "express";
import { AppDataSource } from "../../../../banco";
import { Empresa } from "./entities./empresa.entities.ts";

const repository = AppDataSource.getRepository(Empresa);

export default new (class EmpresaController {
  async createEmpresa(req: Request, res: Response) {
    const { nome, cnpj, percentual_cashback } = req.body;

    const [cnpjExists] = await Promise.all([repository.findOneBy({ cnpj })]);

    if (cnpjExists) {
      return res.status(400).json({
        ok: false,
        message: "Empresa already registered with this CNPJ.",
      });
    }

    try {
      await repository.save({
        nome,
        cnpj,
        percentual_cashback,
      });
      return res.status(201).json({
        ok: true,
        message: "Empresa successfully registered.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error trying to create empresa.",
      });
    }
  }

  async getAllEmpresas(req: Request, res: Response) {
    try {
      const empresas = await repository.find();

      if (!empresas) {
        return res.status(404).json({
          ok: false,
          message: "Empresas not found!",
        });
      }

      return res.status(200).json({
        ok: true,
        empresas,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error trying to list empresas.",
      });
    }
  }
})();
