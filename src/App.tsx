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
import AddDevice from "./pages/AddDevice";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

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

setupIonicReact();

const tabs = [
  {
    label: "Add",
    slug: "addDevice",
    icon: triangle,
    element: <AddDevice />,
  },
  {
    label: "Tab 2",
    slug: "tab2",
    icon: ellipse,
    element: <Tab2 />,
  },
  {
    label: "Tab 3",
    slug: "tab3",
    icon: square,
    element: <Tab3 />,
  },
];

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {tabs.map((tab) => (
            <Route path={`/${tab.slug}`}>{tab.element}</Route>
          ))}
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {tabs.map((tab) => (
            <IonTabButton tab={tab.slug} href={`/${tab.slug}`}>
              <IonIcon icon={tab.icon} />
              <IonLabel>{tab.label}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
