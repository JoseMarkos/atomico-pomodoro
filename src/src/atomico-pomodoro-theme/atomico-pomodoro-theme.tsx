import { createContext} from 'atomico';

export const SettingsContext = createContext({
    breakTime: 1,
    sessionTime: 2,
    updateBreakTime: (time: number) => {
    },
    updateSessionTime: (time: number) => {
    }
});

export const Theme = createContext({
    gray: "#555",
    gray75: "#3b3b4f",
    gray90: "#222",
    btnGap: "1px"
});

customElements.define( "atomico-settings-context", SettingsContext );
customElements.define( "atomico-pomodoro-theme", Theme );
