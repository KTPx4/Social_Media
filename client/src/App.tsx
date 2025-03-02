import { BrowserRouter, Route, Routes } from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./style.css";

import Home from "./pages/Home";
import axios from "axios";
import ProductList from "./pages/Products/ProductList";
import Layout from "./components/layoutPage/Layout.tsx";
import LayoutProduct from "./components/LayoutProduct";
import LoginPage from "./pages/LoginPage";
import PositionDemo from "./components/SideBarsLayout";
import HeadlessDemo from "./components/Iconreference";
import TemplateDemo from "./components/MenuBar";
import RegisterPage from "./pages/RegisterPage";
import MenuBar from "./components/MenuBar";
import MainPage from "./pages/Home/MainPage.tsx";
import UserContextProvider from "./store/UserContext";

import { ThemeProvider } from "./ThemeContext.tsx";
import NotFoundPage from "./pages/NotFoundPage";
import EmailConfirmPage from "./pages/EmailConfirmPage";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import PostDetail from "./pages/Post/PostDetail.tsx";
import UserRouter from "./routes/UserRouter.tsx";
import UserProfilePage from "./pages/Profile/UserProfilePage.tsx";
import NotificationPage from "./pages/Notification/NotificationPage.tsx";
import MessagePage from "./pages/Message/MessagePage.tsx";
import AdminRouter from "./routes/AdminRouter.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import LayoutAdmin from "./components/layoutPage/LayoutAdmin.tsx";
import ManageAccount from "./pages/Admin/ManageAccount.tsx";
import ManageReport from "./pages/Admin/ManageReport.tsx";
import DetailsReport from "./pages/Report/DetailsReport.tsx";
import SearchPage from "./pages/Search/SearchPage.tsx";

axios.defaults.baseURL = "https://localhost:7212/api/";
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route
              path="/home"
              element={
                <UserRouter>
                  <Layout />
                </UserRouter>
              }
            >
              <Route
                path="profile/:userProfileString"
                element={<UserProfilePage />}
              ></Route>
              <Route index element={<MainPage />} />
              <Route path="profile" element={<ProfilePage />}></Route>
            </Route>

              {/*post by id*/}
            <Route
              path="/post/:id"
              element={
                <UserRouter>
                  <Layout />
                </UserRouter>
              }
            >
              <Route index element={<PostDetail />} />
            </Route>

              {/*report*/}
              <Route
                  path="/report/:id"
                  element={
                      <UserRouter>
                          <Layout />
                      </UserRouter>
                  }
              >
                  <Route index element={<DetailsReport />} />
              </Route>

              {/*notification*/}
            <Route
                path="/notifications"
                element={
                  <UserRouter>
                    <Layout />
                  </UserRouter>
                }
            >
              <Route index element={<NotificationPage />} />
            </Route>

              {/*message*/}
              <Route
                  path="/message"
                  element={
                      <UserRouter>
                          <Layout />
                      </UserRouter>
                  }
              >
                  <Route index element={<MessagePage />} />
              </Route>

              {/*Search*/}
              <Route
                  path="/search"
                  element={
                      <UserRouter>
                          <Layout />
                      </UserRouter>
                  }
              >
                  <Route index element={<SearchPage />} />
              </Route>

              {/*Admin page*/}
              <Route
                  path="/admin"
                  element={
                      <AdminRouter>
                          <LayoutAdmin />
                      </AdminRouter>
                  }
              >
                  <Route index element={<AdminPage />} />
                  <Route path={"account"} element={<ManageAccount />} />
                  <Route path={"report"} element={<ManageReport />} />
              </Route>

            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
