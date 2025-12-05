const companies = [
  { name: "Acme Corp", logo: "ACME" },
  { name: "TechFlow", logo: "TechFlow" },
  { name: "GlobalSync", logo: "GlobalSync" },
  { name: "NexGen", logo: "NexGen" },
  { name: "Quantum", logo: "Quantum" },
  { name: "Innovate", logo: "Innovate" },
];

const TrustedBySection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-muted-foreground text-sm font-medium mb-10 uppercase tracking-wider">
          Trusted by innovative companies worldwide
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="group flex items-center justify-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-muted-foreground/40 group-hover:text-muted-foreground transition-all duration-300 group-hover:scale-110">
                {company.logo}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 lg:mt-24">
          {[
            { value: "10K+", label: "Companies" },
            { value: "2M+", label: "Employees Managed" },
            { value: "99.9%", label: "Uptime" },
            { value: "150+", label: "Countries" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
