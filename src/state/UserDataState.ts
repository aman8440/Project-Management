import { atom } from "recoil";
import { AuthContextTypeData } from "../interfaces";

export const userState = atom<AuthContextTypeData>({
  key: "userState",
  default: {
    fname: "",
    lname: "",
    phone: "",
    email: "",
    gender: "",
  },
});