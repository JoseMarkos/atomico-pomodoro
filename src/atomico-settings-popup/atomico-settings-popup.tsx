import { c, css, useContext, useEffect, useState } from 'atomico';
import { SettingsContext } from '../atomico-pomodoro-theme/atomico-pomodoro-theme';
import { requestPermission } from '../helpers/alert';

const settingsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const {
    updateBreakTime, 
    updateSessionTime,
    updateNotifications,
    sessionTime, 
    breakTime,
    notificationsOn
  } = useContext(SettingsContext);
  const [sessionTimeLocal, setSessionTimeLocal] = useState(
    localStorage.getItem('sessionTime') 
      ? parseInt(localStorage.getItem('sessionTime')) / 60
      : sessionTime
  );
  const [breakTimeLocal, setBreakTimeLocal] = useState(
    localStorage.getItem('breakTime') 
      ? parseInt(localStorage.getItem('breakTime')) / 60
      : breakTime
  );
  const [notifications, setNotifications] = useState(
    localStorage.getItem('notifications')
      ? 'true' === localStorage.getItem('notifications')
      : notificationsOn
  );
  useEffect(() => {
    if (notifications) {
      requestPermission();
    }
  }, [notifications]);

  const updateNotificationsLocal = (event) => {
    const on = event.target.value === 'true';
    setNotifications(on);
    updateNotifications(on)
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <host shadowDom>
      <button class="fixed" onclick={togglePopup}>Settings</button>
      <dialog open={showPopup} onclose={closePopup} class="">
        <h2>Settings</h2>
        <section class="flex">
            <atomico-pomodoro-counter 
              id="session"
              title="Session Length"
              increment={
                () => {
                  setSessionTimeLocal(sessionTimeLocal + 1)
                  updateSessionTime(sessionTimeLocal + 1);
                }
              }
              decrement={
                () => {
                  setSessionTimeLocal(sessionTimeLocal - 1)
                  updateSessionTime(sessionTimeLocal - 1);
                }
              }
              number={sessionTimeLocal}
            />
            <atomico-pomodoro-counter 
              id="break"
              title="Break Length"
              increment={
                () => {
                  setBreakTimeLocal(breakTimeLocal + 1)
                  updateBreakTime(breakTimeLocal + 1)
                }
              }
              decrement={
                () => {
                  setBreakTimeLocal(breakTimeLocal - 1)
                  updateBreakTime(breakTimeLocal - 1)
                }
              }
              number={breakTimeLocal}
            />
        </section>
        <section>
          <h3>Notifications</h3>
          <label>
            <input
              type="radio"
              value="true"
              name="notifications"
              checked={notifications === true}
              onchange={updateNotificationsLocal}
            />
            On
          </label>
          <label>
            <input
              type="radio"
              value="false"
              name="notifications"
              checked={notifications === false}
              onchange={updateNotificationsLocal}
            />
            Off
          </label>
        </section>
        <button class="btn--block" onclick={closePopup}>Cerrar</button>
      </dialog>
    </host>
  );
};

settingsPopup.styles = css`
  :host {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    background-color: var(--gray-90);
  }

  dialog {
    background-color: var(--gray-90);
    border: 2px solid tomato;
    box-shadow: 0 0 20px black;
    color: white;
    padding: 2rem;
    z-index: 2000;
  }

  dialog > * {
    margin-bottom: 2rem;
  }

  dialog > *:last-child {
    margin-bottom: 0;
  }

  button {
    background: linear-gradient(to right, red, purple);
    color: #ddd;
    padding: 14px;
    border: 0  none;
    text-shadow: black 1px 1px 2px;
    font-size: 1rem;
    font-family: sans;
    cursor: pointer;
    border-radius: 20px;
  }

  .flex {
    display: flex;
    gap: 0.5rem;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 2rem;
  }

  .btn--block {
    display: block;
    width: 100%;
  }

  .fixed {
    position: fixed;
    right: 1rem;
    top: 1rem;
    z-index: 2000;
  }

  @media (min-width: 768px) {
    .fixed {
      right: 2rem;
      top: 2rem;
    }
  }
`;

export const SettingsPopup = c(settingsPopup);
customElements.define("atomico-settings-popup", SettingsPopup);