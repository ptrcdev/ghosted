import { motion } from "framer-motion";
import { Plus, Eye, Trophy } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Plus,
    title: "Log Your Applications",
    description: "Add job applications in seconds. Include company, role, status.",
  },
  {
    step: "02",
    icon: Eye,
    title: "Track Your Progress",
    description: "Watch your applications move through the pipeline. Never lose track of where you stand.",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Land Your Dream Job",
    description: "Stay organized, follow up on time, and celebrate when offers start rolling in.",
  },
];

const HowItWorks = () => {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple as{" "}
            <span className="gradient-text">1, 2, 3</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in minutes. No learning curve, no complex setup.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;