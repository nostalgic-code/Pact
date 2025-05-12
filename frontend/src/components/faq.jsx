import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "/src/components/ui/accordion";

export default function FAQ() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-4xl px-6 space-y-12">
                <h2 className="text-center text-3xl font-semibold md:text-4xl">Frequently Asked Questions</h2>

                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="what-is-pact">
                        <AccordionTrigger>What is Pact?</AccordionTrigger>
                        <AccordionContent>
                            Pact is a lightweight system for committing to tiny daily experiments that move you toward your personal or creative goals. It's designed to build momentum, not pressure.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="what-are-tiny-experiments">
                        <AccordionTrigger>What are tiny experiments?</AccordionTrigger>
                        <AccordionContent>
                            Tiny experiments are small, consistent actions you commit to daily—like writing for 10 minutes, sketching one idea, or testing a habit. They're flexible, trackable, and evolve with you.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="how-is-pact-different">
                        <AccordionTrigger>How is Pact different from other productivity tools?</AccordionTrigger>
                        <AccordionContent>
                            Most tools focus on tasks and deadlines. Pact helps you stay accountable to growth through self-designed, intention-driven experiments—minimizing friction, maximizing consistency.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="do-i-need-to-use-it-daily">
                        <AccordionTrigger>Do I need to use Pact every day?</AccordionTrigger>
                        <AccordionContent>
                            You don’t have to—but it’s designed to feel rewarding and frictionless to use daily. The more consistent you are, the clearer your growth journey becomes.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="is-there-a-free-version">
                        <AccordionTrigger>Is there a free version of Pact?</AccordionTrigger>
                        <AccordionContent>
                            Yes! The Free plan lets you start experimenting right away. When you're ready for more insights and personalization, you can upgrade.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
