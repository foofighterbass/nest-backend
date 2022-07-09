import {Request} from 'express'
import { UsersEntity } from 'src/users/users.entity'

export interface ExpressRequest extends Request {
  user?: UsersEntity
}