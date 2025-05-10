// src/pages/apps/location/ville/components/table.tsx

import { useAppSelector } from "@/hooks/redux";

const CityTable = () => {
  const { cities, loading } = useAppSelector((state) => state.city);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="border rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Liste des villes</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Province</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city: any) => (
            <tr key={city.id}>
              <td className="border px-4 py-2">{city.name}</td>
              <td className="border px-4 py-2">{city.provinceName || city.province}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
