import { BrowserRouter, Route, Routes } from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./style.css";

import Home from "./pages/Home";
import axios from "axios";
import ProductList from "./pages/Products/ProductList";
import Layout from "./components/Layout";
import LayoutProduct from "./components/LayoutProduct";
import LoginPage from "./pages/LoginPage";
import PositionDemo from "./components/SideBarsLayout";
import HeadlessDemo from "./components/Iconreference";
import TemplateDemo from "./components/MenuBar";
import RegisterPage from "./pages/RegisterPage";
import MenuBar from "./components/MenuBar";
import MainPage from "./pages/Home/MainPage.tsx";
import UserContextProvider from "./store/UserContext";
axios.defaults.baseURL = "https://localhost:7212/api/";
function App() {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/home" element={<MenuBar />}>
              <Route index element={<MainPage />} />

              <Route path="products" element={<LayoutProduct />}>
                <Route index element={<ProductList />} />
                <Route path="details/:id" />
              </Route>
            </Route>
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
