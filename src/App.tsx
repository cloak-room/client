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

export const apiUrl = "http://localhost:3000";

interface Page {
  label: string;
  slug: string;
  element: React.ReactNode;
  exact?: boolean;
  icon?: any;
}

const tabs: Page[] = [
  {
    label: "Add",
    slug: "addDevice",
    icon: triangle,
    element: <AddDevicePage />,
  },
  {
    label: "Search",
    slug: "search",
    icon: square,
    element: <SearchPage />,
  },
];

const hiddenPages: Page[] = [
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
  {
    label: "Print Report",
    slug: "report",
    icon: square,
    element: <PrintReport />,
  },
];

export default function App() {
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
  const { user, setUser } = useUserCtx();
  const [presentToast] = useIonToast();
  const history = useHistory();

  return (
    <IonTabs>
      <IonRouterOutlet>
        {!user ? (
          <Route exact path="/">
            <Redirect to={"/login"} />
          </Route>
        ) : (
          <Route exact path="/">
            <Redirect to={"/search"} />
          </Route>
        )}
        {[...tabs, ...hiddenPages].map((tab) => (
          <Route
            exact={tab?.exact ?? false}
            key={tab.slug}
            path={`/${tab.slug}`}
          >
            {tab.element}
          </Route>
        ))}
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="dont-print">
        {tabs.map((tab) => (
          <IonTabButton key={tab.slug} tab={tab.slug} href={`/${tab.slug}`}>
            <IonIcon icon={tab.icon} />
            <IonLabel>{tab.label}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
}

function Logout() {
  const { user, setUser } = useUserCtx();
  const [presentToast] = useIonToast();
  const history = useHistory();

  const handleLogout = () => {
    setUser(null);

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

    history.push("/login");
  };

  handleLogout();
  return null;
}
