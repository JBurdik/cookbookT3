import type { User } from "@prisma/client";
import { Role } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { api } from "../../utils/api";

function SingleUser({ user }: { user: User }) {
  const [role, setRole] = useState<Role>(user.role);
  const updateRole = api.users.setRole.useMutation({
    onSuccess(data) {
      console.log("updated data:", data.newRole);
      setRole(data.newRole.role);
    },
  });
  return (
    // <tr>
    //   <td>
    //     {user.image ? (
    //       <img src={user.image} className="h-10 w-10 rounded-full" />
    //     ) : (
    //       <FaUser />
    //     )}
    //   </td>
    //   <td>{user.name}</td>
    //   <td>{user.email}</td>
    //   <td>
    //     <select
    //       className="bg-white/70 p-2"
    //       value={role}
    //       onChange={(e) =>
    //         updateRole.mutate({
    //           userId: user.id,
    //           newRole: e.target.value as Role,
    //         })
    //       }
    //     >
    //       <option value={Role.ADMIN}>{Role.ADMIN}</option>
    //       <option value={Role.USER}>{Role.USER}</option>
    //     </select>
    //   </td>
    // </tr>
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-white">
      {user.image ? (
        <Image
          src={user.image}
          alt="User Image"
          height={96}
          width={96}
          className={`rounded-full border-2 ${
            role === Role.USER ? "border-green-600" : "border-red-600"
          }`}
        />
      ) : (
        <FaUser />
      )}
      <span>{user.name}</span>
      <span>{user.email}</span>
      <select
        className="bg-white/40 p-2"
        value={role}
        onChange={(e) =>
          updateRole.mutate({
            userId: user.id,
            newRole: e.target.value as Role,
          })
        }
      >
        <option value={Role.ADMIN}>{Role.ADMIN}</option>
        <option value={Role.USER}>{Role.USER}</option>
      </select>
    </div>
  );
}

export default SingleUser;
