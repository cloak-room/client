import { useState, useEffect, useRef } from "react";
import { isPlatform, useIonModal } from "@ionic/react";

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import Webcam from "react-webcam";
import CameraModal from "../components/CameraModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";

export function useCamera() {
  const [lastPhoto, setLastPhoto] = useState<string | undefined>("");
  const webcam = useWebcam();

  let takePhoto = async () => {
    const allowed = await Camera.checkPermissions();
    if (!allowed) {
      await Camera.requestPermissions();
    }

    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
    });
    setLastPhoto(photo.dataUrl);
  };

  if (isPlatform("desktop")) {
    takePhoto = async () => {
      const photo = await webcam.getPhoto();
      console.log("onWill", await photo);
      if (photo != null) setLastPhoto(photo);
    };
  }
  return {
    takePhoto,
    lastPhoto,
    setLastPhoto,
  };
}

function useWebcam() {
  const [present, dismiss] = useIonModal(CameraModal, {
    onDismiss: (data: string, role: string) => {
      dismiss(data, role);
    },
  });

  const getPhoto = () => {
    //setIsCameraOpen(true);
    let photoPromise = new Promise(function (
      resolve: (value: string | undefined) => void,
      reject
    ) {
      present({
        onWillDismiss: (ev: any) => {
          resolve(ev.detail.data);
        },
      });
    });

    return photoPromise;
  };

  return { getPhoto };
}
