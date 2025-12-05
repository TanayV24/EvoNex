import { Layers, TableProperties, Clock } from "lucide-react";

const reasons = [
  {
    icon: Layers,
    title: "All-in-One Unified System",
    description: "Replace 10+ HR tools with one powerful platform. Attendance, payroll, tasks, leaves — everything connected seamlessly.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: TableProperties,
    title: "Eliminates Spreadsheets",
    description: "No more Excel nightmares. Automated calculations, real-time data sync, and zero manual errors. Your data, always accurate.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Reduces Manual HR Time",
    description: "Automate repetitive tasks and free up your HR team. Spend time on people, not paperwork. Save 20+ hours every week.",
    gradient: "from-cyan-500 to-cyan-600",
  },
];

const WhyWorkOSSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500 mb-4">
            Why WorkOS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Built for modern{" "}
            <span className="gradient-text">HR teams</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We've reimagined workforce management from the ground up. Here's why teams love WorkOS.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="group text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${reason.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <reason.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {reason.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-16 lg:mt-24 glass-card rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "85%", label: "Less admin time" },
              { value: "100%", label: "Payroll accuracy" },
              { value: "3x", label: "Faster onboarding" },
              { value: "60%", label: "Cost reduction" },
            ].map((stat, index) => (
              <div key={stat.label} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkOSSection;
