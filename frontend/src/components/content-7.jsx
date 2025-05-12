import { CheckCircle, CalendarHeart } from 'lucide-react'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
                    Most goals fail because there's no system for daily action, reflection, and accountability
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative space-y-4">
                        <p className="text-muted-foreground">
                            Pact solves this by helping you commit to daily <span className="font-semibold text-white">tiny experiments</span> that matter most. 
                            <span className="text-accent-foreground font-bold text-white"> Track progress, reflect on the journey, and never lose sight of your goals.</span>
                        </p>
                        <p className="text-muted-foreground">
                            Designed for clarity and consistency, Pact combines simplicity with accountability—making tracking your tiny experiments feel intuitive and rewarding.
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="size-4" />
                                    <h3 className="text-sm font-medium">Commit Daily</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">Build momentum with consistent, intentional check-ins on your tiny experiments.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CalendarHeart className="size-4" />
                                    <h3 className="text-sm font-medium">Reflect Often</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">View your journey and stay connected to your purpose, one experiment at a time.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative mt-6 sm:mt-0">
                        <div
                            className="bg-linear-to-b aspect-67/34 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <img
                                src="/src/assets/exercice.webp"
                                className="hidden rounded-[15px] dark:block"
                                alt="Pact dashboard dark"
                                width={1206}
                                height={612} />
                            <img
                                src="/src/assets/exercice.webp"
                                className="rounded-[15px] shadow dark:hidden"
                                alt="Pact dashboard light"
                                width={1206}
                                height={612} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
