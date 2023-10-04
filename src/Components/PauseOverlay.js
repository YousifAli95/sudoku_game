import { useSudokuContext } from "../SudokuContext";
import "./CSS/pauseOverlay.css";

export default function PauseOverlay({ timerPauseHandler }) {
  const { timer, HIDE_CLASS } = useSudokuContext();
  return (
    <div
      onClick={timerPauseHandler}
      id="pause-overlay"
      className={`pause-overlay ${timer.isPaused ? "" : HIDE_CLASS}`}
    >
      <div id="pause-svg-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon-play-big"
          viewBox="0 0 60 60"
        >
          <g fill="none" fillRule="evenodd">
            <circle cx="30" cy="30" r="30" fill="#0072E3"></circle>
            <path
              fill="#FFF"
              d="M39.12 31.98l-12.56 8.64a2.4 2.4 0 01-3.76-1.98V21.36a2.4 2.4 0 013.76-1.97l12.56 8.63a2.4 2.4 0 010 3.96z"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );
}
