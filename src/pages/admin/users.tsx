import { useSession } from "next-auth/react";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import Layout from "../../components/Layout";
import SingleUser from "../../components/admin/SingleUser";
import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";

const Users = () => {
  const usersQuery = api.users.getAll.useQuery();
  const users = usersQuery.data;
  const [gridCols, setGridCols] = useState<string>("");
  const { data: session } = useSession();
  const getGridCols = (usersLength: number) => {
    console.log(usersLength);
    switch (usersLength) {
      case 1:
        {
          setGridCols("grid-cols-1");
        }
        break;
      case 2:
        {
          setGridCols("grid-cols-2");
        }
        break;

      default: {
        setGridCols("grid-cols-3");
      }
    }
  };
  if (!session) return;
  if (!users)
    return (
      <Layout>
        <BounceLoader />
      </Layout>
    );
  const filteredUsers = users.filter((user) => user.id != session.user?.id);
  if (usersQuery.isSuccess && gridCols == "") getGridCols(filteredUsers.length);
  return (
    <AdminWrapper>
      <h2 className="my-3 text-3xl font-bold uppercase tracking-wide text-violet-400 lg:text-5xl">
        Uživatelé
      </h2>
      {/* <table className="table-auto border-collapse border-spacing-4 p-4">
        <thead>
          <tr className="bg-purple-300 text-black">
            <th>Avatar</th>
            <th>UserName</th>
            <th>email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers &&
            filteredUsers.map((user) => (
              <SingleUser key={user.id} user={user} />
            ))}
        </tbody>
      </table> */}
      <div className={`grid grid-cols-1 gap-2 md:${gridCols}`}>
        {filteredUsers &&
          filteredUsers.map((user) => <SingleUser key={user.id} user={user} />)}
      </div>
    </AdminWrapper>
  );
};

export default Users;
