import { getUsers } from './actions';
import { UserList } from './UserList';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const pageSize = 12;

  const { users, count } = await getUsers(page, pageSize, search);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-gold-dim pb-4">
        <div>
          <h1 className="text-3xl font-serif-latin text-gold">User Management</h1>
          <p className="text-cream-dim text-sm mt-1">Manage admin users and their access roles.</p>
        </div>
      </div>
      <UserList 
        initialUsers={users || []} 
        totalCount={count || 0}
        currentPage={page}
        pageSize={pageSize}
        searchQuery={search}
      />
    </div>
  );
}
