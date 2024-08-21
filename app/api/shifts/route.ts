import { shifts } from "@/app/data/shifts";
import { Shift, ShiftStatus } from "@/app/models/shifts";

// gets all shifts
export async function GET(request: Request) {
  return Response.json(shifts);
}

// updates multiple shift statuses by id
export async function PATCH(request: Request) {
  const res = await request.json();
  const { ids, status }: { ids: number[]; status: ShiftStatus } = res;

  let updatedShifts: Shift[] = [];
  let notFoundIds: number[] = [];
  let skippedIds: number[] = [];

  // updates shift status to confirmed or declined if pending
  ids.forEach((id) => {
    const shift = shifts.find((s) => s.id === id);
    if (!shift) {
      notFoundIds.push(id);
    } else if (shift.status !== "PENDING") {
      skippedIds.push(id);
    } else {
      shift.status = status;
      updatedShifts.push(shift);
    }
  });

  let error = {};
  if (notFoundIds.length > 0 || skippedIds.length > 0) {
    const errorMessages = [];
    if (notFoundIds.length > 0)
      errorMessages.push("Some shifts were not found");
    if (skippedIds.length > 0)
      errorMessages.push(
        "Some shifts were not updated due to their non-PENDING status"
      );
    error = {
      message: errorMessages.join(" & "),
      notFoundIds,
      skippedIds,
    };

    if (updatedShifts.length === 0) {
      const statusCode = notFoundIds.length === ids.length ? 404 : 409;
      return res.status(statusCode).json({ error });
    }
  }

  if (Object.keys(error).length > 0) res.json({ updatedShifts, error });
  else res.json({ updatedShifts });
}
