import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import { Link } from "react-router-dom";

import { useUserCtx } from "../context/UserContext";

export default function Header({ title, backButton=false }: any) {
  const { user } = useUserCtx();

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">{backButton && <IonBackButton />}</IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          {user ? (
            <Link to="/logout">
              <IonButton color="dark">Logout {user?.username}</IonButton>
            </Link>
          ) : (
            <Link to="/login">
              <IonButton color="dark">Login</IonButton>
            </Link>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
