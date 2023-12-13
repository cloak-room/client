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
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../App";
import { User, useUserCtx } from "../context/UserContext";
import useData from "../utils/useData";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import useMessage from "../utils/useMessage";

async function getUsers() {
  const url = `${apiUrl}/users`;
  const response = await fetch(url);
  console.log(response);

  const data: User[] = await response.json();
  console.log(data);

  return data;
}

export default function LoginPage() {
  const { data: users, loading, error, refresh } = useData<User[]>(getUsers);
  const { setUser } = useUserCtx();
  const toast = useMessage();
  const history = useHistory();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // For later

  useEffect(() => {
    if (error.name == "TypeError") refresh();
  }, [error]);

  const handleLogin = async (event: React.MouseEvent<HTMLIonButtonElement>) => {
    console.log(users);
    const selected = users?.find((i) => i.id === parseInt(username));

    if (selected) {
      setUser(selected);
      window.localStorage.setItem("user", JSON.stringify(selected));
      console.log("logged in", selected);
      toast.present("Login Successful", false);
      history.push("/search");
    } else {
      toast.present("You must select a user", true);
    }
    return;
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
      <Header title="Login" backButton />
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
              {users &&
                users.map((user) => (
                  <IonItem key={user.id}>
                    <IonLabel>{user.username}</IonLabel>
                    <IonRadio
                      slot="end"
                      key={user.username}
                      value={user.id}
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
