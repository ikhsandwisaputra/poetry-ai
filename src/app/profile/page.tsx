'use client'
// pages/profile.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthUserContext";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
        window.alert('belum login ente')
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
      <div style={{ width: 520, padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
        <h1>Profile</h1>
        <p>Welcome, {user.displayName}</p>
        <img src={user.photoURL ?? "/avatar.png"} alt="avatar" style={{ width: 96, borderRadius: "50%" }} />
        <dl>
          <dt>Nama</dt>
          <dd>{user.displayName}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>UID</dt>
          <dd>{user.uid}</dd>
        </dl>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => router.push("/")} style={{ marginRight: 8 }}>
            Home
          </button>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    </main>
  );
}
