import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/products");
    }
  };

  return (
    <button className="back-btn" onClick={handleBack}>
      ← Back
    </button>
  );
}

export default BackButton;
