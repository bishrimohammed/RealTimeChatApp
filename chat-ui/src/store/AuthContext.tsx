import { removeLocalStrogeItem } from "@/lib/utils";
import { create } from "zustand";
import { useChat } from "./ChatStore";

type userInterface = {
  id: number;
  name: string;
  email: string;
  avatar: { id: number; url: string } | null;
};
type authState = {
  user: userInterface | null;
  token: string | null;
  login: (data: { user: userInterface | null; token: string | null }) => void;
  // register: (data: { email: string, username: string, password: string }) => void,
  logout: () => void;
};

export const useAuth = create<authState>()((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: null,
  login: async (data) => {
    set(() => ({
      user: data.user,
      token: data.token,
    }));
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.token) {
      localStorage.setItem("token", JSON.stringify(data.token));
    }
  },

  logout: () => {
    console.log("\n\njehsgfuhrgy\n\n");

    set(() => ({
      user: null,
      token: null,
    }));

    localStorage.removeItem("user");

    localStorage.removeItem("token");
    removeLocalStrogeItem("currentChat");
    // useChat().setCurrentChat(null);
  },
}));

// const initialState: auth = {
//     user: null,
//     token: null,
//     login: async() => {},
//     register: async() => {},
//     logout: async() => {},
// }
// const AuthContext = createContext(initialState)
// const useAuth = useContext(AuthContext)

// const AuthProvider: React.FC<{children: React.ReactNode}> =({children}) =>{

// }
