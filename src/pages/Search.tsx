import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSearchbar,
  SearchbarCustomEvent,
  IonButton,
  useIonToast,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonAccordion,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonCheckbox,
  CheckboxCustomEvent,
} from "@ionic/react";

import { useState } from "react";
import { useItems } from "../utils/useData";

import { Item } from "../utils/types";
import Header from "../components/Header";
import { apiUrl } from "../App";
import { add } from "ionicons/icons";
import { Link } from "react-router-dom";
import { useUserCtx } from "../context/UserContext";

export default function SearchPage() {
  const { user } = useUserCtx();
  const [presentToast] = useIonToast();

  const [search, setSearch] = useState<string | undefined>("");
  const [showCollected, setShowCollected] = useState(false);

  const [t, setT] = useState<NodeJS.Timeout>();
  const items = useItems(search);

  const handleChange = (e: SearchbarCustomEvent) => {
    clearTimeout(t);
    setT(setTimeout(() => setSearch(e.detail.value), 500));
  };

  const handleShowCollected = (e: CheckboxCustomEvent) => {
    setShowCollected(e.detail.checked);
    console.log(e.detail.checked);
  };

  const handleCollect = async (item: Item, reset: boolean = false) => {
    const url = `${apiUrl}/items/collect`;
    console.log("collect", item);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: item.id, reset }),
    });

    console.log("response", response);
    const { error, message } = await response.json();

    items.refresh();

    // Error or success message using message from the backend
    presentToast({
      message: `${message}`,
      color: error ? "danger" : "success",
      position: "top",
      duration: 3000,
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
  };

  const handleRefund = async (item: Item, reset: boolean = false) => {
    const url = `${apiUrl}/items/refund`;
    console.log("refund", item);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: item.id, reset }),
    });

    const { error, message } = await response.json();

    items.refresh();
    // Error or success message using message from the backend
    presentToast({
      message: `${message}`,
      color: error ? "danger" : "success",
      position: "top",
      duration: 3000,
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
  };
  return (
    <IonPage>
      <Header title="Search" />
      <IonContent fullscreen>
        <main>
          <IonSearchbar
            placeholder="Search Device"
            onIonChange={handleChange}
          ></IonSearchbar>
          <IonAccordionGroup>
            <IonAccordion value="first">
              <IonItem slot="header" color="light">
                <IonLabel>More Options</IonLabel>
              </IonItem>
              <div slot="content">
                <IonItem>
                  <IonCheckbox
                    slot="start"
                    indeterminate={showCollected}
                    onIonChange={handleShowCollected}
                  ></IonCheckbox>
                  <IonLabel>Show Collected</IonLabel>
                </IonItem>
              </div>
            </IonAccordion>
          </IonAccordionGroup>

          <Table
            {...{
              columns: [
                { item: "ownerName", label: "Owner" },
                { item: "ownerPhoneNumber", label: "Phone #" },
                { item: "storageLocation", label: "Location" },
                { item: "comments", label: "Comments" },
                ...(user ? [{ item: "actions", label: "Actions" }] : []),
              ],
              ...{
                ...items,
                data: !showCollected
                  ? items?.data?.filter((x) => x.collected == null)
                  : items.data,
              },
              functions: { handleCollect, handleRefund },
            }}
          />
        </main>
        {/* Empty toolbar to leave space for FAB */}
        <IonToolbar />
      </IonContent>
      {user && (
        <IonFab horizontal="end" vertical="bottom">
          <Link to="addDevice">
            <IonFabButton>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </Link>
        </IonFab>
      )}
    </IonPage>
  );
}

function Table({
  columns,
  data,
  loading,
  error,
  functions,
}: {
  columns: { item: string; label: string }[];
  data?: Item[] | null;
  loading: boolean;
  error: Error;
  functions: any;
}) {
  console.log(data);
  if (loading) return <div>Loading...</div>;
  return (
    <IonGrid>
      <IonRow>
        {columns.map((col) => (
          <IonCol className="header" key={col.item}>
            {col.label}
          </IonCol>
        ))}
      </IonRow>

      {data?.map((item: any) => (
        <IonRow className="row" key={item.id}>
          {columns?.map((col) => (
            <IonCol key={col.item}>
              {col.item === "actions" ? (
                <div>
                  <IonButton
                    size="small"
                    shape="round"
                    color="danger"
                    fill={item.refunded ? "outline" : "solid"}
                    onClick={() =>
                      functions.handleRefund(item, item.refunded as boolean)
                    }
                  >
                    Refund{item.refunded && "ed"}
                  </IonButton>
                  <IonButton
                    size="small"
                    shape="round"
                    color="success"
                    fill={item.collected ? "outline" : "solid"}
                    onClick={() =>
                      functions.handleCollect(item, item.collected as boolean)
                    }
                  >
                    Collect{item.collected && "ed"}
                  </IonButton>
                </div>
              ) : (
                item[col.item] ?? <p>N / A</p>
              )}
            </IonCol>
          ))}
        </IonRow>
      ))}
    </IonGrid>
  );
}
