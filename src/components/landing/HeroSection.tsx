import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-radial" />
      
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Now available for enterprises</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            The Complete{" "}
            <span className="gradient-text">Workforce</span>
            <br />
            Operating System
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Attendance, Tasks, Payroll, Leaves, Loans, Compliance — all in one unified platform. 
            Designed for modern teams that demand efficiency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 glow-subtle"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-lg glass-card hover:bg-secondary/50 transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Book a Demo
            </Button>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card rounded-2xl p-2 shadow-elevated glow-subtle">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Mock Dashboard */}
                <div className="bg-gradient-to-br from-secondary to-background p-6">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-2 w-16 bg-muted-foreground/20 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                      <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    {/* Stats Cards */}
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="glass-card rounded-xl p-4 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="h-2 w-12 bg-muted-foreground/30 rounded mb-2" />
                        <div className="h-6 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded opacity-80" />
                      </div>
                    ))}
                  </div>

                  {/* Main Content Area */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="col-span-2 glass-card rounded-xl p-4 h-48">
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-3 w-20 bg-muted rounded" />
                        <div className="h-3 w-12 bg-purple-500/30 rounded" />
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30" />
                            <div className="flex-1">
                              <div className="h-2 w-full bg-muted rounded mb-1" />
                              <div className="h-1 w-3/4 bg-muted-foreground/20 rounded" />
                            </div>
                            <div className="h-6 w-16 bg-green-500/20 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card rounded-xl p-4 h-48">
                      <div className="h-3 w-16 bg-muted rounded mb-4" />
                      <div className="flex items-end justify-between h-32 pb-2">
                        {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                          <div
                            key={i}
                            className="w-4 rounded-t bg-gradient-to-t from-purple-500 to-blue-500 opacity-80"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -left-8 top-1/4 glass-card rounded-xl p-4 shadow-lg animate-float hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Payroll Processed</p>
                  <p className="text-xs text-muted-foreground">152 employees</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 top-1/3 glass-card rounded-xl p-4 shadow-lg animate-float-delayed hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-500 text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">98% Attendance</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
