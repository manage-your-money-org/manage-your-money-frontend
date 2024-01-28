export interface FilterRequest {

  categoryKeys?: string[],
  paymentMethodKeys?: string[],
  dateRange?: {
        first: number,
        second: number
    }
}
