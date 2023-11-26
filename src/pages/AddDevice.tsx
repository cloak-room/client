import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonImg,
  useIonToast,
  useIonAlert,
  IonCol,
  IonRow,
  IonGrid,
  IonModal,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { apiUrl } from "../App";
import { useUserCtx } from "../context/UserContext";
import { usePaymentMethods, useItemTypes, useItems } from "../utils/useData";
import Header from "../components/Header";
import { Redirect, useHistory, useParams } from "react-router";
import { Item } from "../utils/types";
import { useCamera } from "../utils/useCamera";
import PhotoModal from "../components/PhotoModal";

export default function AddDevicePage() {
  const { data: itemTypes } = useItemTypes();
  const { data: paymentMethods } = usePaymentMethods();
  const [presentToast] = useIonToast();
  const history = useHistory();
  const [isPhotoOpen, setIsPhotoOpen] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();

  const { user } = useUserCtx();
  const { itemID }: { itemID?: string } = useParams();
  const { takePhoto, lastPhoto } = useCamera();
  // const photoModal = useRef<HTMLIonModalElement>(null);

  const { data: items } = useItems({
    itemID: itemID,
    showCollected: true,
    perPage: 1,
  });

  console.log("itemID", itemID);
  console.log("items", items);
  const item: Item | null | undefined = itemID ? items?.at(0) : null;
  console.log("item", item);

  const inputs = [
    {
      key: "ownerName",
      label: "Client Name",
      placeholder: "Enter name",
      state: useState<string>(item?.ownerName ?? ""),
    },
    {
      key: "ownerPhoneNumber",
      label: "Phone Number",
      placeholder: "Enter name",
      state: useState<string>(item?.ownerPhoneNumber ?? ""),
    },
    {
      key: "itemType",
      label: "Item Type",
      placeholder: "Type of the item",
      state: useState<number>(item?.itemType.id ?? -1),
      options: itemTypes
        ? itemTypes
            .sort((a, b) => a.price - b.price)
            .map((option) => ({
              value: option.id,
              label: `${option.name}: ($${(option.price / 100).toFixed(2)})`,
            }))
        : [],
    },
    {
      key: "comments",
      label: "Comments",
      placeholder: "Enter comments",
      state: useState<string>(item?.comments ?? ""),
    },
    {
      key: "storageLocation",
      label: "Location",
      placeholder: "Enter Location",
      state: useState<string>(item?.storageLocation ?? ""),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      placeholder: "Payment Method",
      state: useState<number>(item?.paymentMethod.id ?? -1),
      options: paymentMethods
        ? paymentMethods.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        : [],
    },
  ];

  useEffect(() => {
    if (item) {
      console.log("useEffect", item);
      inputs.forEach((input) => {
        const [value, setValue] = input.state;
        const itemValue: any = item[input.key as keyof Item];

        console.log(itemValue);

        if (typeof itemValue == "object") {
          setValue(itemValue.id);
        } else if (itemValue) {
          setValue(itemValue);
        }
      });
    }
  }, [item]);

  console.log(lastPhoto);

  const handleAddDevice = async (
    event: React.MouseEvent<HTMLIonButtonElement>
  ) => {
    const url = `${apiUrl}/items/add`;
    let args = Object.assign(
      { userId: user?.id, id: item?.id ?? null },
      ...inputs.map((input) => ({ [input.key]: input.state[0] }))
    );
    args.photo = lastPhoto;
    console.log("send", args);
    console.log(itemTypes);

    const addHandler = async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(args),
      });

      console.log("response", response);
      const { error, message } = await response.json();

      // If item added successfully
      if (!error) {
        // Clear inputs
        inputs.forEach((input) => {
          const [value, setValue] = input.state;
          const inputType = typeof value;
          const defaultValue: any = inputType === "string" ? "" : -1;
          setValue(defaultValue);
        });

        if (args.id != null) {
          history.push("/search");
        }
      }

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

    if (!item) {
      console.log(args);
      presentAlert({
        header: `Please Collect ${
          paymentMethods
            ? paymentMethods.find((x) => x.id === args.paymentMethod)?.name
            : ""
        } payment of $${
          (itemTypes?.find((x) => x.id === args.itemType)?.price ?? 500) / 100
        } from ${args.ownerName}`,
        cssClass: "custom-alert",
        buttons: [
          {
            text: "Cancel",
            cssClass: "alert-button-cancel",
            handler: () => true,
          },
          {
            text: "Confirm",
            cssClass: "alert-button-confirm",
            handler: addHandler,
          },
        ],
      });
    } else {
      addHandler();
    }
  };

  if (!user) return <Redirect to={"/login"} />;

  return (
    <IonPage>
      <Header backButton title={(itemID ? "Edit" : "Add") + " Device"} />
      <IonContent fullscreen>
        <main>
          <IonList>
            {inputs.map((input) => (
              <InputItem {...input} />
            ))}
            <IonGrid>
              <IonRow className="ion-align-items-stretch">
                <IonButton onClick={takePhoto}>Photo</IonButton>
                {lastPhoto && (
                  <IonButton
                    id="open-modal"
                    onClick={() => setIsPhotoOpen(true)}
                  >
                    View Photo
                  </IonButton>
                )}
              </IonRow>
            </IonGrid>
            <PhotoModal
              {...{ photo: lastPhoto, isPhotoOpen, setIsPhotoOpen }}
            />
            <IonButton onClick={handleAddDevice} expand="full">
              Submit
            </IonButton>
          </IonList>
        </main>
      </IonContent>
    </IonPage>
  );
}

function InputItem({
  label,
  hidden,
  placeholder,
  state,
  options,
}: {
  label: string;
  hidden?: boolean;
  placeholder: string;
  state: [any, React.Dispatch<React.SetStateAction<any>>];
  options?: { label: string; value: number }[];
}) {
  const [value, setValue] = state;

  const handleChange = (event: Event) =>
    setValue((event.target as HTMLInputElement).value);

  // const elem = useRef<null | HTMLIonSelectElement>(null);

  // useEffect(() => {
  //   if (!elem.current) return;

  //   elem.current.value = 0;
  // }, [value]);

  return hidden ? null : (
    <IonItem>
      <IonLabel>{label}</IonLabel>
      {options ? (
        <Select {...{ options, value, handleChange, placeholder }} />
      ) : (
        <IonInput
          value={value}
          onIonChange={handleChange}
          placeholder={placeholder}
        ></IonInput>
      )}
    </IonItem>
  );
}

function Select({
  options,
  value,
  handleChange,
  placeholder,
}: {
  options: any;
  value: any;
  handleChange: any;
  placeholder: any;
}) {
  if (value == null) return null;
  return (
    <IonSelect
      value={value}
      onIonChange={handleChange}
      placeholder={placeholder}
    >
      {options.map((option: any) => (
        <IonSelectOption key={option.value} value={option.value}>
          {option.label}
        </IonSelectOption>
      ))}
    </IonSelect>
  );
}
