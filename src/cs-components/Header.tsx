type HeaderProps = {
  title: string;
  userLabel: string;
  avatarText: string;
};

export default function Header({
  title,
  userLabel,
  avatarText,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="page-title">{title}</div>
      <div className="user-profile">
        <span>{userLabel}</span>
        <div className="avatar">{avatarText}</div>
      </div>
    </header>
  );
}