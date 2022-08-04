import { Link } from "react-router-dom";
const s = require("./LandingPage.module.css");

export default function LandingPage() {
  return (
    <div className={s.mainContainer}>
      <div>
        <Link to="/home">
          <button className={s.startButton}>WELCOME</button>
        </Link>
      </div>
      <div className={s.cornerContainer}>
        <h4 className={s.developedText}>Developed by Valentín Avalos.</h4>
      </div>
    </div>
  );
}
