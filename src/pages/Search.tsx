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
  IonCard,
  IonSpinner,
  useIonAlert,
} from "@ionic/react";

import { setLightness } from "polished";

import { useEffect, useRef, useState } from "react";
import { useItems } from "../utils/useData";

import { Item, ItemType, PaymentMethod, User } from "../utils/types";
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
  const [presentAlert] = useIonAlert();
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
    //datetime.current.value = [today];
    //handleStartAndEndDate([today]);
  }, []);

  const [t, setT] = useState<NodeJS.Timeout>();
  const items = useItems(search, startDate, endDate);

  useEffect(() => {
    items.refresh();
  }, [location.key]);

  useEffect(() => {
    if (items.error.name == "TypeError") items.refresh();
  }, [items.error]);

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
    const collect = async () => {
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

    presentAlert({
      header: `Collect. Are you sure?`,
      cssClass: "custom-alert",
      buttons: [
        {
          text: "Cancel",
          cssClass: "alert-button-cancel",
          handler: () => false,
        },
        {
          text: "Confirm",
          cssClass: "alert-button-confirm",
          handler: collect,
        },
      ],
    });
  };

  const handleRefund = async (item: Item, reset: boolean = false) => {
    const url = `${apiUrl}/items/refund`;
    console.log("refund", item);

    const refund = async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: item.id, reset, user: user?.id }),
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

    presentAlert({
      header: `Refund. Are you sure?`,
      cssClass: "custom-alert",
      buttons: [
        {
          text: "Cancel",
          cssClass: "alert-button-cancel",
          handler: () => false,
        },
        {
          text: "Confirm",
          cssClass: "alert-button-confirm",
          handler: refund,
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
          {items.loading ? (
            <IonSpinner name="circular"></IonSpinner>
          ) : (
            <Table
              {...{
                columns: [
                  {
                    item: "id",
                    label: "ID",
                    className: "ion-hide",
                  },
                  {
                    item: "user",
                    label: "Cashier",
                    className: "ion-hide",
                    displayFunction: (x: User) => x.username,
                  },
                  { item: "ownerName", label: "Owner", className: "" },
                  { item: "ownerPhoneNumber", label: "Phone #", className: "" },
                  { item: "storageLocation", label: "Location", className: "" },
                  {
                    item: "itemType",
                    label: "Type",
                    className: "ion-hide-sm-down",
                    displayFunction: (x: ItemType) => x.name,
                  },
                  {
                    item: "itemType",
                    label: "Price",
                    className: "ion-hide-sm-down",
                    displayFunction: (x: ItemType) => `$${x.price / 100}`,
                  },
                  {
                    item: "paymentMethod",
                    label: "PaymentMethod",
                    className: "ion-hide-md-down",
                    displayFunction: (x: PaymentMethod) => x.name,
                  },
                  {
                    item: "comments",
                    label: "Comments",
                    className: "ion-hide-md-down",
                  },

                  {
                    item: "createdAt",
                    label: "Dropped Off",
                    className: "ion-hide",
                    displayFunction: (x: string) =>
                      new Date(x).toLocaleString("en-AU"),
                  },
                  {
                    item: "collected",
                    label: "Collected",
                    className: "ion-hide",
                    displayFunction: (x: string) =>
                      x == null ? "N / A" : new Date(x).toLocaleString("en-AU"),
                  },
                  {
                    item: "refunded",
                    label: "Refunded",
                    className: "ion-hide",
                    displayFunction: (x: string) =>
                      x == null ? "N / A" : new Date(x).toLocaleString("en-AU"),
                  },

                  ...(user
                    ? [{ item: "actions", label: "Actions", className: "" }]
                    : []),
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
          )}
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
  columns: {
    item: string;
    label: string;
    className: string;
    displayFunction?: (x: any) => string;
  }[];
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
          <IonCol className={`header ${col.className}`} key={col.label}>
            {col.label}
          </IonCol>
        ))}
      </IonRow>
      <IonAccordionGroup>
        {data?.map((item: any) => (
          <IonAccordion key={item.id} value={`Item-${item.id}`} className="row">
            <IonRow slot="header" key={item.id}>
              {columns?.map((col) => (
                <IonCol key={col.label} className={col.className}>
                  {col.item === "actions" ? (
                    <div>
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
                    (col.displayFunction
                      ? col.displayFunction(item[col.item])
                      : item[col.item]) ?? <p>N / A</p>
                  )}
                </IonCol>
              ))}
            </IonRow>
            <div slot="content" className="detail-card">
              <IonCard>
                <IonList class="expandedRowList">
                  {columns?.map((col, index) =>
                    col.item !== "actions" ? (
                      <IonItem
                        key={col.label}
                        color={index % 2 ? "medium" : "light"}
                      >
                        {/* {key === "user"} */}
                        <IonLabel>{`${col.label}:`}</IonLabel>
                        <IonLabel>
                          {(col.displayFunction
                            ? col.displayFunction(item[col.item])
                            : item[col.item]) ?? <p>N / A</p>}
                        </IonLabel>
                      </IonItem>
                    ) : (
                      <IonItem key="edit" color="medium">
                        <IonButton
                          size="small"
                          shape="round"
                          color="danger"
                          fill={item.refunded ? "outline" : "solid"}
                          onClick={() =>
                            functions.handleRefund(
                              item,
                              item.refunded as boolean
                            )
                          }
                        >
                          Refund{item.refunded && "ed"}
                        </IonButton>
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
                    )
                  )}
                </IonList>
              </IonCard>
            </div>
          </IonAccordion>
        ))}
      </IonAccordionGroup>
    </IonGrid>
  );
}
