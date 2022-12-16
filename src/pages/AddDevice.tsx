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
  useIonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { apiUrl } from "../App";
import { useUserCtx } from "../context/UserContext";
import { usePaymentMethods, useItemTypes } from "../utils/useData";
import Header from "../components/Header";
import { Redirect } from "react-router";

export default function AddDevicePage() {
  const { data: itemTypes } = useItemTypes();
  const { data: paymentMethods } = usePaymentMethods();
  const [presentToast] = useIonToast();

  const { user } = useUserCtx();

  const inputs = [
    {
      key: "userID",
      hidden: true,
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

    console.log("response", response);
    const { error, message } = await response.json();

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
  if (!user) return <Redirect to={"/login"} />;

  return (
    <IonPage>
      <Header title={"Add Device"} />
      <IonContent fullscreen>
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

  return hidden ? null : (
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
