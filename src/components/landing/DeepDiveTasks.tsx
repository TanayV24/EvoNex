import { Check, MoreHorizontal } from "lucide-react";

const kanbanColumns = [
  {
    title: "To Do",
    color: "bg-muted",
    tasks: [
      { title: "Update employee handbook", priority: "Medium", assignee: "JD" },
      { title: "Schedule team meeting", priority: "Low", assignee: "SK" },
    ],
  },
  {
    title: "In Progress",
    color: "bg-blue-500/20",
    tasks: [
      { title: "Q4 Performance reviews", priority: "High", assignee: "MK" },
      { title: "Onboarding docs update", priority: "Medium", assignee: "AL" },
    ],
  },
  {
    title: "Done",
    color: "bg-green-500/20",
    tasks: [
      { title: "Payroll processing", priority: "High", assignee: "JD" },
    ],
  },
];

const DeepDiveTasks = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual First on Desktop */}
          <div className="relative order-2 lg:order-1 animate-slide-right">
            <div className="glass-card rounded-2xl p-6 shadow-elevated overflow-hidden">
              {/* Mock Kanban Board */}
              <div className="bg-card rounded-xl">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">HR Tasks Board</h4>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs text-purple-500 font-medium">
                        + Add Task
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {kanbanColumns.map((column, colIndex) => (
                      <div key={column.title} className="animate-slide-up" style={{ animationDelay: `${colIndex * 0.15}s` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${column.color}`} />
                            <span className="text-sm font-medium text-foreground">{column.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
                        </div>
                        <div className="space-y-2">
                          {column.tasks.map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="glass-card rounded-lg p-3 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-medium text-foreground group-hover:text-purple-500 transition-colors line-clamp-2">
                                  {task.title}
                                </p>
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  task.priority === 'High' 
                                    ? 'bg-rose-500/10 text-rose-500' 
                                    : task.priority === 'Medium'
                                    ? 'bg-yellow-500/10 text-yellow-500'
                                    : 'bg-green-500/10 text-green-500'
                                }`}>
                                  {task.priority}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-medium">
                                  {task.assignee}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drag indicator */}
            <div className="absolute top-1/2 left-1/3 glass-card rounded-lg px-3 py-2 shadow-lg animate-pulse hidden lg:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Drag to move</span>
              <div className="w-4 h-4 rounded bg-purple-500/30" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 animate-slide-left">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500 mb-4">
              Task Management
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Organize work{" "}
              <span className="gradient-text">effortlessly</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Visual task boards that make project management intuitive. Assign tasks, set priorities, track progress, and collaborate in real-time with your team.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                "Kanban & List views",
                "Sprint planning",
                "Time tracking",
                "Team collaboration",
                "Automated reminders",
                "Progress reports",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-500" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeepDiveTasks;
