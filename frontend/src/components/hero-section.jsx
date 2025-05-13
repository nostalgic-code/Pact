import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../../src/components/ui/button';
import { TextEffect } from '@/components/ui/text-effect';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { HeroHeader } from '@/components/hero5-header';


const transitionVariants = {
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 1.5,
        },
      },
    },
  }
  
  export default function HeroSection() {
    return (
      <>
        <HeroHeader />
        <main className="overflow-hidden">
          <div aria-hidden className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
            <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
            <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
            <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          </div>
          <section>
            <div className="relative pt-24 md:pt-36">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        delayChildren: 1,
                      },
                    },
                  },
                  item: {
                    hidden: {
                      opacity: 0,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        bounce: 0.3,
                        duration: 2,
                      },
                    },
                  },
                }}
                className="absolute inset-0 -z-20"
              >
                <img
                  src="https://images.unsplash.com/photo-1568491361227-609824af85a5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8"
                  alt="background"
                  className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                  width="3276"
                  height="4095"
                />
              </AnimatedGroup>
              <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
              <div className="mx-auto max-w-7xl px-6">
                <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                  <AnimatedGroup variants={transitionVariants}>
                    <a
                      href="#link"
                      className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                    >
                      <span className="text-foreground text-sm">Make a Pact with yourself</span>
                      <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
  
                      <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-black" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-black" />
                        </span>

                        </div>
                      </div>
                    </a>
                  </AnimatedGroup>
  
                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[4rem]"
                  >
                    One action. One duration. One clear answer: Did you show up today?
                  </TextEffect>
                  <TextEffect
                    per="line"
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    delay={0.5}
                    as="p"
                    className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                  >
                   
                    Pact helps you commit to small, intentional experiments—not rigid routines. 
                    Choose one action, set your duration, and track your consistency with a simple “Yes” or “No.” 
                    This isn’t about perfection. It’s about clarity, reflection, and discovering what actually works for you.
                  </TextEffect>
  
                  <AnimatedGroup
                    variants={{
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.75,
                          },
                        },
                      },
                      ...transitionVariants,
                    }}
                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                  >
                    <div key={1} className="rounded-[calc(var(--radius-xl)+0.125rem)] p-0.5">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-xl px-5 text-base bg-zinc-200 text-black hover:bg-white transition-colors"
                      >
                        <a href="#link">
                          <span className="text-nowrap">Start now</span>
                        </a>
                      </Button>
                    </div>

                    <Button key={2} asChild size="lg" variant="ghost" className="h-10.5 rounded-xl px-5">
                      <a href="#link">
                        <span className="text-nowrap">Learn more</span>
                      </a>
                    </Button>
                  </AnimatedGroup>
                </div>
              </div>
  
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                  <div
                    aria-hidden
                    className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                  />
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                    <img
                      className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                      src="/assets/pact3.png"
                      alt="app screen"
                      width="2700"
                      height="1440"
                    />
                    <img
                      className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                      src="/assets/pact3.png"
                      alt="app screen"
                      width="2700"
                      height="1440"
                    />
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </section>
          <section className="bg-background relative overflow-hidden pb-16 pt-16 md:pb-32">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent"></div>
            
            <div className="container relative">
              <TextEffect preset="fade-in-blur" as="h2" className="mb-12 text-center text-3xl font-semibold tracking-tight">
                Wisdom from the Masters
              </TextEffect>              <div className="mx-auto max-w-5xl">
                <AnimatedGroup
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.3,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-zinc-50 to-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:from-zinc-900/50 dark:to-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white/90 opacity-0 transition-opacity group-hover:opacity-100 dark:from-zinc-900/50 dark:to-zinc-900/90"></div>
                    <div className="relative">
                      <svg className="absolute -left-4 -top-4 h-8 w-8 text-zinc-300/50 dark:text-zinc-500/50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        Don't stop when you're tired. Stop when you're done. It's not about motivation, it's about dedication.
                      </p>                      <div className="mt-6">
                        <p className="font-semibold text-zinc-900 dark:text-white">David Goggins</p>
                        <p className="text-sm text-zinc-500">Navy SEAL, Ultramarathon Runner</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-zinc-50 to-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:from-zinc-900/50 dark:to-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white/90 opacity-0 transition-opacity group-hover:opacity-100 dark:from-zinc-900/50 dark:to-zinc-900/90"></div>
                    <div className="relative">
                      <svg className="absolute -left-4 -top-4 h-8 w-8 text-zinc-300/50 dark:text-zinc-500/50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        Success is doing what you said you would do, consistently, day after day.
                      </p>                      <div className="mt-6">
                        <p className="font-semibold text-zinc-900 dark:text-white">Andy Frisella</p>
                        <p className="text-sm text-zinc-500">Entrepreneur, MFCEO Project</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-zinc-50 to-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:from-zinc-900/50 dark:to-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white/90 opacity-0 transition-opacity group-hover:opacity-100 dark:from-zinc-900/50 dark:to-zinc-900/90"></div>
                    <div className="relative">
                      <svg className="absolute -left-4 -top-4 h-8 w-8 text-zinc-300/50 dark:text-zinc-500/50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        Setting goals is the first step in turning the invisible into the visible. Take massive, determined action.
                      </p>                      <div className="mt-6">
                        <p className="font-semibold text-zinc-900 dark:text-white">Tony Robbins</p>
                        <p className="text-sm text-zinc-500">Author, Life Coach</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-zinc-50 to-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:from-zinc-900/50 dark:to-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white/90 opacity-0 transition-opacity group-hover:opacity-100 dark:from-zinc-900/50 dark:to-zinc-900/90"></div>
                    <div className="relative">
                      <svg className="absolute -left-4 -top-4 h-8 w-8 text-zinc-300/50 dark:text-zinc-500/50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        Life isn't about finding yourself. Life is about creating yourself through small, consistent actions every single day.
                      </p>                      <div className="mt-6">
                        <p className="font-semibold text-zinc-900 dark:text-white">Jocko Willink</p>
                        <p className="text-sm text-zinc-500">Navy SEAL, Author</p>
                      </div>
                    </div>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </section>
        </main>
      </>
    )
  }


