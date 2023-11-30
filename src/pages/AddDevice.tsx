import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonImg,
  useIonToast,
  useIonAlert,
  IonCol,
  IonRow,
  IonGrid,
  IonModal,
  IonIcon,
  IonItemDivider,
  IonItemGroup,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { apiUrl } from "../App";
import { useUserCtx } from "../context/UserContext";
import { usePaymentMethods, useItemTypes, useItems } from "../utils/useData";
import Header from "../components/Header";
import { Redirect, useHistory, useParams } from "react-router";
import { Item } from "../utils/types";
import { useCamera } from "../utils/useCamera";
import PhotoModal from "../components/PhotoModal";

export default function AddDevicePage() {
  const { data: itemTypes } = useItemTypes();
  const { data: paymentMethods } = usePaymentMethods();
  const [presentToast] = useIonToast();
  const history = useHistory();
  const [isPhotoOpen, setIsPhotoOpen] = useState<boolean>(false);
  const [addToCartIsOpen, setAddToCartIsOpen] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();

  const { user } = useUserCtx();
  const { itemID }: { itemID?: string } = useParams();
  const { takePhoto, lastPhoto, setLastPhoto } = useCamera();
  const [oldPhoto, setOldPhoto] = useState<string | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  // const photoModal = useRef<HTMLIonModalElement>(null);

  const { data: items, loading: itemsLoading } = useItems({
    itemID: itemID,
    showCollected: true,
    perPage: 1,
  });

  console.log("itemID", itemID);
  console.log("items", items);
  const item: Item | null | undefined = itemID ? items?.at(0) : null;
  console.log("item", item);

  const inputs = [
    {
      key: "ownerName",
      label: "Client Name",
      placeholder: "Enter name",
      state: useState<string | undefined>(undefined),
    },
    {
      key: "ownerPhoneNumber",
      label: "Phone Number",
      placeholder: "Enter name",
      state: useState<string | undefined>(undefined),
    },
    {
      key: "comments",
      label: "Comments",
      placeholder: "Enter comments",
      state: useState<string | undefined>(undefined),
    },
    {
      key: "storageLocation",
      label: "Location",
      placeholder: "Enter Location",
      state: useState<string | undefined>(undefined),
    },
    {
      key: "bagNumber",
      label: "Bag Number",
      placeholder: "Enter Number",
      state: useState<string | undefined>(undefined),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      placeholder: "Payment Method",
      state: useState<number>(-1),
      options: paymentMethods
        ? paymentMethods.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        : [],
    },
    // {
    //   key: "itemType",
    //   label: "Item Type",
    //   placeholder: "Type of the item",
    //   state: useState<number[]>([item?.itemType.id ?? -1]),
    //   multiple: false,
    //   count: itemCount,
    //   options: itemTypes
    //     ? itemTypes
    //         .sort((a, b) => a.price - b.price)
    //         .map((option) => ({
    //           value: option.id,
    //           label: `${option.name}: ($${(option.price / 100).toFixed(2)})`,
    //         }))
    //     : [],
    // },
  ];

  useEffect(() => {
    if (item) {
      console.log("useEffect", item);
      inputs.forEach((input) => {
        const [value, setValue] = input.state;
        const itemValue: any = item[input.key as keyof Item];

        console.log(itemValue);

        if (typeof itemValue == "object") {
          setValue(itemValue.id);
        } else if (itemValue) {
          setValue(itemValue);
        }
      });
      setCart([item.itemType.id]);
      setOldPhoto(item.imageLocation);
    }
  }, [item]);

  console.log(lastPhoto);

  const handleAddDevice = async (
    event: React.MouseEvent<HTMLIonButtonElement>
  ) => {
    const url = `${apiUrl}/items/add`;
    let args = Object.assign(
      { userId: user?.id, id: item?.id ?? null },
      ...inputs.map((input) => ({ [input.key]: input.state[0] }))
    );
    args.photo = lastPhoto;
    args.cart = cart;

    console.log("send", args);
    console.log(itemTypes);

    const addHandler = async (dryRun?: boolean) => {
      args.dryRun = dryRun;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(args),
      });

      console.log("response", response);
      const { error, message } = await response.json();

      // If item added successfully
      if (!error) {
        if (args.id != null) {
          history.push("/search");
        } else if (!dryRun) {
          // Clear inputs
          inputs.forEach((input) => {
            const [value, setValue] = input.state;
            const inputType = typeof value;
            const defaultValue: any = inputType === "string" ? "" : -1;
            setValue(defaultValue);
            setCart([]);
            setOldPhoto(null);
            setLastPhoto(undefined);
          });
        }
      }

      if (!dryRun || error) {
        // Error or success message using message from the backend
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
      }

      return { error, message };
    };

    // Validate the inputs with a dry run
    const dryRunResult = await addHandler(true);
    if (dryRunResult.error) {
      return;
    }

    // Add or update for real
    if (!item) {
      console.log(args);
      presentAlert({
        header: `Please Collect ${
          paymentMethods
            ? paymentMethods.find((x) => x.id === args.paymentMethod)?.name
            : ""
        } payment of $${
          cart.length > 0
            ? cart
                .map(
                  (itemType: number) =>
                    itemTypes?.find((x) => x.id === itemType)?.price ?? 0
                )
                .reduce(
                  (accumulator: number, current: number) =>
                    accumulator + current
                ) / 100
            : 0
        } from ${args.ownerName}`,
        cssClass: "custom-alert",
        buttons: [
          {
            text: "Cancel",
            cssClass: "alert-button-cancel",
            handler: () => true,
          },
          {
            text: "Confirm",
            cssClass: "alert-button-confirm",
            handler: addHandler,
          },
        ],
      });
    } else {
      addHandler();
    }
  };

  if (!user) return <Redirect to={"/login"} />;
  console.log("loading", itemID && itemsLoading);
  if (itemID && itemsLoading) return <p>Loading</p>;
  console.log(lastPhoto != "" ? lastPhoto : `photos/${item?.imageLocation}`);
  return (
    <IonPage>
      <Header backButton title={(itemID ? "Edit" : "Add") + " Device"} />
      <IonContent fullscreen>
        <main>
          <IonList>
            {inputs.map((input) => (
              <InputItem {...input} />
            ))}
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Cart</IonLabel>
              </IonItemDivider>
              {cart.map((itemID, i) => {
                const item = itemTypes?.find((x) => itemID === x.id);
                return (
                  <IonItem lines="none" key={i}>
                    <IonLabel>
                      {item?.name}: (${((item?.price ?? 0) / 100).toFixed(2)})
                    </IonLabel>
                    <IonButton
                      color="danger"
                      onClick={() =>
                        setCart((cart) => {
                          const x = [...cart];
                          x.splice(i, 1);
                          return x;
                        })
                      }
                    >
                      Delete
                    </IonButton>
                  </IonItem>
                );
              })}
            </IonItemGroup>
            <IonGrid>
              <IonRow className="ion-justify-content-between">
                <div>
                  <IonButton onClick={takePhoto}>Photo</IonButton>
                  {(lastPhoto || oldPhoto) && (
                    <IonButton
                      id="open-modal"
                      onClick={() => setIsPhotoOpen(true)}
                    >
                      View Photo
                    </IonButton>
                  )}
                </div>
                <IonButton
                  className="ion-align-self-end"
                  fill="outline"
                  onClick={() => setAddToCartIsOpen(true)}
                >
                  Add Item
                </IonButton>
              </IonRow>
            </IonGrid>
            <AddToCartModal
              {...{ itemTypes, addToCartIsOpen, setAddToCartIsOpen, setCart }}
            />
            <PhotoModal
              {...{
                photo: lastPhoto || `photos/${item?.imageLocation}`,
                isPhotoOpen,
                setIsPhotoOpen,
              }}
            />
            <IonButton onClick={handleAddDevice} expand="full">
              Submit
            </IonButton>
          </IonList>
        </main>
      </IonContent>
    </IonPage>
  );
}

function AddToCartModal({
  itemTypes,
  setAddToCartIsOpen,
  addToCartIsOpen,
  setCart,
}: {
  itemTypes: any[] | null;
  addToCartIsOpen: boolean;
  setAddToCartIsOpen: Function;
  setCart: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  console.log(itemTypes);

  return (
    <IonModal
      // ref={photoModal}
      isOpen={addToCartIsOpen}
      onWillDismiss={(ev) => setAddToCartIsOpen(false)}
    >
      <IonContent fullscreen style={{ height: "100%" }}>
        <IonList className="ion-no-padding">
          {itemTypes?.map((x) => (
            <IonItem>
              <IonButton
                fill="clear"
                expand="full"
                color="dark"
                style={{ flex: 1, height: "100%" }}
                className="ion-no-margin"
                onClick={() => {
                  setCart((cart) => [...cart, x.id]);
                  setAddToCartIsOpen(false);
                }}
              >
                <IonRow
                  style={{ flex: 1 }}
                  className="ion-justify-content-between"
                >
                  <div>{x.name}</div>
                  <div>{`$${(x.price / 100).toFixed(2)}`}</div>
                </IonRow>
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonButton
          expand="full"
          onClick={() => {
            setAddToCartIsOpen(false);
          }}
        >
          Close
        </IonButton>
      </IonContent>
    </IonModal>
  );
}

function InputItem({
  label,
  hidden,
  placeholder,
  state,
  options,
  multiple,
  count,
}: {
  label: string;
  hidden?: boolean;
  placeholder: string;
  state: [any, React.Dispatch<React.SetStateAction<any>>];
  options?: { label: string; value: number }[];
  multiple?: boolean;
  count?: [number, React.Dispatch<React.SetStateAction<number>>];
}) {
  const [value, setValue] = state;

  const handleChange = (event: Event) =>
    setValue((event.target as HTMLInputElement).value);

  // const elem = useRef<null | HTMLIonSelectElement>(null);

  // useEffect(() => {
  //   if (!elem.current) return;

  //   elem.current.value = 0;
  // }, [value]);

  return hidden ? null : (
    <>
      {new Array(count != null ? count[0] : 1).fill(null).map((_, i) => (
        <IonItem>
          <IonLabel>{label}</IonLabel>
          {options ? (
            <Select
              {...{ options, value, handleChange, placeholder, multiple }}
            />
          ) : (
            <IonInput
              value={value}
              onIonChange={handleChange}
              placeholder={placeholder}
            ></IonInput>
          )}
        </IonItem>
      ))}
    </>
  );
}

function Select({
  options,
  value,
  handleChange,
  placeholder,
  multiple,
}: {
  options: any;
  value: any;
  handleChange: any;
  placeholder: any;
  multiple?: boolean;
}) {
  if (value == null) return null;
  return (
    <IonSelect
      value={value}
      onIonChange={handleChange}
      placeholder={placeholder}
      multiple={multiple}
    >
      {options.map((option: any) => (
        <IonSelectOption key={option.value} value={option.value}>
          {option.label}
        </IonSelectOption>
      ))}
    </IonSelect>
  );
}
