import {
  IonContent,
  IonPage,
  IonSearchbar,
  SearchbarCustomEvent,
  useIonToast,
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
  DatetimeCustomEvent,
  IonSpinner,
  useIonAlert,
} from "@ionic/react";

import { useEffect, useRef, useState } from "react";
import { useItems } from "../../utils/useData";

import { Item, ItemType, PaymentMethod, User } from "../../utils/types";
import Header from "../../components/Header";
import { apiUrl } from "../../App";
import { add } from "ionicons/icons";
import { Link, useLocation } from "react-router-dom";
import { useUserCtx } from "../../context/UserContext";
import Table from "./Table";
import useOptions from "../../utils/useOptions";

function toLocalDateString(d: Date) {
  return d.toLocaleString("en-AU").slice(0, 10).split("/").reverse().join("-");
}

export default function SearchPage() {
  const { user } = useUserCtx();
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const location = useLocation();

  const { options, updateOption } = useOptions();

  const [search, setSearch] = useState<string | undefined>("");
  // const [showCollected, setShowCollected] = useState(false);
  // const [showStored, setShowStored] = useState(true);

  const datetime = useRef<null | HTMLIonDatetimeElement>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(25);

  useEffect(() => {
    if (!datetime.current) return;

    const today = toLocalDateString(new Date());

    console.log(today);
    //datetime.current.value = [today];
    //handleStartAndEndDate([today]);
  }, []);

  const [t, setT] = useState<NodeJS.Timeout>();
  const items = useItems({
    search,
    start: startDate,
    end: endDate,
    currentPage,
    showCollected: options.showCollected,
    showStored: options.showStored,
    perPage,
  });
  console.log(location?.state);

  useEffect(() => {
    //if (items.error.name == "TypeError") items.refresh();
  }, [items.error]);

  const handleChange = (e: SearchbarCustomEvent) => {
    clearTimeout(t);
    setT(setTimeout(() => setSearch(e.detail.value), 500));
  };

  const handleShowCollected = (e: CheckboxCustomEvent) => {
    // setShowCollected(e.detail.checked);
    updateOption("showCollected", e.detail.checked);
    console.log(e.detail.checked);
  };

  const handleShowStored = (e: CheckboxCustomEvent) => {
    // setShowStored(e.detail.checked);
    updateOption("showStored", e.detail.checked);
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
                    indeterminate={options.showCollected}
                    onIonChange={handleShowCollected}
                  ></IonCheckbox>
                  <IonLabel>Show Collected</IonLabel>
                </IonItem>
                <IonItem>
                  <IonCheckbox
                    slot="start"
                    indeterminate={options.showStored}
                    onIonChange={handleShowStored}
                  ></IonCheckbox>
                  <IonLabel>Show Stored</IonLabel>
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
                  { item: "storageLocation", label: "Location", className: "" },
                  { item: "bagNumber", label: "Bag", className: "" },

                  {
                    item: "itemType",
                    label: "Type",
                    className: "ion-hide-sm-down",
                    displayFunction: (x: ItemType) => x.name,
                  },
                  { item: "ownerPhoneNumber", label: "Phone #", className: "" },
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
                  data: items.data,
                },
                functions: { handleCollect, handleRefund },
                ...{ pageCount: items.pageCount ?? 1, setPage, currentPage },
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
