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
import React, { useState } from "react";

const user = {
  username: "Kiara",
};

export default function AddDevicePage() {
  const inputs = [
    {
      key: "name",
      label: "Client Name",
      placeholder: "Enter name",
      state: useState<string>(""),
    },
    {
      key: "phone",
      label: "Phone Number",
      placeholder: "Enter name",
      state: useState<string>(""),
    },
    {
      key: "device",
      label: "Device Type",
      placeholder: "Type of the device",
      state: useState<string>(""),
      options: ["android", "apple", "other"].map((option) => ({
        label: option,
        value: option,
      })),
    },
    {
      key: "desc",
      label: "Description",
      placeholder: "Enter description of the device",
      state: useState<string>(""),
    },
    {
      key: "cashier",
      label: "Cashier",
      placeholder: "Username of cashier adding the device",
      state: useState<string>(user.username),
    },
    {
      key: "location",
      label: "Location",
      placeholder: "Enter Location",
      state: useState<string>(""),
    },
  ];

  const handleAddDevice = async (
    event: React.MouseEvent<HTMLIonButtonElement>
  ) => {
    const url = `${process.env.API ?? ""}/addDevice`;
    let args = Object.assign(
      {},
      ...inputs.map((input) => ({ [input.key]: input.state[0] }))
    );
    console.log("send", args);

    const response = await fetch(url, {
      method: "POST",
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
  options?: { label: string; value: string }[];
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
          placeholder="Select device type"
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
