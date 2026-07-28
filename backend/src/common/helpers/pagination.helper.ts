export function buildPaginationQuery(
  page = 1,
  limit = 10,
  search = '',
  searchField = 'name',
  sortField = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        [searchField]: {
          contains: search,
          mode: 'insensitive',
        },
      }
    : {};

  const orderBy = { [sortField]: sortOrder };
  return { skip, take: limit, where, orderBy };
}
