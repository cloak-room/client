export type Item = {
  id: number;
  ownerName: string;
  ownerPhoneNumber: string;
  comments: string;
  collected: string | null;
  createdAt: string;
  refunded: string | null;
  refundedBy: User | null;
  user: User;
  itemType: ItemType;
  imageLocation: string | null;
  storageLocation: string;
  paymentMethod: PaymentMethod;
};

export type ItemResult = {
  data: Item[];
  pageSize: number;
  pageCount: number;
  pageNumber: number;
  count: number;
};

export type ItemType = {
  id: number;
  name: string;
  price: number;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  hash?: string;
  username: string;
};

export type PaymentMethod = {
  id: number;
  name: string;
};
