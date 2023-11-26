import { IonModal, IonImg, IonContent, IonButton } from "@ionic/react";

export default function PhotoModal({
  photo,
  isPhotoOpen,
  setIsPhotoOpen,
}: {
  photo?: string;
  isPhotoOpen: boolean;
  setIsPhotoOpen: Function;
}) {
  return (
    <IonModal
      // ref={photoModal}
      isOpen={isPhotoOpen}
      onWillDismiss={(ev) => setIsPhotoOpen(false)}
    >
      <IonContent className="ion-padding">
        {photo && <IonImg src={photo} />}
        <IonButton
          expand="full"
          onClick={() => {
            setIsPhotoOpen(false);
          }}
        >
          Close
        </IonButton>
      </IonContent>
    </IonModal>
  );
}
