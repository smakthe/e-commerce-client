import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

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
        <Link to={user ? "/products" : "/"} className="mr-8 flex items-center space-x-2">
          <span className="font-bold sm:inline-block text-primary">
            ONLINE MARKETPLACE
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
                Logout
              </Button>
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="rounded-full shadow-sm flex items-center gap-2 hover:border-primary/50 group transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
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
