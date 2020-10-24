import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import LoadingSpinner from "./shared components/util/LoadingSpinner";
//import NewPlace from "./places/pages/newPlace";
//import UserPlaces from "./places/pages/UserPlaces";
//import UpdatePlace from "./places/pages/updatePlace";
//import Authenticate from "./users/pages/authenticate";

import MainHeader from "./shared components/mainNavigation";
import Users from "./users/pages/user";
import { AuthContext } from "./shared components/context/auth-context";
import { useAuth } from "./shared components/hooks/auth-hook";

const Authenticate = React.lazy(() => import("./users/pages/authenticate"));
const NewPlace = React.lazy(() => import("./places/pages/newPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/updatePlace"));

function App() {
  const { token, userId, login, logout } = useAuth();
  const route = token ? (
    <Switch>
      <Route exact path="/">
        <Users />
      </Route>
      <Route path="/addNewPlace" exact>
        <NewPlace />
      </Route>
      <Route path="/:id/places" exact>
        <UserPlaces />
      </Route>

      <Route path="/places/:placeId" exact>
        <UpdatePlace />
      </Route>
      <Redirect to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route exact path="/">
        <Users />
      </Route>
      <Route path="/:id/places" exact>
        <UserPlaces />
      </Route>

      <Route path="/authenticate" exact>
        <Authenticate />
      </Route>
      <Redirect to="/authenticate" />
    </Switch>
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainHeader />
        <Suspense fallback={<LoadingSpinner />}> {route}</Suspense>
      </Router>
    </AuthContext.Provider>
  );
}
export default App;
