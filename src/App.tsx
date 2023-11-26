import { Route, Redirect, useHistory } from "react-router-dom";
import "./app.scss";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonToast,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import { useUserCtx } from "./context/UserContext";
import AddDevicePage from "./pages/AddDevice";
import LoginPage from "./pages/Login";
import SearchPage from "./pages/Search";
import PrintReport from "./pages/PrintReport";

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

export const apiUrl = ``;

interface Page {
  label: string;
  slug: string;
  element: React.ReactNode;
  exact?: boolean;
  icon?: any;
}

const standardPages: Page[] = [
  {
    label: "Add",
    slug: "addDevice",
    icon: triangle,
    element: <AddDevicePage />,
  },
  {
    label: "Edit",
    slug: "editDevice/:itemID",
    icon: triangle,
    element: <AddDevicePage />,
  },
  {
    label: "Search",
    slug: "search",
    icon: square,
    element: <SearchPage />,
  },
  {
    label: "Login",
    slug: "login",
    icon: ellipse,
    element: <LoginPage />,
  },
  {
    label: "Logout",
    slug: "logout",
    icon: ellipse,
    element: <Logout />,
  },
];

const tabPages: Page[] = [
  {
    label: "Print Report",
    slug: "report",
    icon: square,
    element: <PrintReport />,
  },
];

export default function App() {
  console.log(
    "CloakRoom Client is licensed under the AGPL 3. Copyright (C) 2023 - Benjamin Rowe, Kiara Davison & Contributors"
  );
  return (
    <UserProvider>
      <IonApp>
        <IonReactRouter>
          <Tabs />
        </IonReactRouter>
      </IonApp>
    </UserProvider>
  );
}

function Tabs() {
  const { user } = useUserCtx();

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/">
            <Redirect to={"/search"} />
          </Route>
          {[...standardPages, ...tabPages].map((tab) => (
            <Route
              exact={tab?.exact ?? false}
              key={tab.slug}
              path={`/${tab.slug}`}
            >
              {tab.element}
            </Route>
          ))}
        </IonRouterOutlet>

        <IonTabBar
          slot="bottom"
          className={`${
            user?.level && user.level >= 2 ? "" : "ion-hide"
          } dont-print`}
        >
          {tabPages.map((tab) => (
            <IonTabButton key={tab.slug} tab={tab.slug} href={`/${tab.slug}`}>
              <IonIcon icon={tab.icon} />
              <IonLabel>{tab.label}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
    </>
  );
}

function Logout() {
  const { setUser } = useUserCtx();
  const [presentToast] = useIonToast();
  const history = useHistory();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    presentToast({
      message: "Logout Successful",
      color: "success",
      position: "top",
      duration: 3000,
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });

    history.push("/search");
  };

  handleLogout();
  return null;
}
