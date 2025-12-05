import { Check, MapPin, Fingerprint, Camera, Clock } from "lucide-react";

const benefits = [
  "Real-time GPS tracking with geofencing",
  "Biometric and face recognition support",
  "Automated shift scheduling",
  "Overtime calculation and alerts",
  "Mobile check-in for remote teams",
];

const DeepDiveAttendance = () => {
  return (
    <section id="solutions" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="animate-slide-right">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500 mb-4">
              Attendance Engine
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Track time with{" "}
              <span className="gradient-text">precision</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our intelligent attendance system eliminates manual tracking errors and gives you real-time visibility into your workforce. Whether your team is in the office, remote, or on the field.
            </p>

            {/* Benefits */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative animate-slide-left">
            <div className="glass-card rounded-2xl p-6 shadow-elevated">
              {/* Mock Attendance Dashboard */}
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground">Today's Attendance</h4>
                      <p className="text-sm text-muted-foreground">December 5, 2025</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Present", value: "142", color: "text-green-500" },
                      { label: "Late", value: "8", color: "text-yellow-500" },
                      { label: "Absent", value: "5", color: "text-rose-500" },
                    ].map((stat) => (
                      <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Check-ins */}
                  <div className="space-y-3">
                    {[
                      { name: "Sarah Johnson", time: "9:02 AM", method: "Face ID", status: "On Time" },
                      { name: "Mike Chen", time: "9:15 AM", method: "GPS", status: "Late" },
                      { name: "Emily Davis", time: "8:55 AM", method: "Biometric", status: "On Time" },
                    ].map((entry, index) => (
                      <div key={index} className="glass-card rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs text-white font-medium">
                            {entry.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{entry.name}</p>
                            <p className="text-xs text-muted-foreground">{entry.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-foreground">{entry.time}</p>
                          <p className={`text-xs ${entry.status === 'On Time' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {entry.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Method Icons */}
            <div className="absolute -left-4 top-1/4 glass-card rounded-xl p-3 shadow-lg animate-float hidden md:block">
              <MapPin className="w-6 h-6 text-purple-500" />
            </div>
            <div className="absolute -right-4 top-1/2 glass-card rounded-xl p-3 shadow-lg animate-float-delayed hidden md:block">
              <Fingerprint className="w-6 h-6 text-blue-500" />
            </div>
            <div className="absolute -left-4 bottom-1/4 glass-card rounded-xl p-3 shadow-lg animate-float hidden md:block" style={{ animationDelay: "1s" }}>
              <Camera className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeepDiveAttendance;
