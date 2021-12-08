import { Request, Response } from 'express'

import User from '../database/schemas/User'
import hashPassword from '../utils/hashPassword/hashPassword'
import checkPassword from '../utils/hashPassword/checkPassword'
class UserController {
  public async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const passwordHashed = await hashPassword(req.body.password)
      const user = await User.create({ ...req.body, password: passwordHashed })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async authUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email: email }).select('+password')
      console.log(user)
      if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' })
      }

      // Retorna false se o password informado na requisição não bater com o criptografado
      if (!checkPassword(password, user.password)) {
        return res.status(400).send({ error: 'Senha inválida' })
      }

      return res.status(200).json(user)

    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }
}

export default new UserController()
