import { c, css, useState} from "atomico";

function counter() {
    const [count, setCount] = useState(0);
    return (
        <host shadowDom>
            <button onclick={() => setCount(count + 1)}>Ingrementar</button>
            <p>{count}</p>
            <button onclick={() => setCount(count - 1)}>Degrementar</button>
        </host>
    );
}

counter.styles = css`
    :host {
        display: flex;
        gap: 1rem;
    }
    button {
        padding: 15px;
    }
`;

export const Counter = c(counter);

customElements.define("atomico-counter", Counter);