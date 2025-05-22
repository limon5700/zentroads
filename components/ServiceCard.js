export default function ServiceCard({ icon, title }) {
  return (
    <div className="p-6 border rounded-2xl text-center shadow-md bg-white hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}
