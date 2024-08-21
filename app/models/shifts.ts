export type ShiftStatus = "DECLINED" | "CONFIRMED" | "PENDING";
export type ShiftRole = "EN" | "ST" | "PWH";

export interface Shift {
  id: number;
  startedAt: string;
  endedAt: string;
  status: ShiftStatus;
  userId: number;
  chiName: string;
  lastName: string;
  firstName: string;
  role: ShiftRole;
}
