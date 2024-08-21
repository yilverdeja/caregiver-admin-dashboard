import { shifts } from "@/app/data/shifts";
import { Shift, ShiftStatus } from "@/app/models/shifts";

const getShiftById = (id: number): Shift | null => {
  return shifts.find((shift) => shift.id === id) || null;
};

// gets a specific shift
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // validate id parameter
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return new Response("Invalid ID provided", { status: 400 });

  // check if the shift exists
  const shift = getShiftById(id);
  if (!shift) return new Response("Shift not found", { status: 404 });

  return Response.json(shift);
}

// updates a specific shift
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // validate id parameter
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return new Response("Invalid ID provided", { status: 400 });

  const res = await request.json();
  const status = res.status as ShiftStatus;

  // check if the new status is not pending
  if (status === "PENDING") {
    return new Response("Unable to update a shift to pending", { status: 400 });
  }

  // check if the shift exists
  const shift = getShiftById(id);
  if (!shift) return new Response("Shift not found", { status: 404 });

  // ensure that the current shift status is PENDING before it is updated
  if (shift.status !== "PENDING") {
    return new Response("Cannot update a shift that is not pending", {
      status: 409,
    });
  }

  // update status
  shift.status = status;
  return Response.json(shift);
}
