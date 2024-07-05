import React, { useState, useEffect } from "react";
import { Card, Spinner } from "flowbite-react";

interface DatabaseStatsProps {
  backendUrl: string;
}

interface TableStats {
  name: string;
  count: number;
  columns: number;
}

const DatabaseStats: React.FC<DatabaseStatsProps> = ({ backendUrl }) => {
  const [stats, setStats] = useState<TableStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [backendUrl]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}`);
      const tables = await response.json();

      const tableStats = await Promise.all(
        tables.map(async (tableName: string) => {
          try {
            const dataResponse = await fetch(`${backendUrl}/${tableName}`);
            const data = await dataResponse.json();
            const columns = data.length > 0 ? Object.keys(data[0]).length : 0;
            return {
              name: tableName,
              count: data.length,
              columns: columns,
            };
          } catch {
            return { name: tableName, count: 0, columns: 0 };
          }
        }),
      );

      setStats(tableStats);
    } catch (error) {
      console.error("Failed to fetch database stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const totalRecords = stats.reduce((sum, s) => sum + s.count, 0);
  const totalTables = stats.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Total Tables</p>
          <p className="text-3xl font-bold text-blue-600">{totalTables}</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Total Records</p>
          <p className="text-3xl font-bold text-green-600">{totalRecords}</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Avg Records/Table</p>
          <p className="text-3xl font-bold text-purple-600">
            {totalTables > 0 ? (totalRecords / totalTables).toFixed(0) : 0}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseStats;
