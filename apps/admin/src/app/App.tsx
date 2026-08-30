import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { router } from "./router";
import { UserProvider } from "../context/UserContext";
import ThemeBodyClass from "../components/ThemeBodyClass";
import "../main.css";

export default function App() {
  return (
    <Provider store={store}>
      <UserProvider>
        <ThemeBodyClass />
        <RouterProvider router={router} />
      </UserProvider>
    </Provider>
  );
}
