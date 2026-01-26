import { motion } from "framer-motion";
import { 
  Zap, 
  LineChart, 
  LayoutDashboard, 
  FileText, 
  Filter, 
  Download 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Quick Logging",
    description: "Add applications in seconds with smart forms. No more tedious data entry.",
  },
  {
    icon: LineChart,
    title: "Status Tracking",
    description: "Monitor progress from Applied → Screening → Interview → Offer with visual pipelines.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Analytics",
    description: "Visualize your job search progress with insightful charts and metrics.",
  },
  {
    icon: FileText,
    title: "Application Details",
    description: "Store company info, job links, application dates, salary info.",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description: "Find applications instantly by status, date, company name, or custom tags.",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download your data anytime as CSV or PDF. Your data, your control.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative" id="features">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Stay Organized</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to simplify your job search and help you land more interviews.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;