import { motion } from "framer-motion";
import { HelpCircle, Clock, FileSpreadsheet, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    title: "Lost track of which companies you applied to?",
    description: "Sending dozens of applications makes it easy to forget who you've contacted.",
  },
  {
    icon: Clock,
    title: "Forgot to follow up on important applications?",
    description: "Missing follow-up deadlines can cost you opportunities.",
  },
  {
    icon: FileSpreadsheet,
    title: "Using messy spreadsheets that don't scale?",
    description: "Spreadsheets get overwhelming as your job search grows.",
  },
  {
    icon: TrendingDown,
    title: "Missing opportunities due to poor organization?",
    description: "Without a system, great opportunities slip through the cracks.",
  },
];

const Problems = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Job Hunting Shouldn't Be{" "}
            <span className="gradient-text">Chaos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sound familiar? You're not alone. Most job seekers struggle with the same challenges.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full transition-all duration-300 hover:border-primary/50 hover:glow-border">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <problem.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;