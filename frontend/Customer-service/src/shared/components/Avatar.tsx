interface Props {
  name: string;
  initials?: string;
  avatarUrl?: string;
  color?: string;
  size?: "sm" | "md";
}

export function Avatar({ name, initials, avatarUrl, color = "#e5e7eb", size = "md" }: Props) {
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-[12px]";

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={`${dim} rounded-full object-cover shrink-0`} />;
  }

  const letters = initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold shrink-0`}
      style={{ background: color, color: "#374151" }}
    >
      {letters}
    </div>
  );
}
