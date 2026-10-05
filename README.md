# Postfix Expression Puzzle – Stack

A full-stack DSA project. The app shows a random **postfix expression** (for example `3 4 + 2 *`). You solve it, then watch a **stack** evaluate it one token at a time.

**Live demo:** _add your deployed link here_

## How the stack evaluates postfix

1. Read the tokens from left to right.
2. If the token is a number, **push** it.
3. If the token is an operator, **pop** two numbers (the first pop is the right-hand side), calculate, and **push** the result.
4. At the end, exactly one number is left on the stack. That is the answer.

Example: `5 1 2 + 4 * + 3 -` gives `14`.

| Operation | Cost |
|---|---|
| push / pop / peek | O(1) |
| Evaluate an expression with n tokens | O(n) |

A stack fits because the most recent numbers are always the ones an operator needs next (last in, first out).

## Files

```
postfix.js    Stack class, evaluator, puzzle generator (used by server and browser)
index.html    Frontend: puzzle, answer check, stack visualiser
server.js     Express API
package.json
```

## Run locally

```bash
npm install
npm start      # http://localhost:3000
```

## API (all POST, JSON body)

| Route | Body | Returns |
|---|---|---|
| `/api/puzzle` | `{ level: 1-3 }` | `{ expr }` |
| `/api/evaluate` | `{ expr }` | `{ result, steps }` (stack after each token) |
| `/api/check` | `{ expr, answer }` | `{ correct, result, steps }` |

## Deploy

Push to a public GitHub repo, then create a **Web Service** on Render with build command `npm install` and start command `npm start`. Without a backend the page falls back to "Demo mode" and runs the same code in the browser.
