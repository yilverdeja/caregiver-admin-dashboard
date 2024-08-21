"use client";
import { useContext } from "react";
import ShiftSelectionContext from "../contexts/ShiftSelectionContext";
import { Shift, ShiftStatus } from "../models/shifts";
import Checkbox from "./Checkbox";
import ShiftTime from "./ShiftTime";
import ShiftRelease from "./ShiftRelease";
import ShiftRole from "./ShiftRole";
import StatusButton from "./StatusButton";

interface Props {
  shift: Shift;
  onUpdateStatus: (status: ShiftStatus) => void;
}

const ShiftCard = ({ shift, onUpdateStatus }: Props) => {
  const { selectedShifts, toggleShift } = useContext(ShiftSelectionContext);
  const isChecked = selectedShifts[shift.id] || false;

  return (
    <div className="flex flex-row items-center px-2">
      <div className="mx-4">
        <Checkbox
          checked={isChecked}
          onToggle={() => toggleShift(shift.id)}
          disabled={shift.status !== "PENDING"}
        />
      </div>
      <div className="flex-grow flex flex-col my-2">
        {shift.status === "PENDING" && <ShiftRelease start={shift.startedAt} />}
        <ShiftTime
          start={shift.startedAt}
          end={shift.endedAt}
          roundTo5Mins={true}
        />
        <p className="my-1">
          {shift.userId} - {shift.lastName} {shift.firstName} {shift.chiName}
        </p>
        <ShiftRole role={shift.role} />
        <div className="flex flex-row gap-2 my-1">
          <StatusButton
            onClick={() => onUpdateStatus("DECLINED")}
            disabled={shift.status === "DECLINED"}
            buttonType="DECLINE"
            status={shift.status}
          />
          <StatusButton
            onClick={() => onUpdateStatus("CONFIRMED")}
            disabled={shift.status === "CONFIRMED"}
            buttonType="CONFIRM"
            status={shift.status}
          />
        </div>
      </div>
    </div>
  );
};

export default ShiftCard;
