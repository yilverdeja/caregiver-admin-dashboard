import { FaClock } from "react-icons/fa6";
const LegendIndicator = () => {
  return (
    <div className="flex flex-row gap-4 my-4">
      <FaClock color="orange" size="1.5rem" />
      <p>indicates held shift with less than 24 hours response time</p>
    </div>
  );
};

export default LegendIndicator;
