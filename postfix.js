/* Stack + postfix evaluation. Works in Node (require) and in the browser. */
(function (root) {
  class Stack {
    constructor() { this.items = []; }
    push(x) { this.items.push(x); }
    pop() {
      if (!this.items.length) throw new Error('Stack underflow: an operator needs two numbers before it');
      return this.items.pop();
    }
    peek() { return this.items[this.items.length - 1]; }
    get size() { return this.items.length; }
    toArray() { return [...this.items]; }   // bottom -> top
  }

  const OPS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => { if (b === 0) throw new Error('Division by zero'); return a / b; }
  };
  const round = n => Math.round(n * 1e4) / 1e4;

  // Evaluates a postfix expression and records the stack after every token.
  function evaluate({ expr }) {
    const tokens = String(expr || '').trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) throw new Error('Enter an expression, e.g. 3 4 + 2 *');
    if (tokens.length > 30) throw new Error('Expression is too long (max 30 tokens)');
    const st = new Stack(), steps = [];
    for (const t of tokens) {
      if (Object.prototype.hasOwnProperty.call(OPS, t)) {
        const b = st.pop(), a = st.pop();            // b is the top of the stack
        const r = round(OPS[t](a, b));
        st.push(r);
        steps.push({ token: t, action: `pop ${b} and ${a}, calculate ${a} ${t} ${b} = ${r}, push ${r}`, stack: st.toArray() });
      } else if (/^\d+(\.\d+)?$/.test(t)) {
        st.push(Number(t));
        steps.push({ token: t, action: `number, so push ${t}`, stack: st.toArray() });
      } else throw new Error(`Unknown token "${t.slice(0, 10)}". Use numbers and + - * /`);
    }
    if (st.size !== 1) throw new Error('Invalid expression: numbers are left over, so an operator is missing');
    return { expr: tokens.join(' '), result: st.peek(), steps };
  }

  // Builds a random valid expression whose division always gives whole numbers.
  function build(d) {
    if (!d) { const n = 1 + Math.floor(Math.random() * 9); return { t: [String(n)], v: n }; }
    let a = build(d - 1), b = build(Math.floor(Math.random() * d));
    if (Math.random() < 0.5) [a, b] = [b, a];
    let op = '+-*/'[Math.floor(Math.random() * 4)];
    if (op === '-' && a.v < b.v) [a, b] = [b, a];
    if (op === '/' && (b.v === 0 || a.v % b.v !== 0)) op = '+';
    if (op === '*' && a.v * b.v > 200) op = '+';
    const v = { '+': a.v + b.v, '-': a.v - b.v, '*': a.v * b.v, '/': a.v / b.v }[op];
    return { t: [...a.t, ...b.t, op], v };
  }

  function puzzle({ level = 2 } = {}) {
    const d = Math.min(Math.max(Number(level) || 2, 1), 3);
    return { expr: build(d).t.join(' '), level: d };
  }

  function check({ expr, answer }) {
    const r = evaluate({ expr });
    const n = Number(answer);
    if (answer === '' || answer == null || Number.isNaN(n)) throw new Error('Type a number as your answer');
    return { ...r, correct: Math.abs(n - r.result) < 0.01 };
  }

  const api = { Stack, evaluate, puzzle, check };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Postfix = api;
})(this);
