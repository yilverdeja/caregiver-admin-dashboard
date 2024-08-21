interface Props {
  name: string;
}

const ShiftDate = ({ name }: Props) => {
  return <div className="bg-gray-100 px-2">{name}</div>;
};

export default ShiftDate;
