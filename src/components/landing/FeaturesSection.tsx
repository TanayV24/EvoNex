import { 
  Clock, 
  CheckSquare, 
  Calendar, 
  Wallet, 
  CreditCard, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Attendance Engine",
    description: "Real-time tracking with GPS, biometric, and face recognition. Automated schedules and shift management.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Kanban boards, sprint planning, and team collaboration. Track progress and hit deadlines effortlessly.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Custom leave policies, approval workflows, and balance tracking. Holiday calendars built-in.",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Wallet,
    title: "Payroll & Salary",
    description: "Automated calculations, tax compliance, and instant disbursements. Multi-currency support included.",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: CreditCard,
    title: "Advances & Loans",
    description: "Employee loan management, EMI tracking, and automated deductions. Financial wellness simplified.",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Compliance Automation",
    description: "Stay compliant with local regulations. Automated reports, audits, and document management.",
    gradient: "from-rose-500 to-rose-600",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything you need to{" "}
            <span className="gradient-text">manage your workforce</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A unified platform that brings together all HR operations. No more switching between tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card rounded-2xl p-6 lg:p-8 hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-purple-500 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-5`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
