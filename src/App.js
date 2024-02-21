import { memo, useCallback, useEffect, useState } from "react";

const WelcomePage = () => {
  const users = utilityGetUsers();
  const email = utilityGetEmail();

  return (
    <>
      {users[email].counter > 1 ? (
        <>
          <div>Bentornat* {email}</div>
          <div>
            Ultimo accesso {new Date(users[email].lastAccess).toLocaleString()}
          </div>
        </>
      ) : (
        <div>Benvenut* {email}</div>
      )}
      <button onClick={onClickLogout}>Logout</button>
    </>
  );
};

const LoginPage = () => {
  return (
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
  );
};

const utilityGetUsers = () => {
  const cachedUsers = JSON.parse(localStorage.getItem("users")) || {};
  return cachedUsers;
};

const utilityGetEmail = () => localStorage.getItem("email") || "";

const App = memo(() => {
  const cachedEmail = utilityGetEmail();
  const cachedUsers = utilityGetUsers();

  const [isLogged, setIsLogged] = useState(!!cachedEmail);
  const [users, setUsers] = useState(cachedUsers || {});
  const [page, setPage] = useState("login");

  const onClickLogin = useCallback(() => {
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
  }, [inputEmail, users]);

  const onClickLogout = useCallback(() => {
    setInputEmail("");
    setIsLogged(false);
    localStorage.removeItem("email");
  }, []);

  const onChangeEmail = useCallback(
    (event) => setInputEmail(event.target.value),
    []
  );

  useEffect(() => {
    setPage(isLogged ? "welcome" : "login");
  }, [isLogged]);

  return (
    <section>
      {page === "welcome" ? (
        <WelcomePage users={users} onClickLogout={onClickLogout} />
      ) : (
        <LoginPage onChangeEmail={onChangeEmail} onClickLogin={onClickLogin} />
      )}
    </section>
  );
});

export default App;
