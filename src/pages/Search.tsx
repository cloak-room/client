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
  IonDatetime,
  DatetimeChangeEventDetail,
  DatetimeCustomEvent,
  IonList,
} from "@ionic/react";

import { setLightness } from "polished";

import { useEffect, useRef, useState } from "react";
import { useItems } from "../utils/useData";

import { Item } from "../utils/types";
import Header from "../components/Header";
import { apiUrl } from "../App";
import { add } from "ionicons/icons";
import { Link, useLocation } from "react-router-dom";
import { useUserCtx } from "../context/UserContext";
import { deleteDatabase } from "workbox-core/_private";

function toLocalDateString(d: Date) {
  return d.toLocaleString("en-AU").slice(0, 10).split("/").reverse().join("-");
}

export default function SearchPage() {
  const { user } = useUserCtx();
  const [presentToast] = useIonToast();
  const location = useLocation();

  const [search, setSearch] = useState<string | undefined>("");
  const [showCollected, setShowCollected] = useState(false);

  const datetime = useRef<null | HTMLIonDatetimeElement>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  useEffect(() => {
    if (!datetime.current) return;

    const today = toLocalDateString(new Date());

    console.log(today);
    datetime.current.value = [today];
    handleStartAndEndDate([today]);
  }, []);

  const [t, setT] = useState<NodeJS.Timeout>();
  const items = useItems(search, startDate, endDate);

  useEffect(() => {
    items.refresh();
  }, [location.key]);

  const handleChange = (e: SearchbarCustomEvent) => {
    clearTimeout(t);
    setT(setTimeout(() => setSearch(e.detail.value), 500));
  };

  const handleShowCollected = (e: CheckboxCustomEvent) => {
    setShowCollected(e.detail.checked);
    console.log(e.detail.checked);
  };

  const handleStartAndEndDate = (value: string[]) => {
    const dates = value.map((x) => new Date(x));

    dates.sort((a, b) => a.getTime() - b.getTime());

    const start = dates[0];
    start.setHours(0, 0, 0, 0);
    setStartDate(start.toISOString());

    const end = dates[dates.length - 1];
    end.setHours(23, 59, 0, 0);
    setEndDate(end.toISOString());
  };

  const handleDate = (e: DatetimeCustomEvent) => {
    if (typeof e.target.value == "string" || e.target.value == null) {
      setStartDate("");
      setEndDate("");
      return;
    }
    handleStartAndEndDate(e.target.value);
    //items.refresh();
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
                <IonDatetime
                  ref={datetime}
                  presentation="date"
                  multiple={true}
                  onIonChange={handleDate}
                ></IonDatetime>
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
      <IonAccordionGroup>
        {data?.map((item: any) => (
          <IonAccordion key={item.id} value={`Item-${item.id}`} className="row">
            <IonRow slot="header" key={item.id}>
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
                          functions.handleCollect(
                            item,
                            item.collected as boolean
                          )
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
            <div slot="content">
              <IonList class="expandedRowList">
                {Object.entries(item)?.map(([key, value], index) => (
                  <IonItem key={key} color={index%2 ? 'medium' : 'light'}>
                    {key === "user"}
                    <IonLabel>{`${key}:`}</IonLabel>
                    <IonLabel>{JSON.stringify(value) ?? <p>N / A</p>}</IonLabel>
                  </IonItem>
                ))}
                <IonItem key="edit" color="medium">
                  <Link to={`editDevice/${item.id}`}>
                    <IonButton
                      size="small"
                      shape="round"
                      color="warning"
                      fill="solid"
                    >
                      Edit
                    </IonButton>
                  </Link>
                </IonItem>
              </IonList>
            </div>
          </IonAccordion>
        ))}
      </IonAccordionGroup>
    </IonGrid>
  );
}
