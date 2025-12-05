import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "WorkOS transformed how we manage our 500+ employees. Payroll that used to take days now happens in minutes. The ROI was immediate.",
    author: "Sarah Chen",
    role: "VP of People Operations",
    company: "TechFlow Inc.",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "Finally, a workforce platform that doesn't feel like it was built in 2005. The UI is beautiful, intuitive, and our team actually enjoys using it.",
    author: "Michael Roberts",
    role: "HR Director",
    company: "GlobalSync",
    avatar: "MR",
    rating: 5,
  },
  {
    quote: "We eliminated 3 different tools and replaced them with WorkOS. The unified dashboard gives us visibility we never had before.",
    author: "Emily Thompson",
    role: "COO",
    company: "NexGen Solutions",
    avatar: "ET",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500 mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Loved by{" "}
            <span className="gradient-text">HR teams worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what industry leaders are saying about their WorkOS experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="glass-card rounded-2xl p-6 lg:p-8 hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 animate-slide-up group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-300">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-purple-500">{testimonial.company}</p>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-subtle" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
