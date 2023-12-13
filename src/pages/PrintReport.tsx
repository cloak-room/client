import _ from "lodash";
import useData, {
  useDaily,
  useItems,
  usePaymentMethods,
  useStatistics,
} from "../utils/useData";
import { PaymentMethod, Item, User } from "../utils/types";

import {
  IonButton,
  IonContent,
  IonPage,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { userInfo } from "os";
import { useUserCtx } from "../context/UserContext";
import { apiUrl } from "../App";
import { options } from "ionicons/icons";

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

async function getUsers() {
  const url = `${apiUrl}/users`;
  const response = await fetch(url);
  console.log(response);

  const data: User[] = await response.json();
  console.log(data);

  return data;
}

export default function PrintReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const items = useItems({});
  const paymentMethods = usePaymentMethods();

  const [methods, setMethods] = useState<PaymentMethod[] | null>();

  const { data: users, loading, error, refresh } = useData<User[]>(getUsers);
  const [reportUser, setReportUser] = useState<User | undefined>(undefined);

  const stats = useStatistics({ userID: reportUser?.id });
  console.log("user", stats);

  useEffect(() => {
    setMethods(paymentMethods.data);
  }, [paymentMethods]);

  console.log(items);
  if (items.loading || paymentMethods.loading) {
    return <div>Loading...</div>;
  }
  const handleChange = (event: Event) =>
    setReportUser(JSON.parse((event.target as HTMLInputElement).value));

  return (
    <IonPage>
      <Header backButton title={"Print Report"} className="dont-print" />

      <IonContent fullscreen>
        <IonSelect
          value={reportUser}
          onIonChange={handleChange}
          placeholder={"Select Report User"}
          className="dont-print"
        >
          {users?.map((option) => (
            <IonSelectOption key={option.id} value={JSON.stringify(option)}>
              {option.username}
            </IonSelectOption>
          ))}
        </IonSelect>
        <Report user={reportUser} stats={stats.data} methods={methods} />
      </IonContent>
    </IonPage>
  );
}

function Report({
  user,
  methods,
  stats,
}: {
  user?: User;
  methods?: PaymentMethod[] | null;
  stats?: any | null;
}) {
  if (user == undefined) return null;
  const totals = stats?.totals;
  return (
    <main>
      <h1>Sales for {user.username}</h1>
      <h1>Sales Today: ${totals?.total?.totalPrice / 100}</h1>
      {/* {methods?.map((x) => (
        <Sale key={x.id} method={x} dailyItems={dailySales} />
      ))} */}
      <h1>Refunds Today: ${totals?.refunded?.totalPrice / 100}</h1>
      {/* {methods?.map((x) => (
        <Sale key={x.id} method={x} dailyItems={dailyRefunds} refund={true} />
      ))} */}
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
