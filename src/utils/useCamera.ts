import { useState, useEffect } from "react";
import { isPlatform } from "@ionic/react";

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

export function useCamera() {
  const [lastPhoto, setLastPhoto] = useState<string | undefined>("");
  const takePhoto = async () => {
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

  return {
    takePhoto,
    lastPhoto,
    setLastPhoto,
  };
}
