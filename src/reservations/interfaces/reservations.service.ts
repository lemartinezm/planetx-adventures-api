export interface CreateReservationParams {
  userId: number;
  toDate: Date;
  qrCode?: string;
}

export interface CreateGuestReservationParams {
  name: string;
  email: string;
  toDate: Date;
}
