import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const SHIPPING_COST = items.length > 0 ? (total > 500 ? 0 : 25) : 0;
  const FINAL_TOTAL = total + SHIPPING_COST;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsCheckingOut(true);
    try {
      const result = await api.post<{ order_id: number; message: string }>(
        "/checkout",
        {
          total_amount: FINAL_TOTAL,
          items: items.map((item) => ({
            product_id: item.productId,
            quantity:   item.quantity,
            unit_price: item.price,
          })),
        }
      );

      clearCart();
      toast.success("Order placed!", {
        description: `Order #${result.order_id} confirmed. Thank you for your purchase!`,
      });
      navigate("/orders");
    } catch (err: any) {
      toast.error("Checkout failed", {
        description: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 flex flex-col items-center text-center min-h-[60vh] justify-center">
        <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Looks like you haven't added anything yet.
        </p>
        <Button
          onClick={() => navigate("/products")}
          size="lg"
          className="rounded-full px-8 h-14"
        >
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-serif font-extrabold mb-8 tracking-tight text-foreground">
          Review Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items Column */}
          <div className="lg:w-2/3 space-y-6">
            {items.map((item) => (
              <Card
                key={item.productId}
                className="border-border/60 hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Generic product placeholder */}
                  <div className="w-24 h-24 bg-gradient-to-tr from-secondary to-secondary/40 rounded-lg flex items-center justify-center shrink-0 border border-border/50">
                    <span className="text-3xl opacity-50">🛍️</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-border rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-4 py-2 hover:bg-secondary transition-colors font-medium text-muted-foreground"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-4 py-2 hover:bg-secondary transition-colors font-medium text-muted-foreground"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2 shrink-0 sm:w-24">
                      <span className="font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs text-destructive/80 hover:text-destructive hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="lg:w-1/3">
            <Card className="border-border/60 sticky top-24 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium text-foreground">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Shipping</span>
                    {SHIPPING_COST === 0 ? (
                      <span className="font-medium text-green-600">Free</span>
                    ) : (
                      <span className="font-medium text-foreground">
                        ${SHIPPING_COST.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {SHIPPING_COST > 0 && (
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      Free shipping unlocks on orders over $500!
                    </p>
                  )}
                </div>

                <div className="my-6 border-b border-border border-dashed" />

                <div className="flex justify-between items-end mb-8">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-3xl text-primary">
                    ${FINAL_TOTAL.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:scale-100"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Placing Order..." : "Proceed to Checkout"}
                </Button>

                <div className="mt-6 flex justify-center items-center gap-2 text-xs text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Guaranteed secure encrypted checkout
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
