import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  status: string;
  total_amount: string;
  items_count: number;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
}

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const toggleExpand = async () => {
    if (!expanded && items.length === 0) {
      setLoadingItems(true);
      try {
        const data = await api.get<OrderItem[]>(
          `/orders/${order.id}/order_items`,
        );
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch order items", err);
      } finally {
        setLoadingItems(false);
      }
    }
    setExpanded(!expanded);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "shipped":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "processing":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "pending":
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/30">
      <button
        onClick={toggleExpand}
        className="w-full text-left bg-transparent border-none p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div>
          <h3 className="mb-1 text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(order.order_date).toLocaleDateString()} &middot;{" "}
            {order.items_count} items
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="font-bold text-xl text-primary">
            ${parseFloat(order.total_amount).toFixed(2)}
          </div>
          <div
            className={`mt-2 inline-block px-3 py-1 rounded-full text-xs uppercase font-bold ${getStatusColor(order.status)}`}
          >
            {order.status}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-0 border-t border-border bg-muted/10">
          {loadingItems ? (
            <div className="py-4 text-muted-foreground animate-pulse text-sm">
              Loading items...
            </div>
          ) : items.length > 0 ? (
            <div className="mt-4">
              <h4 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Items Details
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity} &times; $
                        {parseFloat(item.unit_price).toFixed(2)}
                      </div>
                    </div>
                    <div className="font-semibold text-foreground">
                      $
                      {(item.quantity * parseFloat(item.unit_price)).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-4 text-muted-foreground text-sm">
              No items found.
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await api.get<Order[]>("/orders");
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading)
    return (
      <div className="container mx-auto py-16 text-center text-muted-foreground animate-pulse">
        Loading orders...
      </div>
    );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Order History
        </h1>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          You have no orders yet. Start exploring our products!
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
