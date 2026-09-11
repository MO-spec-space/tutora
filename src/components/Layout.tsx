import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", label: "Кабінет", end: true },
  { to: "/tutor", label: "AI-репетитор" },
  { to: "/writing", label: "Письмо" },
  { to: "/snap", label: "Сфотографуй завдання" },
  { to: "/plan", label: "Мій план" },
];

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-56 border-b md:border-b-0 md:border-r rule bg-paper md:min-h-screen">
        <div className="px-5 py-6">
          <h1 className="text-xl font-serif font-semibold">Tutora</h1>
          <p className="text-xs text-ink/60 mt-1">твій особистий AI-репетитор</p>
        </div>
        <nav className="flex md:flex-col gap-1 px-3 pb-4 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-ink text-paper" : "hover:bg-ink/5 text-ink/80"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="px-5 py-4 mt-auto border-t rule text-xs text-ink/60 hidden md:block">
            <p className="truncate">{user.email}</p>
            <button onClick={signOut} className="mt-2 underline hover:text-ink">
              Вийти
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1 px-5 py-6 md:px-10 md:py-10 max-w-3xl">
        <Outlet />
      </main>
    </div>
  );
}
