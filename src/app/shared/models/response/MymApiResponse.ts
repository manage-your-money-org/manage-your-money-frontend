export interface MymApiResponse<T> {

  status: number;
  message: string;
  body: T;
}
