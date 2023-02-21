import type { User } from "@prisma/client";
import { Role } from "@prisma/client";
import { useState } from "react";
import { api } from "../../../utils/api";

function SingleUser({ user }: { user: User }) {
  const [role, setRole] = useState<Role>(user.role);
  const updateRole = api.users.setRole.useMutation({
    onSuccess(data) {
      console.log("updated data:", data.newRole);
      setRole(data.newRole.role);
    },
  });
  return (
    <tr className="flex flex-row items-center justify-between gap-4 border-b border-purple-300 p-2">
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <select
          className="bg-white/70 p-2"
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
      </td>
    </tr>
  );
}

export default SingleUser;
