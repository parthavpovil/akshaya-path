import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, ArrowRight, IndianRupee, MapPin, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schemes = [
  { id: "pm-kisan", name: "PM-KISAN", description: "Income support of ₹6,000/year for small and marginal farmers.", income_limit: 200000, district: null, docs: 3, category: "Agriculture" },
  { id: "ayushman-bharat", name: "Ayushman Bharat", description: "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.", income_limit: 500000, district: null, docs: 4, category: "Health" },
  { id: "pm-awas-yojana", name: "PM Awas Yojana", description: "Financial assistance for construction of pucca houses for eligible rural households.", income_limit: 300000, district: null, docs: 5, category: "Housing" },
  { id: "scholarship-sc-st", name: "SC/ST Scholarship", description: "Post-matric scholarship for students belonging to Scheduled Castes and Scheduled Tribes.", income_limit: 250000, district: null, docs: 3, category: "Education" },
  { id: "ujjwala-yojana", name: "Ujjwala Yojana", description: "Free LPG connections for women from Below Poverty Line households.", income_limit: 150000, district: null, docs: 2, category: "Welfare" },
  { id: "mudra-loan", name: "MUDRA Loan", description: "Collateral-free loans up to ₹10 lakh for micro and small enterprises.", income_limit: null, district: null, docs: 4, category: "Finance" },
];

const categoryColors: Record<string, string> = {
  Agriculture: "border-l-primary",
  Health: "border-l-success",
  Housing: "border-l-secondary",
  Education: "border-l-pending",
  Welfare: "border-l-destructive",
  Finance: "border-l-primary",
};

const Schemes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = schemes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mesh-gradient" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Back + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-body"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Available <span className="text-gradient-saffron">Schemes</span>
          </h1>
          <p className="text-muted-foreground font-body">{filtered.length} schemes available</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/50 border-border h-12 rounded-xl font-body"
            />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className={`glass-card rounded-2xl p-6 border-l-4 ${categoryColors[scheme.category] ?? "border-l-primary"} hover:-translate-y-1 transition-transform duration-200 cursor-pointer group`}
              onClick={() => navigate(`/apply?scheme_id=${scheme.id}`)}
            >
              <span className="text-xs font-mono text-muted-foreground mb-2 block">{scheme.category}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{scheme.name}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4 line-clamp-2">{scheme.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {scheme.income_limit && (
                  <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-mono">
                    <IndianRupee className="h-3 w-3" /> ≤ ₹{(scheme.income_limit / 1000).toFixed(0)}K
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-mono">
                  <FileText className="h-3 w-3" /> {scheme.docs} docs
                </span>
              </div>

              <Button
                size="sm"
                className="w-full gradient-saffron text-primary-foreground font-display font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">No schemes match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
