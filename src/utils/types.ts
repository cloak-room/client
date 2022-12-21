export type Item = {
  id: number;
  ownerName: string;
  ownerPhoneNumber: string;
  comments: string;
  collected: string | null;
  createdAt: string;
  refunded: string | null;
  user: User;
  itemType: ItemType;
  storageLocation: string;
  paymentMethod: PaymentMethod;
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
