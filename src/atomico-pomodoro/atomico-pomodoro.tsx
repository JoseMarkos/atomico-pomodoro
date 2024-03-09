import {c, css, Props, useState, useEffect, useContext} from 'atomico';
import { SettingsContext } 
from '../atomico-pomodoro-theme/atomico-pomodoro-theme';

enum TimerStatus {
  off,
  on,
  reset
}

function pomodoro({ beep } : Props<typeof pomodoro>) {
  // Start Atomicity
  const [label, setLabel] = useState('Break');
  const {sessionTime, breakTime} = useContext(SettingsContext);
  const [timeLeft, setTimeLeft] = useState(breakTime);
  const [timerActive, setTimerActive] = useState(TimerStatus.off);
  const [breakT, setBreakT] = useState(breakTime * 60);
  const [sessionT, setSessionT] = useState(sessionTime * 60);
  // End Atomicity
  
  const updateBreakTime = (time: number) => {
    setBreakT(time * 60);
  };

  const updateSessionTime = (time: number) => {
    setSessionT(time * 60);
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

  const pauseBeep = () => {
    beep.pause();
  };

  useEffect(() => {
    console.log('cambio timer active', timerActive);
    let intervalId: number;
    if (TimerStatus.on === timerActive) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(intervalId);
            playBeep();
            setTimerActive(TimerStatus.off);
            return 0;
          }
        });
      }, 1000);
      console.log('despues del interval')
    } 
    if (TimerStatus.off === timerActive) {
      console.log("sessionT al final", sessionT);
      console.log("breakT al final", breakT);
      if ('Session' === label) {
        setTimeLeft(breakT);
        setLabel('Break');
      } else {
        setTimeLeft(sessionT);
        setLabel('Session');
      }
    }

    return () => clearInterval(intervalId);
  }, [timerActive]);

  useEffect(
    () => {
      if (TimerStatus.off === timerActive) {
        if ('Session' === label) {
          setTimeLeft(sessionT);
        } else {
          setTimeLeft(breakT);
        }
        console.log('cambio breakT o sessionT', timerActive, TimerStatus.reset);
      }
    } ,[sessionT, breakT])

  const startTimer = () => {
    setTimerActive(TimerStatus.on);
  };

  const stopTimer = () => {
    setTimerActive(TimerStatus.off);
  };

  const resetTimer = () => {
    setTimerActive(TimerStatus.reset);
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
                          pauseBeep();
                        }
                      }>
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
                        pauseBeep();
                        stopTimer();
                        if ('Session' === label) {
                          setTimeLeft(sessionT);
                        } else {
                          setTimeLeft(breakT);
                        }
                      }}>
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
    padding: 4rem 1rem 0 1rem;
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
    height: 183px;
    width: 183px;
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
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .timer__body {
      height: 203px;
      width: 203px;
    }
  }
`;

pomodoro.props = {
  beep: {
    type: HTMLAudioElement,
    value: new Audio('./src/oversimplified-alarm-clock-113180.mp3')
  } 
}

export const Pomodoro = c(pomodoro);
customElements.define("atomico-pomodoro", Pomodoro);