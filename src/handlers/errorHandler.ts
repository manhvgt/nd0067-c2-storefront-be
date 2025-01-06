import { Request, Response } from 'express';

export function handleError(err: unknown): string {
    if (err instanceof Error) {
      return err.message;
    }
    return String(err);
  }
  
  export function responseError(res: Response, err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: handleError(err) });
    } else {
      res.status((err as any).status || 500).json({ error: (err as any).message });
    }
  }
  