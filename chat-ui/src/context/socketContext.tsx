import { ChatEventEnum } from "@/lib/constants";
import { getLocalStrogeItem } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState } from "react";
import socketio from "socket.io-client";
const getSocket = () => {
  const token = getLocalStrogeItem("token");
  return socketio(import.meta.env.VITE_SERVER_URI, {
    withCredentials: true,
    auth: { token },
  });
};

const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
}>({ socket: null });

const useSocket = () => useContext(SocketContext);
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null
  );
  // const [isConected, setIsConnected] = useState(false)
  // const onConect = ()=>{
  //   setIsConnected(isConected )
  // }
  useEffect(() => {
    setSocket(getSocket());
  }, []);
  // useEffect(()=>{
  //   if(!socket) return;
  //   socket.on(ChatEventEnum.CONNECTED_EVENT,onConect)
  // },[socket])
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
