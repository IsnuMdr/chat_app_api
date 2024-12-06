declare namespace Express {
  export interface Request {
    user?: {
      fullname: string;
      sub: number;
    };
  }
}
