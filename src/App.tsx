import { Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import AddDevicePage from "./pages/AddDevice";
import LoginPage from "./pages/Login";
import SearchPage from "./pages/Search";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { UserProvider } from "./context/UserContext";

setupIonicReact();

export const apiUrl = "http://localhost:3000";

const tabs = [
  {
    label: "Add",
    slug: "addDevice",
    icon: triangle,
    element: <AddDevicePage />,
  },
  {
    label: "Login",
    slug: "login",
    icon: ellipse,
    element: <LoginPage />,
  },
  {
    label: "Search",
    slug: "search",
    icon: square,
    element: <SearchPage />,
  },
];

export default function App() {
  return (
    <UserProvider>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              {tabs.map((tab) => (
                <Route key={tab.slug} path={`/${tab.slug}`}>
                  {tab.element}
                </Route>
              ))}
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              {tabs.map((tab) => (
                <IonTabButton
                  key={tab.slug}
                  tab={tab.slug}
                  href={`/${tab.slug}`}
                >
                  <IonIcon icon={tab.icon} />
                  <IonLabel>{tab.label}</IonLabel>
                </IonTabButton>
              ))}
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </UserProvider>
  );
}
