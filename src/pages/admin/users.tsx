import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";
import SingleUser from "./component/SingleUser";

const Users = () => {
  const users = api.users.getAll.useQuery().data;
  return (
    <AdminWrapper>
      <h1>User Edit</h1>
      <table className="flex flex-col gap-4">
        <tr className="flex flex-row items-center justify-between gap-4 bg-purple-300 p-2 text-black">
          <th>UserName</th>
          <th>email</th>
          <th>Role</th>
        </tr>
        {users && users.map((user) => <SingleUser key={user.id} user={user} />)}
      </table>
    </AdminWrapper>
  );
};

export default Users;