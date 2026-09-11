import { UserAvatar } from "@/components/UserAvatar";

interface AdminHeaderProps {
  title: string;
  discordId: string;
  discordUsername: string;
  discordAvatar: string | null;
  role: string | null;
}

export function AdminHeader({ title, discordId, discordUsername, discordAvatar, role }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-outbreak-line bg-outbreak-bg px-6 py-5">
      <h1 className="font-display text-2xl text-white">{title}</h1>
      <div className="flex items-center gap-3 text-sm">
        <UserAvatar discordId={discordId} avatarHash={discordAvatar} username={discordUsername} size={32} />
        <div>
          <p className="text-white">{discordUsername}</p>
          <p className="text-xs text-outbreak-ash">{role}</p>
        </div>
      </div>
    </div>
  );
}
