import * as jwt from 'jsonwebtoken';

export default class AuthHelper {
  static verifyToken(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}
