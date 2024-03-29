import { createContext, useState } from 'atomico';

export const SettingsContext = createContext({
    breakTime: 5,
    sessionTime: 25,
    notificationsOn: false,
    updateBreakTime: (time: number) => {
    },
    updateSessionTime: (time: number) => {
    },
    updateNotifications: (on: boolean) => {
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