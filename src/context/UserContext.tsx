import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile } from "../types";
import { getLocalUid, getLocalName, setLocalName, getOrCreateUser, isUserBlocked } from "../lib/db";

interface Ctx { uid: string; name: string; profile: UserProfile | null; needsName: boolean; isBlocked: boolean; setName: (n: string) => Promise<void>; }
const C = createContext<Ctx>({ uid:"", name:"", profile:null, needsName:false, isBlocked:false, setName: async()=>{} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const uid = getLocalUid();
  const [name, setNameState] = useState(getLocalName());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isBlocked, setBlocked] = useState(false);

  async function setName(n: string) {
    setLocalName(n); setNameState(n);
    const p = await getOrCreateUser(uid, n);
    setProfile(p); setBlocked(p.isBlocked);
  }

  useEffect(() => {
    if (name) getOrCreateUser(uid, name).then(p => { setProfile(p); setBlocked(p.isBlocked); });
    const i = setInterval(() => isUserBlocked(uid).then(setBlocked), 30000);
    return () => clearInterval(i);
  }, [uid, name]);

  return (
    <C.Provider value={{ uid, name, profile, needsName: !name, isBlocked, setName }}>
      {children}
    </C.Provider>
  );
}

export const useUser = () => useContext(C);
