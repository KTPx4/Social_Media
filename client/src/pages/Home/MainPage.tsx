import {useContext, useEffect} from "react";
import "primeflex/primeflex.css";

import {Helmet, HelmetProvider} from "react-helmet-async";
import InfoContent from "./InfoContent.tsx";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import PostContent from "./PostContent.tsx";

const MainPage = () => {

    // @ts-ignore
    const {userId, setId , myAccount} = useStore()
    useEffect(() => {
        console.log(myAccount)

    }, []);
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const  backgroundColor = currentTheme.getBackground();
    const borderColor = currentTheme.getBorder()
  return (
      <HelmetProvider>
          <Helmet>
              <link rel="stylesheet" href="/css/post.css"/>
              <title>Internal</title>
          </Helmet>
          <div className="container" style={{backgroundColor: backgroundColor, height: "100vh"}}>
          {/* Phần bên trái chiếm 80% */}
              <div className="left-content flex-column justify-content-start align-items-center" style={{
                  borderRight: `1px solid ${borderColor}`
              }}>
                  <PostContent />

              </div>

              {/*/!* Phần bên phải chiếm 20% *!/*/}
              <div className="right-content">
                  <InfoContent User={null}/>
              </div>
          </div>
      </HelmetProvider>
  );
};

export default MainPage;
