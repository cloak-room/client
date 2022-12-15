import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useDaily, useItemTypes, usePaymentMethods } from "../utils/useData";
import { PaymentMethod, Item } from "../utils/types";

import { IonButton } from "@ionic/react";
export default function PrintReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyItems = useDaily();
  const paymentMethods = usePaymentMethods();

  if (dailyItems.loading || paymentMethods.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Sales Today: {dailyItems.data?.length}</div>
      {paymentMethods.data?.map((x) => (
        <Sale key={x.id} method={x} dailyItems={dailyItems.data} />
      ))}
      <IonButton className="dont-print" onClick={() => window.print()}>
        Print
      </IonButton>
    </div>
  );
}

function Sale({
  method,
  dailyItems,
}: {
  method: PaymentMethod;
  dailyItems: Item[];
}) {
  return (
    <div>
      {method.name}: $
      {(
        dailyItems
          .filter((x) => x.paymentMethod.id === method.id)
          .reduce((a, c) => a + c.itemType.price, 0) / 100
      ).toFixed(2)}
    </div>
  );
}
