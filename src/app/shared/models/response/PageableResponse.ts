export interface PageableResponse<T> {

  totalPages: number,
  totalElements: number,
  first: true,
  last: true,
  size: number,
  content: T[],
  number: number,
  sort: {
    empty: boolean,
    unsorted: boolean,
    sorted: boolean
  },
  numberOfElements: number,
  pageable: {
    offset: number,
    sort: {
      empty: boolean,
      unsorted: boolean,
      sorted: boolean
    },
    paged: boolean,
    unpaged: boolean,
    pageNumber: number,
    pageSize: number
  },
  empty: boolean
}
