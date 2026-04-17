import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import Dashboard from "./Dashboard";

const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background">
      {/* Decorative gradient orb background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_15%_50%,_rgba(230,113,73,0.15),_transparent_25%),_radial-gradient(circle_at_85%_30%,_rgba(228,219,202,0.15),_transparent_25%)]" />

      {/* Hero Section */}
      <section className="container mx-auto relative z-10 px-4 md:px-6 pt-24 pb-12 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-foreground font-serif max-w-4xl mx-auto">
          Elevating{" "}
          <span className="text-primary italic font-serif">Commerce</span> for
          the Modern Era.
        </h1>
        <p className="max-w-[42rem] mt-6 leading-relaxed text-muted-foreground sm:text-xl font-sans">
          Discover a curated marketplace demanding zero compromises. Fast
          checkout, predictive intelligence, and unparalleled logistics
          engineered to deliver peace of mind.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/products">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-semibold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200"
            >
              Start Exploring
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 text-lg font-semibold rounded-full border-2 hover:bg-secondary/20 transition-colors"
            >
              Create Account
            </Button>
          </Link>
        </div>

        {/* High-Trust Indicator Bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm md:text-base font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Secure Neural Checkout
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Free Global Logistics
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            30-Day Return Guarantee
          </div>
        </div>
      </section>

      {/* Bento Grid Layout Section */}
      <section className="container mx-auto relative z-10 px-4 md:px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
          {/* Main Module (Span 2 Cols) */}
          <Card className="md:col-span-2 border-border/50 bg-secondary/10 hover:border-primary/40 transition-colors overflow-hidden group">
            <div className="h-full flex flex-col md:flex-row items-center p-8 gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Featured
                </div>
                <h3 className="text-3xl font-serif font-bold">
                  Premium Electronics
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experience next-generation technology designed for the
                  absolute peak of utility and aesthetic perfection. Upgraded
                  silicon directly to your doorstep.
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-4 text-primary font-semibold hover:underline"
                >
                  Shop Electronics &rarr;
                </Link>
              </div>
              <div className="flex-1 h-full min-h-[200px] bg-gradient-to-tr from-card to-background rounded-xl border border-border/30 shadow-inner flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                <div className="w-24 h-24 bg-primary/20 rounded-full blur-xl absolute" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-primary z-10 relative opacity-80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                  <line x1="20" y1="9" x2="23" y2="9"></line>
                  <line x1="20" y1="14" x2="23" y2="14"></line>
                  <line x1="1" y1="9" x2="4" y2="9"></line>
                  <line x1="1" y1="14" x2="4" y2="14"></line>
                </svg>
              </div>
            </div>
          </Card>

          {/* Social Proof Module */}
          <Card className="border-border/50 bg-primary text-primary-foreground flex items-center justify-center p-8 text-center shadow-lg shadow-primary/20">
            <div className="space-y-3">
              <h3 className="text-5xl font-extrabold tracking-tighter">1M+</h3>
              <p className="text-primary-foreground/80 font-medium tracking-wide uppercase text-sm">
                Successful Deliveries
              </p>
              <div className="flex justify-center -space-x-2 pt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary-foreground/20 border-2 border-primary"
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Precision Analytics Teaser Module */}
          <Card className="border-border/50 bg-secondary/10 hover:border-primary/40 transition-colors p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold">
                Predictive Analytics
              </h3>
              <p className="text-muted-foreground text-sm">
                Unlock your proprietary dashboard after checkout to map your
                order velocity.
              </p>
            </div>
            <div className="mt-6 flex items-end gap-2 h-20 opacity-60">
              <div className="w-1/4 bg-primary rounded-t h-1/4" />
              <div className="w-1/4 bg-primary rounded-t h-1/2" />
              <div className="w-1/4 bg-primary rounded-t h-3/4" />
              <div className="w-1/4 bg-primary rounded-t h-full" />
            </div>
          </Card>

          {/* Curated Style Module (Span 2 Cols) */}
          <Card className="md:col-span-2 border-border/50 bg-secondary/10 hover:border-primary/40 transition-colors overflow-hidden">
            <div className="h-full w-full py-8 px-10 flex flex-col justify-center bg-[linear-gradient(to_right,theme('colors.background')_0%,theme('colors.secondary.DEFAULT/10')_100%)]">
              <h3 className="text-3xl font-serif font-bold">Refined Apparel</h3>
              <p className="mt-2 text-muted-foreground max-w-md">
                Hand-selected textiles that move with fluid anonymity. From
                boardroom assertions to weekend escapism.
              </p>
              <Link
                to="/products"
                className="inline-block mt-6 text-foreground font-semibold hover:text-primary transition-colors"
              >
                Shop Apparel &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
