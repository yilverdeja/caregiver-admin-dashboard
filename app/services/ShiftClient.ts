import axios, { AxiosRequestConfig } from "axios";
import { Shift, ShiftStatus } from "../models/shifts";

interface ShiftUpdateMultipleResponse {
  updatedShifts: Shift[];
  error?: {
    message: string;
    notFoundIds: number[];
    skippedIds: number[];
  };
}

const axiosInstance = axios.create({
  baseURL: "/api",
});

class APIClient {
  endpoint: string = "/shifts";

  getAllShifts = (config: AxiosRequestConfig) => {
    return axiosInstance
      .get<Shift[]>(this.endpoint, config)
      .then((res) => res.data);
  };

  getShift = (id: number) => {
    return axiosInstance
      .get<Shift>(this.endpoint + "/" + id)
      .then((res) => res.data);
  };

  updateShiftStatus = (id: number, status: ShiftStatus) => {
    return axiosInstance
      .patch<Shift>(this.endpoint + "/" + id, { status })
      .then((res) => res.data);
  };

  confirmShifts = (ids: number[]) => {
    return axiosInstance
      .patch<ShiftUpdateMultipleResponse>(this.endpoint, {
        ids,
        status: "CONFIRMED",
      })
      .then((res) => res.data);
  };
}

export default APIClient;
