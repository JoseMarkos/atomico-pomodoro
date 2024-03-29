import {c, css, Props, useState, useEffect, useContext} from 'atomico';
import { SettingsContext }
  from '../atomico-pomodoro-theme/atomico-pomodoro-theme';
import {alert, requestPermission} from '../helpers/alert';

enum TimerStatus {
  off,
  on,
  pause
}

enum Mode {
  session = 'Session',
  break = 'Break'
}

function pomodoro({ beep } : Props<typeof pomodoro>) {
  // Start Atomicity
  const [label, setLabel] = useState('Session');
  const [mode, setMode] = useState(Mode.session);
  const {sessionTime, breakTime, notificationsOn } = useContext(SettingsContext);
  const [timeLeft, setTimeLeft] = useState(sessionTime);
  const [timerActive, setTimerActive] = useState(TimerStatus.off);
  const [breakT, setBreakT] = useState(
    localStorage.getItem('breakTime') 
      ? parseInt(localStorage.getItem('breakTime')) 
      : breakTime * 60
  );
  const [sessionT, setSessionT] = useState(
    localStorage.getItem('sessionTime') 
      ? parseInt(localStorage.getItem('sessionTime')) 
      : sessionTime * 60
  );
  const [notifications, setNotifications] = useState(
    localStorage.getItem('notifications')
      ? 'true' === localStorage.getItem('notifications')
      : notificationsOn
  );
  // End Atomicity
  
  const updateBreakTime = (time: number) => {
    setBreakT(time * 60);
    localStorage.setItem('breakTime', (time * 60).toString());
  };
  const updateSessionTime = (time: number) => {
    setSessionT(time * 60);
    localStorage.setItem('sessionTime', (time * 60).toString());
  };
  const updateNotifications = (on: boolean) => {
    setNotifications(on);
    localStorage.setItem('notifications', on.toString());
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

  const toggleMode = () => {
    if (Mode.session === mode)
      setMode(Mode.break);
    else
      setMode(Mode.session);
  };

  const togglePauseTimerActive = () => {
    pauseBeep();
    if (TimerStatus.on === timerActive)
      pauseTimer();
    else
      startTimer();
  };

  const showAlert = () => {
    if (Mode.session === mode)
      alert('Tómate un descanso merecido. Recarga para la próxima sesión.');
    else
      alert('¡Vamos allá! Empieza tu sesión productiva.');
  };

  useEffect(() => {
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
            toggleMode();
            if (notifications) {
              showAlert();
            }

            return 0;
          }
        });
      }, 1000);
    } 
    if (TimerStatus.off === timerActive) {
      if (Mode.session === mode)
        setTimeLeft(sessionT);
      else
        setTimeLeft(breakT);
    }
    if (TimerStatus.pause === timerActive) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [timerActive]);

  useEffect(
    () => {
      if (TimerStatus.off === timerActive) {
        if (Mode.session === mode)
          setTimeLeft(sessionT);
        else
          setTimeLeft(breakT);
      }
    } ,[sessionT, breakT]);

  useEffect(
    () => {
      setLabel(mode);
    }, [mode]);

  const startTimer = () => {
    setTimerActive(TimerStatus.on);
  };

  const stopTimer = () => {
    setTimerActive(TimerStatus.off);
  };
  
  const pauseTimer = () => {
    setTimerActive(TimerStatus.pause);
  };
  
  return (
    <host shadowDom>
        <atomico-settings-context value={{
          updateBreakTime: updateBreakTime,
          updateSessionTime: updateSessionTime,
          updateNotifications: updateNotifications,
          sessionTime: sessionTime,
          breakTime: breakTime,
          timeLeft: timeLeft,
          notificationsOn: notificationsOn
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
                      onclick={
                        togglePauseTimerActive
                      }>
                      {TimerStatus.on === timerActive
                          ? <slot name="icon-pause"></slot>
                          : <slot name="icon-play"></slot>
                      }
                    </button>
                    <button
                      class="btn btn--control"
                      type="button"
                      id="reset"
                      onclick={() => {
                        pauseBeep();  
                        stopTimer();
                        if (Mode.session === mode)
                          setTimeLeft(sessionT);
                        else
                          setTimeLeft(breakT);
                      }}>
                      <slot name="icon-rotate"></slot>
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