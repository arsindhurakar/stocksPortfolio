import "./App.scss";
import "antd/dist/antd.css";
import Router from "./router/Router";
import ProtectedRoute from "./router/ProtectedRoute";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { Dashboard, PortfolioMain } from "./pages";

function App() {
  const pageRoutes = () => {
    return (
      <div className="app">
        <Router />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/dashboard" component={withRouter(Dashboard)} />
        <ProtectedRoute
          path="/portfolio"
          component={withRouter(PortfolioMain)}
        />
        <Route component={withRouter(pageRoutes)} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
