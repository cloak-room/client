import {
  IonModal,
  IonImg,
  IonContent,
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import Webcam from "react-webcam";
import { useState, useCallback, useRef, useEffect } from "react";
export default function CameraModal({
  onDismiss,
  resolve,
  reject,
}: {
  onDismiss: Function;
  resolve: Function;
  reject: Function;
}) {
  const [imgSrc, setImgSrc] = useState<string | null | undefined>(undefined);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceKey, setDeviceKey] = useState<string | undefined>(undefined);
  const [facingMode, setFacingMode] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc);
  }, [webcamRef, setImgSrc]);

  useEffect(() => {
    (async () => {
      try {
        const preferredCamera = JSON.parse(
          localStorage.getItem("camera") ?? ""
        );
        console.log(preferredCamera);
        setDeviceKey(preferredCamera);
      } catch (e) {
        console.log("No Default camera");
      }

      await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (x) => x.kind === "videoinput"
      );
      setDevices(devices);
      console.log(devices);
    })();
  }, []);

  return (
    <IonContent className="ion-padding">
      {imgSrc == null ? (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          audio={false}
          style={{ width: "100%" }}
          videoConstraints={{
            deviceId: deviceKey,
            facingMode: facingMode ? "user" : "environment",
          }}
        />
      ) : (
        <IonImg src={imgSrc} />
      )}
      {devices != undefined && devices.length > 1 && (
        <IonSelect
          value={deviceKey}
          onIonChange={(e) => {
            localStorage.setItem("camera", JSON.stringify(e.detail.value));
            console.log(e.detail.value);
            setDeviceKey(e.detail.value);
          }}
        >
          {devices.map((x) => (
            <IonSelectOption key={x.deviceId} value={x.deviceId}>
              {x.label}
            </IonSelectOption>
          ))}
        </IonSelect>
      )}
      <IonButton
        expand="full"
        onClick={() => {
          setFacingMode((o) => !o);
        }}
      >
        Flip
      </IonButton>
      <IonButton
        expand="full"
        onClick={() => {
          if (imgSrc == null) capture();
          else setImgSrc(null);
        }}
      >
        {imgSrc == null ? "Take Photo" : "Retry"}
      </IonButton>
      <IonButton
        expand="full"
        onClick={() => {
          onDismiss(imgSrc);
        }}
      >
        {imgSrc == null ? "Cancel" : "Confirm"}
      </IonButton>
    </IonContent>
  );
}
