import { Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function Pricing() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-4xl font-semibold lg:text-5xl">Start Small. Grow Bold.</h1>
                    <p className="text-muted-foreground">Choose a plan that fits your stage of experimenting, reflecting, and growing.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    {/* Free Plan (Starter) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-medium">Free Plan (Starter)</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
                            <CardDescription className="text-sm">Get started with your first experiments.</CardDescription>
                            <Button asChild variant="outline" className="mt-4 w-full">
                                <Link href="">Get Started</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />
                            <ul className="list-outside space-y-3 text-sm">
                                {[
                                    'Create and track unlimited pacts',
                                    'Daily “Yes/No” check-ins',
                                    'Pause / Continue / Pivot options',
                                    'Simple history log (last 7 days)',
                                    'Community pact feed (limited view)',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Basic Plan */}
                    <Card className="relative">
                        <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                            Most Popular
                        </span>

                        <CardHeader>
                            <CardTitle className="font-medium">Basic Plan</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$5 / mo</span>
                            <CardDescription className="text-sm">Understand your patterns and build momentum.</CardDescription>
                            <Button asChild className="mt-4 w-full">
                                <Link href="">Start Basic Plan</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />
                            <ul className="list-outside space-y-3 text-sm">
                                {[
                                    'Everything in Free, plus:',
                                    'Access full experiment history',
                                    'Weekly email summaries of progress',
                                    'Streak tracker + visual charts',
                                    'Basic behavioral insights (e.g. "You check in most on Wednesdays")',
                                    'Compare yourself to community benchmarks',
                                    'Unlock 3 “Insight Packs” per month',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Premium Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-medium">Premium Plan</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$12 / mo or $100 / year</span>
                            <CardDescription className="text-sm">Personalized insights to maximize your growth.</CardDescription>
                            <Button asChild variant="outline" className="mt-4 w-full">
                                <Link href="">Start Premium Plan</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />
                            <ul className="list-outside space-y-3 text-sm">
                                {[
                                    'Everything in Basic, plus:',
                                    'AI-powered habit pattern analysis',
                                    '“Success Forecasts” for new pacts',
                                    'Personalized next-step suggestions',
                                    'Unlimited “Insight Packs”',
                                    '“Life Themes” dashboard: see how your experiments align with core values',
                                    'Exportable growth report (PDF)',
                                    'Priority support + early access to new features',
                                    'Invite-only community experiments and challenges',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
