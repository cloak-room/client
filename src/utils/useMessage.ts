import { useIonToast } from "@ionic/react";

export default function useMessage() {
  const [presentToast] = useIonToast();

  const present = (message: string, error: boolean) => {
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
  return { present };
}
