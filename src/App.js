import { createContext, memo, useCallback, useContext, useEffect, useState } from "react";

const WelcomePage = ({ onClickLogout }) => {
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

const LoginPage = ({ inputEmail, onChangeEmail, onClickLogin }) => {
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

const AppContext = createContext({
  isLogged: false,
  users: {},
  inputEmail: "",
  onClickLogin: () => { },
  onClickLogout: () => { },
  onChangeEmail: () => { },
});

const ContentProvider = ({ children }) => {
  const cachedEmail = utilityGetEmail();
  const cachedUsers = utilityGetUsers();

  const [isLogged, setIsLogged] = useState(!!cachedEmail);
  const [users, setUsers] = useState(cachedUsers || {});
  const [inputEmail, setInputEmail] = useState(cachedEmail || "");

  // NOTE : not sure if this could fix the ```
  //   Cannot destructure property 'inputEmail' of '(0 , react__WEBPACK_IMPORTED_MODULE_0__.useContext)(...)' as it is undefined.
  // TypeError: Cannot destructure property 'inputEmail' of '(0 , at http://localhost:3000/static/js/bundle.js:167:5
  // ```
  useEffect(() => {
    if (!!cachedEmail) { setInputEmail(cachedEmail) }
  }, [cachedEmail]);

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

  return (
    <AppContext.Provider
      value={{
        isLogged,
        users,
        inputEmail,
        onClickLogin,
        onClickLogout,
        onChangeEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}


const App = memo(() => {
  const { inputEmail, setInputEmail, cachedUsers, isLogged, setIsLogged, users, setUsers, } = useContext(AppContext);

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
      <ContentProvider>
        {page === "welcome" ? (
          <WelcomePage users={users} onClickLogout={onClickLogout} />
        ) : (
          <LoginPage onChangeEmail={onChangeEmail} onClickLogin={onClickLogin} />
        )}
      </ContentProvider>
    </section>
  );
});

export default App;
