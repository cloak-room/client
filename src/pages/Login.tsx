import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import useData from "../utils/useData";

async function getUsers() {
  const url = `${process.env.API ?? ""}/getUsers`;
  const response = await fetch(url);
  console.log(response);

  console.log();

  // const data: any[] = await response.json();
  const data = Array.from({ length: 10 }, (_, k) => ({
    username: `User ${k + 1}`,
  }));
  console.log(data);

  return data;
}

export default function LoginPage() {
  const { data: users, loading, error } = useData(getUsers);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // For later

  const handleLogin = async (event: React.MouseEvent<HTMLIonButtonElement>) => {
    const url = `${process.env.API ?? ""}/login`;
    const args = { username }; // Implement password later
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
          <IonTitle>Login</IonTitle>
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
            <IonRadioGroup
              value={username}
              onIonChange={(event: Event) =>
                setUsername((event.target as HTMLInputElement).value)
              }
              placeholder="Select username"
            >
              {users.map((user) => (
                <IonItem>
                  <IonLabel>{user.username}</IonLabel>
                  <IonRadio
                    slot="end"
                    key={user.username}
                    value={user.username}
                  ></IonRadio>
                </IonItem>
              ))}
            </IonRadioGroup>
            <IonButton onClick={handleLogin}>Login</IonButton>
          </IonList>
        </main>
      </IonContent>
    </IonPage>
  );
}
