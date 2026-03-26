import { createContext } from "react";
import { Products } from "../types";

export const CartContext = createContext<Array<Products>>([])