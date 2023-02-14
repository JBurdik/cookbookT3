import type { Session } from "next-auth";

export default function isAdmin(session: Session) {
  if (session.user?.role === "ADMIN") {
    return true;
  } else return false;
}
