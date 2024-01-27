import { useState } from "react";

export function App() {
  const cachedEmail = !!localStorage.getItem("email")
    ? localStorage.getItem("email")
    : "";
  const cachedUsers = !!localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : {};
  const [isLogged, setIsLogged] = useState(!!cachedEmail);
  const [inputEmail, setInputEmail] = useState(cachedEmail);
  const [users, setUsers] = useState(cachedUsers);

  function onMap(user) {
    if (user.email === inputEmail) {
      return {
        email: user.email,
        counter: user.counter + 1,
        lastAccess: new Date().toISOString(),
      };
    } else return user;
  }

  function onClickLogin() {
    setIsLogged(true);
    localStorage.setItem("email", inputEmail);
    if (!!users[inputEmail]) {
      const newUsers = {
        ...users,
        [inputEmail]: {
          counter: users[inputEmail].counter + 1,
          lastAccess: new Date().toISOString(),
        },
      };
      setUsers(newUsers);
      localStorage.setItem("users", JSON.stringify(newUsers));
    } else {
      const newUsers = {
        ...users,
        [inputEmail]: {
          counter: 1,
          lastAccess: new Date().toISOString(),
        },
      };

      setUsers(newUsers);
      localStorage.setItem("users", JSON.stringify(newUsers));
    }
  }

  function onClickLogout() {
    setInputEmail("");
    setIsLogged(false);
    localStorage.removeItem("email");
  }

  function onChangeEmail(event) {
    setInputEmail(event.target.value);
  }

  return (
    <section>
      {isLogged ? (
        <>
          {users[inputEmail].counter > 1 ? (
            <>
              <div>Bentornat* {inputEmail}</div>
              <div>Ultimo accesso {(new Date(users[inputEmail].lastAccess)).toLocaleString()}</div>
            </>
          ) : (
            <div>Benvenut* {inputEmail}</div>
          )}
          <button onClick={onClickLogout}>Logout</button>
        </>
      ) : (
        <>
          <input
            placeholder="Inserisci email"
            value={inputEmail}
            onChange={onChangeEmail}
          />
          <button onClick={onClickLogin} disabled={!inputEmail}>
            Login
          </button>
        </>
      )}
    </section>
  );
}


export default App;
