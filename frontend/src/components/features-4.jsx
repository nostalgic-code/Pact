import { CalendarCheck, Lightbulb, MessageSquareHeart, Target, TrendingUp, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: CalendarCheck,
        title: "Experiment Daily",
        description: "Set a daily tiny experiment—something small and meaningful—and track it with a tap."
    },
    {
        icon: Lightbulb,
        title: "Reflect on Learnings",
        description: "Every experiment brings insight. Use gentle prompts to reflect on what you’re learning as you go."
    },
    {
        icon: MessageSquareHeart,
        title: "Share the Journey",
        description: "Invite a small group to follow your experiments and support your process. Growth is better together."
    },
    {
        icon: Target,
        title: "Align with Purpose",
        description: "Ground each experiment in what matters to you. Small actions, aligned with your bigger picture."
    },
    {
        icon: UserCheck,
        title: "Gentle Nudges",
        description: "Stay consistent with soft reminders to show up and try something new—even if it’s tiny."
    },
    {
        icon: TrendingUp,
        title: "Visualize Progress",
        description: "See how your tiny experiments stack up over time. Every small step builds confidence."
    }
];

export default function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">
                        A system built for consistent growth through tiny experiments
                    </h2>
                    <p className="text-muted-foreground">
                        Pact gives you the tools to design, track, and reflect on daily experiments—small, intentional actions that build momentum over time.
                    </p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="group cursor-pointer space-y-3 p-10 transition-colors hover:bg-muted/10"
                            >
                                <div className="flex items-center gap-2 text-accent">
                                    <Icon className="size-4 transition-transform group-hover:scale-110" />
                                    <h3 className="text-sm font-medium">{feature.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
