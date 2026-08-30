// src/pages/Home/HomeCTA.tsx
import { useNavigate } from "react-router-dom";

interface Props {
  isProfileFilled: boolean;
}

function HomeCTA({ isProfileFilled }: Props) {
  const navigate = useNavigate();

  return (
    <section className="home-cta">
      {!isProfileFilled ? (
        <>
          <p>
            To improve accuracy, complete your health profile.
          </p>
          <button onClick={() => navigate("/form")}>
            Complete Profile
          </button>
        </>
      ) : (
        <>
          <p>
            Want to improve predictions?
            Share how you make health decisions.
          </p>
          <button onClick={() => navigate("/survey")}>
            Take 1-Minute Survey
          </button>
        </>
      )}
    </section>
  );
}

export default HomeCTA;
