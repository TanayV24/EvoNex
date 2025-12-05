import { useEffect, useState, useRef } from "react";
import { Check, ArrowRight, DollarSign, FileText, Building2 } from "lucide-react";

const CountUp = ({ end, duration = 2000, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const workflowSteps = [
  { icon: FileText, label: "Calculate" },
  { icon: Building2, label: "Verify" },
  { icon: DollarSign, label: "Disburse" },
];

const DeepDivePayroll = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="animate-slide-right">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-500 mb-4">
              Payroll & Salary
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Payroll that{" "}
              <span className="gradient-text">runs itself</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Automated payroll processing with built-in tax calculations, compliance checks, and instant disbursement. Say goodbye to spreadsheet errors forever.
            </p>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { value: 99, suffix: "%", label: "Accuracy" },
                { value: 5, suffix: "min", label: "Processing" },
                { value: 50, suffix: "+", label: "Integrations" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold gradient-text">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Processing Flow */}
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Processing Flow</p>
              <div className="flex items-center justify-between">
                {workflowSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-2">
                        <step.icon className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-xs text-foreground font-medium">{step.label}</span>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-muted-foreground mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual - Salary Slip */}
          <div className="relative animate-slide-left">
            <div className="glass-card rounded-2xl p-6 shadow-elevated">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Salary Slip Header */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">Salary Slip</h4>
                      <p className="text-white/80 text-sm">December 2025</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Employee Info */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">John Doe</p>
                      <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
                    </div>
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="p-6 grid grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div>
                    <p className="text-sm font-medium text-green-500 mb-3">Earnings</p>
                    <div className="space-y-2">
                      {[
                        { label: "Basic Salary", value: "$5,000" },
                        { label: "HRA", value: "$1,500" },
                        { label: "Bonus", value: "$800" },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="text-foreground font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <p className="text-sm font-medium text-rose-500 mb-3">Deductions</p>
                    <div className="space-y-2">
                      {[
                        { label: "Tax", value: "$730" },
                        { label: "Insurance", value: "$200" },
                        { label: "Provident Fund", value: "$500" },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="text-foreground font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Net Pay</span>
                    <span className="text-2xl font-bold gradient-text">$5,870</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -right-4 -bottom-4 glass-card rounded-xl p-4 shadow-lg animate-float hidden md:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Processed</p>
                  <p className="text-xs text-muted-foreground">152 employees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeepDivePayroll;
