"use client";

import { useEffect, useState } from "react";
import { useSession, updateSession } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setName(d.name || "");
        setImage(d.image || null);
      });
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image, currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Update failed"); return; }
    setMsg("Profile updated");
    setCurrentPassword("");
    setNewPassword("");
  };

  if (!session?.user) return <main className="p-8">Please sign in.</main>;

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Profile Management</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-green-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-green-100">
            {image ? (
              <Image src={image} alt="avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-700 text-2xl">
                {(name || "U")[0]}
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={session.user.email || ""} disabled className="w-full p-2 border rounded bg-gray-100" />
        </div>
        <hr />
        <h2 className="font-semibold text-green-800">Change Password</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">Save</button>
      </form>
    </main>
  );
}