import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../App";
import { useUserCtx } from "../context/UserContext";
import useData, { usePaymentMethods, useItemTypes } from "../utils/useData";
import { ItemType, PaymentMethod } from "../utils/types";

export default function AddDevicePage() {
  const { data: itemTypes } = useItemTypes();
  const { data: paymentMethods } = usePaymentMethods();

  const { user } = useUserCtx();

  const inputs = [
    {
      key: "userID",
      label: "Cashier",
      placeholder: "Username of cashier adding the device",
      state: useState<number>(user?.id ?? 1 ?? 0),
    },
    {
      key: "ownerName",
      label: "Client Name",
      placeholder: "Enter name",
      state: useState<string>(""),
    },
    {
      key: "ownerPhoneNumber",
      label: "Phone Number",
      placeholder: "Enter name",
      state: useState<string>(""),
    },
    {
      key: "itemTypeID",
      label: "Item Type",
      placeholder: "Type of the item",
      state: useState<number>(0),
      options: itemTypes
        ? itemTypes.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        : [],
    },
    {
      key: "comments",
      label: "Comments",
      placeholder: "Enter comments",
      state: useState<string>(""),
    },
    {
      key: "storageLocation",
      label: "Location",
      placeholder: "Enter Location",
      state: useState<string>(""),
    },
    {
      key: "storageLocation",
      label: "Location",
      placeholder: "Enter Location",
      state: useState<string>(""),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      placeholder: "Payment Method",
      state: useState<number>(0),
      options: paymentMethods
        ? paymentMethods.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        : [],
    },
  ];

  const handleAddDevice = async (
    event: React.MouseEvent<HTMLIonButtonElement>
  ) => {
    const url = `${apiUrl}/items/add`;
    let args = Object.assign(
      {},
      ...inputs.map((input) => ({ [input.key]: input.state[0] }))
    );
    console.log("send", args);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(args),
    });
    console.log(response);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Device</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add Device</IonTitle>
          </IonToolbar>
        </IonHeader>
        <main>
          <IonList>
            {inputs.map((input) => (
              <InputItem {...input} />
            ))}
            <IonButton onClick={handleAddDevice}>Submit</IonButton>
          </IonList>
        </main>
      </IonContent>
    </IonPage>
  );
}

function InputItem({
  label,
  placeholder,
  state,
  options,
}: {
  label: string;
  placeholder: string;
  state: [any, React.Dispatch<React.SetStateAction<any>>];
  options?: { label: string; value: number }[];
}) {
  const [value, setValue] = state;

  const handleChange = (event: Event) =>
    setValue((event.target as HTMLInputElement).value);

  return (
    <IonItem>
      <IonLabel>{label}</IonLabel>
      {options ? (
        <IonSelect
          value={value}
          onIonChange={handleChange}
          placeholder={placeholder}
        >
          {options.map((option) => (
            <IonSelectOption key={option.value} value={option.value}>
              {option.label}
            </IonSelectOption>
          ))}
        </IonSelect>
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
