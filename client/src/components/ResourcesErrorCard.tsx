import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
interface ResourcesErrorCardProps {
  backgroundColor: string;
  keyTheme: string;
  textColor: string;
  errorText: string;
}

const ResourcesErrorCard: React.FC<ResourcesErrorCardProps> = ({
  backgroundColor,
  keyTheme,
  textColor,
  errorText,
}) => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        textAlign: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <Card
        style={{
          maxWidth: "400px",
          padding: "1rem",
          backgroundColor: keyTheme === "theme_dark" ? "black" : "white",
        }}
      >
        <img
          src="/public/person.png"
          alt="Error Icon"
          style={{ width: "150px", marginBottom: "1rem" }}
        />
        <h3 style={{ color: textColor }}>{errorText}</h3>
        {/*<p style={{color: '#6c757d'}}>*/}
        {/*    The content you are trying to view is not accessible right now.*/}
        {/*</p>*/}
        <Button label="Go to Home" icon="pi pi-home" onClick={goToHome} />
      </Card>
    </div>
  );
};

export default ResourcesErrorCard;
