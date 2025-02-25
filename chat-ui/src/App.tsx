import React, { useEffect, Suspense } from "react";
import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Register = React.lazy(() => import("./pages/Register"));
import { useAuth } from "./store/AuthContext";

import { Toaster } from "./components/ui/toaster";
import { SocketProvider } from "./context/socketContext";
import OauthWelcome from "./pages/OauthWelcome";
// const socket = io("http://localhost:3002");
function App() {
  // useEffect(() => {
  //   SocketInstance.on("connection", () => {
  //     console.log("connected");
  //   });
  // }, []);

  // useEffect(() => {
  //   // Listen for messages from the server
  //   SocketInstance.on("connection", () => {
  //     console.log("connected");
  //   });
  //   SocketInstance.on("message", (message: string) => {
  //     // setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   // Clean up on component unmount
  //   return () => {
  //     SocketInstance.off("message");
  //   };
  // }, []);
  // const sendMessage = (message: string) => {
  //   SocketInstance.emit("message", { message, recieverId: 1, senderId: 2 });
  // };
  return (
    // <div className="">
    //   <div>hello word</div>
    //   <button
    //     className="btn bg-green-400 py-1 px-3 text-white rounded"
    //     onClick={() => {
    //       sendMessage("hello first Message");
    //     }}
    //   >
    //     send
    //   </button>
    //   {messages.map((message, index) => (
    //     <p key={index}>{message}</p>
    //   ))}
    // </div>
    <>
      <Suspense fallback={<div>loading</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<OauthWelcome />} />
          <Route path="/*" element={<ConditionalRedirect />} />
          <Route
            path="/chat"
            element={
              <SocketProvider>
                <Chat />
              </SocketProvider>
            }
          />
          {/* <Route element={<ProtectedRoute></ProtectedRoute>}>
        <Route path="/chat" element={<Chat />} />
      </Route> */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// })
//  => {
// const ProtectedRoute = () => {
//   const user = useAuth((state) => state.user);
//   if (user) {
//     return <Navigate to="/chat" />;
//   } else {
//     return <Navigate to="/login" />;
//   }
// };
const ConditionalRedirect = () => {
  const user = useAuth((state) => state.user);
  return user ? <Navigate to="/chat" /> : <Navigate to="/login" />;
};
export default App;
