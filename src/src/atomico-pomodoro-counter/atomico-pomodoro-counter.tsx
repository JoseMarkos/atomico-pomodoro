import {c, css, Props} from 'atomico';

function pomodoroCounter(
  { 
    id, 
    title, 
    decrement, 
    number, 
    increment 
  }: Props<typeof pomodoroCounter>) {
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

pomodoroCounter.styles = css`
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

  .number {
    font-weight: 200;
    letter-spacing: 3px;
  }

  .flex {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  h5 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

export const PomodoroCounter = c(pomodoroCounter);
customElements.define("atomico-pomodoro-counter", PomodoroCounter);