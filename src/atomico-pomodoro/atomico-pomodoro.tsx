import {c, css, Props, useState, useEffect, useContext} from 'atomico';
import { SettingsContext } from '../atomico-pomodoro-theme/atomico-pomodoro-theme';

function pomodoro({ beep } : Props<typeof pomodoro>) {
  // Start Atomicity
  const [label, setLabel] = useState('Session');
  const {sessionTime, breakTime} = useContext(SettingsContext);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60); // Tiempo en segundos
  const [timerActive, setTimerActive] = useState(0);
  const [breakT, setBreakT] = useState(breakTime);
  const [sessionT, setSessionT] = useState(sessionTime);
  // End Atomicity
  
  const updateBreakTime = (time: number) => {
    setBreakT(time);
  };

  const updateSessionTime = (time: number) => {
    setSessionT(time);
  };
 
  const timeFormat = () => {
    let minutes: number = Math.floor(timeLeft / 60);
    let seconds: number = timeLeft - minutes * 60;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return minutesStr + ':' + secondsStr;
  };
  
  const playBeep = () => {
    beep.play();
  };

  const stopBeep = () => {
    beep.pause();
  };

  useEffect(() => {
    let intervalId: number;
    if (timerActive) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(intervalId);
            playBeep();
            if ('Session' === label) {
              setLabel('Break');

              return breakT * 60;
            } else {
              setLabel('Session');

              return sessionT * 60;
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timerActive]);

  useEffect(() => {
    if ('Session' === label) {
      setTimeLeft(sessionT * 60);
    } else {
      setTimeLeft(breakT * 60);
    }
  },[sessionT, breakT]);

  const startTimer = () => {
    setTimerActive(timerActive + 1);
  };

  const stopTimer = () => {
    setTimerActive(0);
  };
  
  return (
    <host shadowDom>
        <atomico-settings-context value={{
            updateBreakTime: updateBreakTime,
            updateSessionTime: updateSessionTime,
            sessionTime: sessionTime,
            breakTime: breakTime,
            timeLeft: timeLeft
        }}>
            <atomico-settings-popup></atomico-settings-popup>
            <div class="timer">
                <div class="timer__body">
                <h3 id="timer-label">{label}</h3>
                <h4 id="time-left" class="number">{timeFormat()}</h4>
                <section class="flex">
                    <button
                      class="btn btn--control"
                      type="button"
                      id="start_stop"
                      onclick={() => {
                          startTimer();
                          }
                      }
                    >
                      {0 > timeLeft 
                          ? <i class="fa fa-pause">Pause</i> 
                          : <i class="fa fa-play">Play</i>
                      }
                    </button>
                    <button
                      class="btn btn--control"
                      type="button"
                      id="reset"
                      onclick={() => {
                        stopBeep();
                        stopTimer();
                        setTimeLeft(sessionT * 60);
                      }}
                    >
                      <i class="fa fa-arrow-rotate-right">R</i>
                    </button>
                </section>
                </div>
            </div>
        </atomico-settings-context>
    </host>
  );
}

pomodoro.styles = css`
  :host {
    box-sizing: border-box;
    color: white;
    padding: 2rem 1rem;
    line-height: 1.1;
    display:flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
  }

  .btn {
    background-color: transparent;
    border: 3px solid #555;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    font-size: 1rem;
    min-height: 30px;
    min-width: 30px;
  }

  .btn:hover {
    border-color: tomato;
  }

  .btn--control {
    min-height: 50px;
    min-width: 50px;
  }

  h3 {
    margin: 0;
  }

  .number {
    font-weight: 200;
    letter-spacing: 3px;
  }

  .timer {
    background: linear-gradient(to right, red, purple);
    padding: 3px;
    border-radius: 50%;
  }

  .timer__body {
    background-color: #222;
    height: 203px;
    width: 203px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .flex {
    display: flex;
    gap: 0.5rem;
  }

  @media (min-width: 768px) {
     :host {
      min-height: 100vh;
    }
  }
`;

// const beepAudioElement = new Audio('https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav');
const beepAudioElement = new Audio('./src/oversimplified-alarm-clock-113180.mp3');

pomodoro.props = {
  beep: {
    type: HTMLAudioElement,
    value: beepAudioElement
  } 
}

export const Pomodoro = c(pomodoro);
customElements.define("atomico-pomodoro", Pomodoro);