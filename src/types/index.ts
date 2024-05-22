import { CookieOptions, Request, Response } from 'express';

export interface IResponseType {
  message: string;
  status?: number;
  code?: number;
  data: any;
}

export interface IResponseWithCookie extends Response {
  cookies: (name: string, val: string, option: CookieOptions) => this;
  cookie: any;
}
export interface IRequestWithCookie extends Request {
  cookie: (name: string, data: any, option: any) => void;
}

export type ResponseType = Response | IResponseWithCookie;
// export interface AuthRequest extends Request<any> {
//     user: Pick<
//         AdminType,
//         | "id"
//         | "first_name"
//         | "email"
//         | "provider_id"
//         | ("is_super_admin" & { role: string })
//     >;
// }
