import { c, css, useContext, useState } from 'atomico'; // Asegúrate de importar las funciones necesarias de 'atomico'
import { settingsContext } from '../atomico-pomodoro/atomico-pomodoro';

const settingsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const {
    updateBreakTime, 
    updateSessionTime, 
    sessionTime, 
    breakTime,
    timeLeft
  } = useContext(settingsContext);
  const [sessionTimeLocal, setSessionTimeLocal] = useState(sessionTime);
  const [breakTimeLocal, setBreakTimeLocal] = useState(breakTime);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <host shadowDom>
      <button onclick={togglePopup}>Abrir configuración</button>
      <dialog open={showPopup} onclose={closePopup} class="">
        <h2>Configuración</h2>
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
        {/* Aquí puedes agregar las opciones de configuración */}
        <button onclick={closePopup}>Cerrar</button>
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
    z-index: 2000;
  }

  dialog > * {
    margin-bottom: 1rem;
  }

  dialog > *:last-child {
    margin-bottom: 0;
  }

  button {
    background-color: tomato;
    color: #eee;
    padding: 10px;
    border: 0  none;
  }

  .flex {
    display: flex;
    gap: 0.5rem;
  }
`;

export const SettingsPopup = c(settingsPopup);

customElements.define("atomico-settings-popup", SettingsPopup);
