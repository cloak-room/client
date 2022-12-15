export type Item = {
  id: number;
  ownerName: string;
  ownerPhoneNumber: string;
  comments: string;
  collected: boolean;
  createdAt: Date;
  user: User;
  itemType: ItemType;
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
};

export type PaymentMethod = {
  id: number;
  name: string;
};
