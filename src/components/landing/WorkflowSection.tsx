import { useEffect, useRef, useState } from "react";
import { UserPlus, Users, Clock, Calendar, Wallet, Shield, Check } from "lucide-react";

const workflowSteps = [
  { icon: UserPlus, label: "Admin Onboarding", description: "Set up your organization" },
  { icon: Users, label: "Employee Onboarding", description: "Invite team members" },
  { icon: Clock, label: "Attendance", description: "Track work hours" },
  { icon: Calendar, label: "Leave Management", description: "Handle time off" },
  { icon: Wallet, label: "Payroll", description: "Process salaries" },
  { icon: Shield, label: "Compliance", description: "Stay regulated" },
];

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500 mb-4">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Your complete{" "}
            <span className="gradient-text">HR journey</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From onboarding to compliance, WorkOS guides you through every step of workforce management.
          </p>
        </div>

        {/* Workflow Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${(activeStep / (workflowSteps.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.label}
                  className={`flex flex-col items-center transition-all duration-500 ${
                    index <= activeStep ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                      index <= activeStep
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg scale-110'
                        : 'bg-secondary'
                    }`}
                  >
                    {index < activeStep ? (
                      <Check className="w-7 h-7 text-white" />
                    ) : (
                      <step.icon className={`w-7 h-7 ${index <= activeStep ? 'text-white' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  <p className={`text-sm font-semibold text-center transition-colors duration-500 ${
                    index <= activeStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1 max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.label}
                className={`flex items-center gap-4 glass-card rounded-xl p-4 transition-all duration-500 ${
                  index <= activeStep ? 'border-purple-500/50' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    index <= activeStep
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                      : 'bg-secondary'
                  }`}
                >
                  {index < activeStep ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <step.icon className={`w-5 h-5 ${index <= activeStep ? 'text-white' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${index <= activeStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
