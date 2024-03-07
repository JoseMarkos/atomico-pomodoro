import {c, css, Props, useState, useEffect, createContext, useContext} from 'atomico';

// Settings
export const settingsContext = createContext({
    breakTime: 1,
    sessionTime: 2,
    timeLeft: 1,
    updateBreakTime: (time: number) => {
    },
    updateSessionTime: (time: number) => {
    }
});

customElements.define( "atomico-settings-context", settingsContext  );

function pomodoro({ beep } : Props<typeof pomodoro>) {
  // Start Atomicity
  const [label, setLabel] = useState('Session');
  const {sessionTime, breakTime} = useContext(settingsContext);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60); // Tiempo en segundos
  console.log(timeLeft);
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

            return 0;
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
  :root {
    --gray: #555;
    --gray-75: #3b3b4f;
    --gray-90: #222;
    --btn-gap: 1px;
  }

  :host {
    box-sizing: border-box;
    color: white;
    padding: 2rem 1rem;
    min-height: 100vh;
    line-height: 1.1;
    display:flex;
    justify-content: center;
    align-items: center;
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

  .relative {
    position: relative;
    min-height: 271px;
    width: 300px;
  }

  .number {
    font-weight: 200;
    letter-spacing: 3px;
  }

  h3 {
    margin: 0;
  }

  .timer {
    background: linear-gradient(to right, red, purple);
    padding: 3px;
    border-radius: 50%;
  }

  .timer__body {
    background-color: var(--gray-90);
    height: 203px;
    width: 203px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

function pomodoroCounter({ id, title, decrement, number, increment }: Props<typeof pomodoroCounter>) {
  return (
    <host shadowDom>
        <div class="counter" id={id}>
            <h5 id={`${id}-label`}>{title}</h5>
            <section class="flex">
                <button
                    class="btn"
                    type="button"
                    id={`${id}-decrement`}
                    onclick={decrement}
                >
                -
                </button>
                <span id={`${id}-length`} class="number">{number}</span>
                <button 
                    class="btn"
                    type="button" 
                    id={`${id}-increment`}
                    onclick={increment}
                >
                +
                </button>
            </section>
        </div>
    </host>
  )
};

pomodoroCounter.props = {
  number: Number,
  id: String,
  title: String,
  increment: Function,
  decrement: Function
}

pomodoroCounter .styles = css`
:root {
  --gray: #555;
  --gray-75: #3b3b4f;
  --gray-90: #222;
  --btn-gap: 1px;
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

.relative {
  position: relative;
  min-height: 271px;
  width: 300px;
}

.number {
  font-weight: 200;
  letter-spacing: 3px;
}

h3 {
  margin: 0;
}

.timer {
  background: linear-gradient(to right, red, purple);
  padding: 3px;
  border-radius: 50%;
}

.timer__body {
  background-color: var(--gray-90);
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
`;
  
export const PomodoroCounter = c(pomodoroCounter);
export const Pomodoro = c(pomodoro);
customElements.define("atomico-pomodoro", Pomodoro);
customElements.define("atomico-pomodoro-counter", PomodoroCounter);