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
} from "@ionic/react";

import { useState } from "react";
import { useItems } from "../utils/useData";

import { Item } from "../utils/types";
import Header from "../components/Header";
import { apiUrl } from "../App";

export default function SearchPage() {
  const [presentToast] = useIonToast();
  const [search, setSearch] = useState<string | undefined>("");
  const [t, setT] = useState<NodeJS.Timeout>();
  const items = useItems(search);

  const handleChange = (e: SearchbarCustomEvent) => {
    clearTimeout(t);
    setT(setTimeout(() => setSearch(e.detail.value), 500));
  };

  const handleCollect = async (item: Item) => {
    const url = `${apiUrl}/items/collect`;
    console.log("collect", item);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: item.id }),
    });

    console.log("response", response);
    const { error, message } = await response.json();

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

  const handleRefund = async (item: Item) => {
    const url = `${apiUrl}/items/refund`;
    console.log("refund", item);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: item.id }),
    });

    console.log("response", response);
    const { error, message } = await response.json();

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

  console.log(search);
  return (
    <IonPage>
      <Header title="Search" />
      <IonContent fullscreen>
        <main>
          <IonSearchbar
            placeholder="Search Device"
            onIonChange={handleChange}
          ></IonSearchbar>
          <Table
            {...{
              columns: [
                { item: "ownerName", label: "Owner" },
                { item: "ownerPhoneNumber", label: "Phone #" },
                { item: "storageLocation", label: "Location" },
                { item: "comments", label: "Comments" },
                { item: "actions", label: "Actions" },
              ],
              ...items,
              functions: { handleCollect, handleRefund },
            }}
          />
        </main>
      </IonContent>
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
  data: Item[] | null;
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
                  {item.refunded ? null : (
                    // <IonChip color="success">Refunded: {item.refunded}</IonChip>
                    <IonButton
                      color="danger"
                      onClick={() => functions.handleRefund(item)}
                    >
                      Refund
                    </IonButton>
                  )}
                  {item.collected ? null : (
                    // <IonChip color="success">Collected</IonChip>
                    <IonButton
                      color="success"
                      onClick={() => functions.handleCollect(item)}
                    >
                      Collect
                    </IonButton>
                  )}
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
