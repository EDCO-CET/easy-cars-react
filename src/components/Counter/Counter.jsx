
import { useState } from "react";
import './Counter.css';

function Counter() {
    
    const [count, setCount] = useState(0);
    
    return (
        <div className="counter">
            <h2>Counter</h2>
            <h3>{count}</h3>
            <button className="btn btn-primary" onClick={() => setCount(count + 1)}>Increment</button>
            <button className="btn btn-secondary" onClick={() => setCount(count - 1)}>Decrement</button>
            <button className="btn btn-danger" onClick={() => setCount(0)}>Reset</button>
            {count < 0 && <p>Count is less than 0</p>}
        </div>
    );
}

export default Counter;