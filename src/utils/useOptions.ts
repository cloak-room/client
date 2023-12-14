import { useEffect, useState } from "react";

const location = "options";

function isOptions(object: any) {
  const keys = ["showCollected", "showStored"];

  return keys.reduce((a, c) => c in object && a, true);
}

export default function useOptions() {
  const [options, setOptions] = useState({
    showCollected: false,
    showStored: true,
  });
  useEffect(() => {
    const optionsString = localStorage.getItem(location);
    if (optionsString != null) {
      const localOptions = JSON.parse(optionsString);
      if (isOptions(localOptions)) {
        setOptions(localOptions);
      }
    }
  }, []);

  const updateOption = (key: string, value: any) => {
    setOptions((old) => {
      const temp = { ...old };
      temp[key as keyof typeof temp] = value;
      localStorage.setItem(location, JSON.stringify(temp));
      return temp;
    });
  };

  return { options, updateOption };
}
