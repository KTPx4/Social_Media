import { useContext } from "react";
import { userContext } from "../../store/UserContext.tsx";
import "primeflex/primeflex.css";

import {Helmet, HelmetProvider} from "react-helmet-async";
import PostContent from "./PostContent.tsx";
import InfoContent from "./InfoContent.tsx";
import {ThemeContext} from "../../ThemeContext.tsx";

const MainPage = () => {
  // @ts-ignore
    const { userId, setUserId } = useContext(userContext);

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const  backgroundColor = currentTheme.getBackground();

  return (
      <HelmetProvider>
          <Helmet>
              <link rel="stylesheet" href="/css/post.css"/>
              <title>Internal</title>
          </Helmet>
          <div className="container" style={{backgroundColor: backgroundColor, height: "100vh"}}>
          {/* Phần bên trái chiếm 80% */}
              <div className="left-content flex-column justify-content-start align-items-center">
                  <PostContent />
              </div>

              {/* Phần bên phải chiếm 20% */}
              <div className="right-content">
                  <InfoContent />
              </div>
          </div>
      </HelmetProvider>
  );
};

export default MainPage;
