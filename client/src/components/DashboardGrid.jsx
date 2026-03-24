export default function DashboardGrid({ children }) {
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
      {children}
    </div>
  );
}