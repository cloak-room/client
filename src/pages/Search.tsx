import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSearchbar,
  SearchbarCustomEvent,
} from "@ionic/react";

import { useState } from "react";
import { useItems } from "../utils/useData";

import { Item } from "../utils/types";
import Header from "../components/Header";

export default function SearchPage() {
  const [search, setSearch] = useState<string | undefined>("");
  const [t, setT] = useState<NodeJS.Timeout>();
  const items = useItems(search);

  const handleChange = (e: SearchbarCustomEvent) => {
    clearTimeout(t);
    setT(setTimeout(() => setSearch(e.detail.value), 500));
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
              ],
              ...items,
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
}: {
  columns: { item: string; label: string }[];
  data: Item[] | null;
  loading: boolean;
  error: Error;
}) {
  console.log(data);
  if (loading) return <div>Loading...</div>;
  return (
    <IonGrid>
      <IonRow>
        {columns.map((x) => (
          <IonCol className="header" key={x.item}>
            {x.label}
          </IonCol>
        ))}
      </IonRow>

      {data?.map((x: any) => (
        <IonRow className="row" key={x.id}>
          {columns?.map((y) => (
            <IonCol key={y.item}>{x[y.item] ?? <p>N / A</p>}</IonCol>
          ))}
        </IonRow>
      ))}
    </IonGrid>
  );
}
