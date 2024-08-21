import { FaClock } from "react-icons/fa6";

interface Props {
  start: string;
}

const getHoursMinutes = (timeDifference: number) => {
  // convert difference from milliseconds to hours
  const hours = Math.floor(timeDifference / (60 * 60 * 1000));

  // convert the remaining milliseconds to minutes
  const remainingMilliseconds = timeDifference % (60 * 60 * 1000);
  const minutes = Math.floor(remainingMilliseconds / (60 * 1000));

  return { hours, minutes };
};

const getReleaseText = (hours: number, minutes: number) => {
  let text = "Release in ";
  text += hours > 0 ? `${hours}${hours === 1 ? "hr" : "hrs"}` : "";
  text += minutes > 0 ? `${minutes}${minutes === 1 ? "min" : "mins"}` : "";
  return text;
};

const ShiftRelease = ({ start }: Props) => {
  // TODO: remove hardcoded date in production
  const now = new Date("March 19 2023 13:01");
  const startDate = new Date(start);
  const difference = startDate.getTime() - now.getTime();
  const { hours, minutes } = getHoursMinutes(difference);

  // shows component only if the held shift is less than 24 hours response time
  if ((hours <= 0 && minutes <= 0) || hours >= 24) return null;
  const releaseText = getReleaseText(hours, minutes);

  return (
    <div className="flex flex-row items-center gap-2 rounded-md bg-orange-200 px-2 py-1 max-w-max">
      <FaClock color="orange" size="1rem" />
      <p className="text-xs">{releaseText}</p>
    </div>
  );
};

export default ShiftRelease;
