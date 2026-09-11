import Image from "next/image";
import clsx from "clsx";

interface UserAvatarProps {
  discordId: string;
  avatarHash: string | null;
  username: string;
  size?: number;
  className?: string;
}

export function UserAvatar({ discordId, avatarHash, username, size = 36, className }: UserAvatarProps) {
  const src = avatarHash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(discordId) % 5n)}.png`;

  return (
    <Image
      src={src}
      alt={`Avatar de ${username}`}
      width={size}
      height={size}
      className={clsx("rounded-full border border-outbreak-line", className)}
    />
  );
}
