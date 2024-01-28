import { memo, useCallback, useEffect, useState } from "react";

const App = memo(() => {
  // // Version 1.0
  // const cachedEmail = !!localStorage.getItem("email")
  //   ? localStorage.getItem("email")
  //   : "";
  // const cachedUsers = !!localStorage.getItem("users")
  //   ? JSON.parse(localStorage.getItem("users"))
  //   : {};
  // const [isLogged, setIsLogged] = useState(!!cachedEmail);
  // const [inputEmail, setInputEmail] = useState(cachedEmail);
  // const [users, setUsers] = useState(cachedUsers);

  // Version 2.0
  const [isLogged, setIsLogged] = useState(false);

  const [inputEmail, setInputEmail] = useState("");
  const [users, setUsers] = useState({});

  // state of the page, what it shows
  const [page, setPage] = useState(<></>);

  useEffect(
    // on loading / mount, fetching data
    () => {
      console.log("didMount");

      // Version 2.0
      const cachedEmail = localStorage.getItem("email") || "";
      const cachedUsers = JSON.parse(localStorage.getItem("users")) || {};

      setIsLogged(!!cachedEmail);

      setInputEmail(cachedEmail);
      setUsers(cachedUsers);
    },
    []  // NOTE : empty Dependency Array: just once, on Mount
  )


  useEffect(
    // when isLogged change
    () => {
      console.log("didUpdate");

      const welcomePage = <>
        {!!users[inputEmail] && users[inputEmail].counter > 1 ? (
          <>
            <div>Bentornat* {inputEmail}</div>
            <div>Ultimo accesso {(new Date(users[inputEmail].lastAccess)).toLocaleString()}</div>
          </>
        ) : (
          <div>Benvenut* {inputEmail}</div>
        )}
        <button onClick={onClickLogout}>Logout</button>
      </>;

      const loginPage = <>
        <input
          placeholder="Inserisci email"
          value={inputEmail}
          onChange={onChangeEmail}
        />
        <button onClick={onClickLogin} disabled={!inputEmail}>
          Login
        </button>
      </>;

      setPage(isLogged ? welcomePage : loginPage);
    },
    [isLogged, users, inputEmail]  // NOTE : Dependency Array full: at any change of these states/props
  );

  function onMap(user) {
    if (user.email === inputEmail) {
      return {
        email: user.email,
        counter: user.counter + 1,
        lastAccess: new Date().toISOString(),
      };
    } else return user;
  }

  const onClickLogin = useCallback(
    () => {
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
    },
    [inputEmail, users]
  );

  const onClickLogout = useCallback(
    () => {
      setInputEmail("");
      setIsLogged(false);
      localStorage.removeItem("email");
    },
    []
  );

  const onChangeEmail = useCallback(
    (event) => setInputEmail(event.target.value),
    []
  );

  return (
    <section>
      {page}
    </section>
  );
});


export default App;
