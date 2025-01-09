import { useContext } from "react";
import { userContext } from "../../store/UserContext.tsx";
import "primeflex/primeflex.css";
import { Card } from 'primereact/card';
import PostCard from "../../components/post/PostCard.tsx";
import {Helmet, HelmetProvider} from "react-helmet-async";
import PostContent from "./PostContent.tsx";
import InfoContent from "./InfoContent.tsx";

const MainPage = () => {
  // @ts-ignore
    const { userId, setUserId } = useContext(userContext);
  return (
      <HelmetProvider>
          <Helmet>
              <link rel="stylesheet" href="/css/post.css"/>
              <title>Internal</title>
          </Helmet>
          <div className="container">
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
