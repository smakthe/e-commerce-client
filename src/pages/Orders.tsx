import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
        const data = await api.get<OrderItem[]>(`/orders/${order.id}/order_items`);
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch order items", err);
      } finally {
        setLoadingItems(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <div className="glass-panel" style={{ overflow: "hidden" }}>
      <button
        onClick={toggleExpand}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          textAlign: "left",
          color: "inherit",
          fontFamily: "inherit",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          cursor: "pointer",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "0.25rem" }}>Order #{order.id}</h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
            }}
          >
            {new Date(order.order_date).toLocaleDateString()} &middot;{" "}
            {order.items_count} items
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.25rem",
              color: "var(--color-accent-primary)",
            }}
          >
            ${parseFloat(order.total_amount).toFixed(2)}
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              fontWeight: "bold",
              background:
                order.status === "delivered" || order.status === "completed"
                  ? "rgba(0,255,100,0.1)"
                  : "rgba(255,150,0,0.1)",
              color:
                order.status === "delivered" || order.status === "completed"
                  ? "var(--color-success)"
                  : "orange",
              marginTop: "0.5rem",
            }}
          >
            {order.status}
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid var(--color-border-glass)" }}>
          {loadingItems ? (
            <div style={{ padding: "1rem 0", color: "var(--color-text-secondary)" }}>Loading items...</div>
          ) : items.length > 0 ? (
            <div style={{ marginTop: "1rem" }}>
              <h4 style={{ marginBottom: "0.75rem", color: "var(--color-text-secondary)" }}>Items Details</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map((item) => (
                  <li key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                        Qty: {item.quantity} x ${parseFloat(item.unit_price).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                      ${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{ padding: "1rem 0", color: "var(--color-text-secondary)" }}>No items found.</div>
          )}
        </div>
      )}
    </div>
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
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Loading orders...
      </div>
    );

  return (
    <div
      className="container animate-enter"
      style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
    >
      <h1 className="text-gradient" style={{ marginBottom: "2rem" }}>
        Order History
      </h1>

      {orders.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--color-text-secondary)",
          }}
        >
          You have no orders yet. Start exploring our products!
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
