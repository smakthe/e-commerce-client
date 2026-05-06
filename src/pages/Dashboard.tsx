import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface Stats {
  total_orders: number;
  total_amount: string;           // BigDecimal serialized as string by Rails
  average_order_value: number;   // Float — serialized as JSON number
  daily_spend: { date: string; amount: string }[];  // BigDecimal → string
  status_distribution: Record<string, number>;      // integer counts
  top_products: { product_name: string; total_quantity: number }[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<Stats>("/users/me/stats");
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 min-h-[60vh]">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium tracking-wide">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto py-16 text-center text-destructive">
        {error || "Data unavailable"}
      </div>
    );
  }

  // Prep Line Chart (Spending over time)
  const lineChartData = {
    labels: stats.daily_spend.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Spent($)",
        data: stats.daily_spend.map((d) => parseFloat(d.amount)),
        borderColor: "hsl(15, 75%, 59%)",
        backgroundColor: "rgba(230, 113, 73, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Spending Timeline",
      },
    },
  };

  // Prep Doughnut Chart (Status distribution)
  const statusLabels = Object.keys(stats.status_distribution);
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#22c55e"; // green
      case "shipped":
        return "#f97316"; // orange
      case "processing":
        return "#ca8a04"; // yellow
      default:
        return "#64748b"; // slate
    }
  };

  const doughnutData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusLabels.map((s) => stats.status_distribution[s]),
        backgroundColor: statusLabels.map((s) => getStatusColor(s)),
        borderWidth: 1,
        borderColor: "hsl(39, 26%, 84%)",
      },
    ],
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Welcome, {user?.full_name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here is an overview of your lifetime spending analytics.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 bg-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lifetime Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ${parseFloat(stats.total_amount).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_orders}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${stats.average_order_value.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-border/50 h-[400px]">
          <CardHeader>
            <CardTitle>Spending Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.daily_spend.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No spending data available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 h-[400px]">
          <CardHeader>
            <CardTitle>Orders Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {statusLabels.length > 0 ? (
              <div className="h-full w-full max-w-[250px]">
                <Doughnut
                  data={doughnutData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                No data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Most Purchased</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.top_products.length > 0 ? (
            <ul className="space-y-4">
              {stats.top_products.map((p, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-light">{p.product_name}</span>
                  </div>
                  <div className="text-sm text-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    {p.total_quantity}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-4 text-muted-foreground text-sm">
              You haven't ordered any products yet.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-12 flex justify-center">
        <Link to="/orders">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-full px-8 py-6 text-lg transition-all group">
            View Complete Order History
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
