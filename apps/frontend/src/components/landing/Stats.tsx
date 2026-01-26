import { motion } from "framer-motion";

const stats = [
  {
    value: "10K+",
    label: "Applications Tracked",
    description: "By job seekers worldwide",
  },
  {
    value: "5+",
    label: "Hours Saved Weekly",
    description: "On average per user",
  },
  {
    value: "100%",
    label: "Free Forever",
    description: "No hidden fees or limits",
  },
  {
    value: "Open",
    label: "Source",
    description: "Transparent & community-driven",
  },
];

const Stats = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="glass-card p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;