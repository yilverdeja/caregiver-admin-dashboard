interface Props {
  start: string;
  end: string;
  roundTo5Mins?: boolean;
}

// converts the date string to a readable time format
const dateToString = (dt: string, roundTo5Mins: boolean) => {
  const dtDate = new Date(dt);
  if (roundTo5Mins) {
    const coeff = 1000 * 60 * 5;
    const roundedDate = new Date(Math.round(dtDate.getTime() / coeff) * coeff);
    return roundedDate.toLocaleString("en-US", {
      timeZone: "UTC",
      timeStyle: "short",
    });
  }

  return dtDate.toLocaleString("en-US", {
    timeZone: "UTC",
    timeStyle: "short",
  });
};

const ShiftTime = ({ start, end, roundTo5Mins = false }: Props) => {
  return (
    <p className="my-1">
      {dateToString(start, roundTo5Mins)}-{dateToString(end, roundTo5Mins)}
    </p>
  );
};

export default ShiftTime;
