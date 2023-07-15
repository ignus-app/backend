import { PaginateFunction } from '@core/dtos/paginate-function'
import { PaginateOptions } from '@core/dtos/paginate-options'

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (
    model: any,
    options: PaginateOptions,
    args: any = { where: undefined },
  ) => {
    const page = Number(options?.page || defaultOptions?.page) || 1
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10

    const skip = page > 0 ? perPage * (page - 1) : 0

    const [total, data] = await Promise.all([
      model.count(),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ])

    const lastPage = Math.ceil(total / perPage)

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    }
  }
}
