type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  onClick?: () => void;
};

export function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-700 focus:ring-stone-500",
    secondary: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 focus:ring-stone-400",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
