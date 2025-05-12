import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6 text-center space-y-8">
                <h2 className="text-3xl font-semibold md:text-4xl">
                    Start your first tiny experiment today
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Pact makes it simple to commit, reflect, and grow—one small step at a time.
                </p>

                <div className="flex justify-center">
                    <Button asChild size="lg" className={"bg-white text-black"}>
                        <Link to="/register">
                            Get Started Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
