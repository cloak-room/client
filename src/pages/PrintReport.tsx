import _ from "lodash";
import { useDaily, useItems, usePaymentMethods } from "../utils/useData";
import { PaymentMethod, Item } from "../utils/types";

import { IonButton, IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import { useEffect, useState } from "react";

function isToday(date: string | null) {
  if (date == null) {
    return false;
  }
  const now = new Date();

  const startTime = new Date(now.getTime());
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date(now.getTime());
  endTime.setHours(23, 59, 0, 0);

  const d = new Date(date);
  console.log(date);

  return d < endTime && d > startTime;
}

export default function PrintReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const items = useItems();
  const paymentMethods = usePaymentMethods();

  const [methods, setMethods] = useState<PaymentMethod[] | null>();

  useEffect(() => {
    if (items.error.name == "TypeError") items.refresh();
  }, [items.error]);

  useEffect(() => {
    if (paymentMethods.error.name == "TypeError") paymentMethods.refresh();
  }, [paymentMethods.error]);

  useEffect(() => {
    setMethods(paymentMethods.data);
  }, [paymentMethods]);

  console.log(items);
  if (items.loading || paymentMethods.loading) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <Header title={"Print Report"} className="dont-print" />

      <IonContent fullscreen>
        <Report
          dailySales={items.data?.filter((x) => isToday(x.createdAt)) ?? null}
          dailyRefunds={items.data?.filter((x) => isToday(x.refunded)) ?? null}
          methods={methods}
        />
      </IonContent>
    </IonPage>
  );
}

function Report({
  methods,
  dailySales,
  dailyRefunds,
}: {
  methods?: PaymentMethod[] | null;
  dailySales?: Item[] | null;
  dailyRefunds?: Item[] | null;
}) {
  return (
    <main>
      <h1>Sales Today: {dailySales?.length}</h1>
      {methods?.map((x) => (
        <Sale key={x.id} method={x} dailyItems={dailySales} />
      ))}
      <h1>Refunds Today: {dailyRefunds?.length}</h1>
      {methods?.map((x) => (
        <Sale key={x.id} method={x} dailyItems={dailyRefunds} refund={true} />
      ))}
      <IonButton className="dont-print" onClick={() => window.print()}>
        Print
      </IonButton>
    </main>
  );
}

function Sale({
  method,
  dailyItems,
  refund = false,
}: {
  method: PaymentMethod;
  dailyItems?: Item[] | null;
  refund?: boolean;
}) {
  console.log("before");
  if (dailyItems == null) return null;
  console.log("after");

  return (
    <div>
      {method.name}: {refund ? "-" : ""}$
      {(
        dailyItems
          .filter((x) => x.paymentMethod.id === method.id)
          .reduce((a, c) => a + c.itemType.price, 0) / 100
      ).toFixed(2)}
    </div>
  );
}
