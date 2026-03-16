'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { motion } from 'framer-motion';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-20 md:px-10 lg:px-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-20%] top-[6%] h-96 w-96 rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute bottom-[4%] right-[-18%] h-112 w-md rounded-full bg-accent/25 blur-[140px]" />
          <div className="absolute inset-0 bg-grid-mask opacity-45" />
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-14 w-full max-w-5xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm"
          >
            <Shield size={14} />
            <span>Anonymous. Secure. Instant.</span>
          </motion.div>
          
          <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-black leading-[1.05] sm:text-6xl md:text-7xl">
            Feedback, without filters.
            <br />
            <span className="headline-gradient">
              Mystery messages, beautifully delivered.
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Build your personal feedback portal in seconds. Share one link, collect truly honest messages, and manage everything from a sleek private dashboard.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="group h-12 rounded-full px-8 text-base">
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-6xl px-1 sm:px-4"
        >
          <div className="mb-6 flex items-center justify-between px-1 sm:px-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Sparkles size={16} />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Live message examples</p>
            </div>
          </div>

          <div className="relative rounded-3xl border border-border/70 bg-card/55 p-3 shadow-soft backdrop-blur-xl sm:p-5">
            <Carousel
              plugins={[Autoplay({ delay: 3000 })]}
              className="w-full"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                    <Card className="glass-card interactive-lift h-full border-border/60">
                      <CardHeader className="pb-2">
                        <div className="mb-2 flex items-center gap-2 text-primary">
                          <div className="rounded-lg bg-primary/10 p-1.5">
                            <Mail size={16} />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">New Message</span>
                        </div>
                        <CardTitle className="text-lg leading-snug tracking-tight">{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                          {message.content}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/65">
                          {message.received}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-3 hidden sm:flex" />
              <CarouselNext className="-right-3 hidden sm:flex" />
            </Carousel>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border/65 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
             <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
                <Shield size={16} />
             </div>
             <span className="text-sm font-black tracking-tight">Ping It</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
             <Link href="#" className="transition-colors hover:text-primary">Privacy</Link>
             <Link href="#" className="transition-colors hover:text-primary">Terms</Link>
             <Link href="#" className="transition-colors hover:text-primary">Twitter</Link>
          </div>
          
          <p className="text-sm text-muted-foreground/90">
            © 2026 Ping It. Built for transparency.
          </p>
        </div>
      </footer>
    </div>
  );
}