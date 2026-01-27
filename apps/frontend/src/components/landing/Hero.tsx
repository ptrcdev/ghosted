import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "../../components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-glow-gradient animate-pulse-glow" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              100% Free & Open Source
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Track Every Application.{" "}
            <span className="gradient-text">Land Your Dream Job.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance"
          >
            Stop losing track of job applications. Organize, monitor, and manage 
            your job search in one beautiful dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="group glow-effect text-base px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8">
              <Play className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-xl blur-2xl" />
              
              {/* Dashboard mockup */}
              <div className="relative glass-card p-2 glow-border">
                <div className="bg-card rounded-lg overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-md bg-background/50 text-xs text-muted-foreground">
                        ghosted.ptrclmd.dev
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="p-6 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "Total Applied", value: "47", color: "text-primary" },
                        { label: "In Review", value: "12", color: "text-yellow-400" },
                        { label: "Interviews", value: "8", color: "text-blue-400" },
                        { label: "Offers", value: "3", color: "text-green-400" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-secondary/30 rounded-lg p-4">
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Application rows */}
                    <div className="space-y-2">
                      {[
                        { company: "Stripe", role: "Senior Frontend", status: "Interview", statusColor: "bg-blue-500" },
                        { company: "Vercel", role: "Product Engineer", status: "Applied", statusColor: "bg-primary" },
                        { company: "Linear", role: "Full Stack Dev", status: "Offer!", statusColor: "bg-green-500" },
                      ].map((app) => (
                        <div key={app.company} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                              {app.company[0]}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{app.company}</p>
                              <p className="text-xs text-muted-foreground">{app.role}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${app.statusColor} text-white`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;