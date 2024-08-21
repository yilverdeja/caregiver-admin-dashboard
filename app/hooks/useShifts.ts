import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/ShiftClient";

const apiClient = new APIClient();

const useShifts = () =>
  useQuery({
    queryKey: ["shifts"],
    queryFn: apiClient.getAllShifts,
  });

export default useShifts;
