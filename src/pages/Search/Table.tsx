import {
  IonGrid,
  IonRow,
  IonAccordionGroup,
  IonCol,
  IonAccordion,
  IonButton,
  IonCard,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { Item } from "../../utils/types";
import React, { useState } from "react";

import { Link, useLocation } from "react-router-dom";

import PhotoModal from "../../components/PhotoModal";

function PaginationBar({
  setPage,
  currentPage,
  pageCount,
}: {
  setPage: (x: any) => any;
  currentPage: number;
  pageCount: number;
}) {
  return (
    <IonRow className="ion-justify-content-between">
      <span>
        <IonButton
          color="light"
          onClick={() => setPage(1)}
          disabled={currentPage === 1}
        >
          First
        </IonButton>
        <IonButton
          color="light"
          onClick={() => setPage((x: number) => (x > 1 ? x - 1 : 1))}
          disabled={currentPage === 1}
        >
          Prev
        </IonButton>
      </span>
      <p>
        {currentPage}/{pageCount}
      </p>
      <span>
        <IonButton
          color="light"
          onClick={() =>
            setPage((x: number) => (x < pageCount ? x + 1 : pageCount))
          }
          disabled={currentPage === pageCount}
        >
          Next
        </IonButton>
        <IonButton
          color="light"
          onClick={() => setPage(pageCount)}
          disabled={currentPage === pageCount}
        >
          Last
        </IonButton>
      </span>
    </IonRow>
  );
}

export default function Table({
  columns,
  data,
  loading,
  error,
  functions,
  setPage,
  currentPage,
  pageCount,
}: {
  columns: {
    item: string;
    label: string;
    className: string;
    displayFunction?: (x: any) => string;
  }[];
  data?: Item[] | null;
  loading: boolean;
  error: Error;
  functions: any;
  setPage: (x: any) => any;
  currentPage: number;
  pageCount: number;
}) {
  const [isPhotoOpen, setIsPhotoOpen] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  console.log(data);
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <PhotoModal {...{ isPhotoOpen, setIsPhotoOpen, photo }} />
      <IonGrid>
        <IonRow>
          {columns.map((col) => (
            <IonCol className={`header ${col.className}`} key={col.label}>
              {col.label}
            </IonCol>
          ))}
        </IonRow>
        <IonAccordionGroup>
          {data?.map((item: any) => (
            <IonAccordion
              key={item.id}
              value={`Item-${item.id}`}
              className="row"
            >
              <IonRow slot="header" key={item.id}>
                {columns?.map((col) => (
                  <IonCol key={col.label} className={col.className}>
                    {col.item === "actions" ? (
                      <div>
                        <IonButton
                          size="small"
                          shape="round"
                          color="success"
                          fill={item.collected ? "outline" : "solid"}
                          onClick={() =>
                            functions.handleCollect(
                              item,
                              item.collected as boolean
                            )
                          }
                        >
                          Collect{item.collected && "ed"}
                        </IonButton>
                      </div>
                    ) : (
                      (col.displayFunction
                        ? col.displayFunction(item[col.item])
                        : item[col.item]) ?? <IonLabel>N / A</IonLabel>
                    )}
                  </IonCol>
                ))}
              </IonRow>
              <div slot="content" className="detail-card">
                <IonCard>
                  <IonList class="expandedRowList">
                    {columns?.map((col, index) =>
                      col.item !== "actions" ? (
                        <IonItem
                          key={col.label}
                          color={index % 2 ? "medium" : "light"}
                        >
                          {/* {key === "user"} */}
                          <IonLabel>{`${col.label}:`}</IonLabel>
                          <IonLabel>
                            {(col.displayFunction
                              ? col.displayFunction(item[col.item])
                              : item[col.item]) ?? <p>N / A</p>}
                          </IonLabel>
                        </IonItem>
                      ) : (
                        <IonItem key="edit" color="medium">
                          <IonLabel>
                            <IonButton
                              size="small"
                              shape="round"
                              color="danger"
                              fill={item.refunded ? "outline" : "solid"}
                              onClick={() =>
                                functions.handleRefund(
                                  item,
                                  item.refunded as boolean
                                )
                              }
                            >
                              Refund{item.refunded && "ed"}
                            </IonButton>
                            <Link to={`editDevice/${item.id}`}>
                              <IonButton
                                size="small"
                                shape="round"
                                color="warning"
                                fill="solid"
                              >
                                Edit
                              </IonButton>
                            </Link>
                          </IonLabel>
                          <IonLabel>
                            {item.imageLocation && (
                              <IonButton
                                size="small"
                                shape="round"
                                color="success"
                                fill={"solid"}
                                onClick={() => {
                                  console.log(item);
                                  setPhoto(`photos/${item.imageLocation}`);
                                  setIsPhotoOpen(true);
                                }}
                              >
                                View Image
                              </IonButton>
                            )}
                          </IonLabel>
                        </IonItem>
                      )
                    )}
                  </IonList>
                </IonCard>
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>

        <PaginationBar {...{ currentPage, setPage, pageCount }} />
      </IonGrid>
    </>
  );
}
