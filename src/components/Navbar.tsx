import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import cartIcon from "../assets/cart.svg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link
          to={user ? "/products" : "/"}
          className="mr-8 flex items-center space-x-2"
        >
          <span className="font-bold sm:inline-block text-primary">
            ECOMART MARKETPLACE
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Button variant="link">Dashboard</Button>
              </Link>
              <Button variant="link" onClick={handleLogout}>
                Sign Out
              </Button>
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="rounded-full shadow-sm flex items-center gap-2 hover:border-primary/50 group transition-all"
                >
                  <img
                    src={cartIcon}
                    alt="Cart"
                    className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all"
                  />
                  {items.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                    <span className="font-semibold text-foreground">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button variant="link">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
