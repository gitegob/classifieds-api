import { ERole } from "../enums/ERole";

export interface JwtPayload {
  id: number;
  role: ERole;
}
