import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowRight, IndianRupee, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const schemes = [
  { id: "building-section", name: "Building Section Number", description: "Apply for building permit, completion certificate, and section number — fully guided by AI agents.", income_limit: null, district: null, docs: 6, category: "Housing" },
  { id: "pm-kisan", name: "PM-KISAN", description: "Income support of ₹6,000/year for small and marginal farmers in three equal installments.", income_limit: 200000, district: null, docs: 3, category: "Agriculture" },
  { id: "ayushman-bharat", name: "Ayushman Bharat", description: "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.", income_limit: 500000, district: null, docs: 4, category: "Health" },
  { id: "pm-awas-yojana", name: "PM Awas Yojana", description: "Financial assistance of ₹1.2L for construction of pucca houses for eligible rural households.", income_limit: 300000, district: null, docs: 5, category: "Housing" },
  { id: "scholarship-sc-st", name: "SC/ST Scholarship", description: "Post-matric scholarship covering tuition fees and maintenance allowance for SC/ST students.", income_limit: 250000, district: null, docs: 3, category: "Education" },
  { id: "ujjwala-yojana", name: "Ujjwala Yojana", description: "Free LPG connections with first refill and stove for women from BPL households.", income_limit: 150000, district: null, docs: 2, category: "Welfare" },
  { id: "mudra-loan", name: "MUDRA Loan", description: "Collateral-free loans up to ₹10 lakh under Shishu, Kishore, and Tarun categories.", income_limit: null, district: null, docs: 4, category: "Finance" },
  { id: "sukanya-samriddhi", name: "Sukanya Samriddhi", description: "Savings scheme for girl child with 8.2% interest and tax benefits under Section 80C.", income_limit: null, district: null, docs: 3, category: "Finance" },
  { id: "jan-dhan", name: "Jan Dhan Yojana", description: "Zero-balance bank account with RuPay debit card, ₹2 lakh accident cover, and ₹30,000 life cover.", income_limit: null, district: null, docs: 2, category: "Welfare" },
  { id: "mgnrega", name: "MGNREGA", description: "100 days of guaranteed wage employment per year for rural households at ₹267/day.", income_limit: null, district: null, docs: 3, category: "Agriculture" },
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
          <p className="text-muted-foreground font-body">{schemes.length} schemes available</p>
        </motion.div>

        {/* Chat CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/apply")}
            className="w-full sm:w-auto glass-card rounded-2xl px-6 py-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200 group"
          >
            <div className="h-10 w-10 rounded-xl gradient-saffron flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-display text-sm font-semibold text-foreground">Not sure which scheme fits you?</p>
              <p className="text-xs text-muted-foreground font-body">Chat with Akshaya Agent to discover the right scheme</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme, i) => (
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
      </div>
    </div>
  );
};

export default Schemes;
