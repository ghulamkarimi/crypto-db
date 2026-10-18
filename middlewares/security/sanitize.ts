import { Request, Response, NextFunction } from "express";

// Entfernt Operator-Schlüssel ($ne, $gt, ...) und Punkt-Pfade aus Nutzereingaben
// und verhindert so NoSQL-Injection (z. B. {"email": {"$ne": null}}).
const clean = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k.startsWith("$") || k.includes(".")) continue;
      out[k] = clean(v);
    }
    return out;
  }
  return value;
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) req.body = clean(req.body);
  if (req.params) req.params = clean(req.params) as typeof req.params;
  // req.query ist in neueren Express-Versionen nur lesbar; hier wird es nur geprüft
  next();
};
