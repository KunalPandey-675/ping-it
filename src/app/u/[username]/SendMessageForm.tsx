'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messagesSchema';
import { motion } from 'framer-motion';

export default function SendMessageForm({ username }: { username: string }) {
    const localMsgs = ["What's your favorite movie?", "Do you have any pets?", "What's your dream job?"]
    const [msgs, setMsgs] = useState(localMsgs)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    });

    const content = form.watch('content');

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const fetchSuggestedMessages = async () => {
        setIsSuggestLoading(true);
        try {
            const response = await axios.post(`/api/suggest-msgs`)
            const newMsgs = response.data.questions
            setMsgs(newMsgs)
        } catch (error) {
            toast.error('Could not fetch suggestions', {
                description: 'Please try again later.',
            });
        } finally {
            setIsSuggestLoading(false);
        }
    }

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast.success("Message sent!", {
                description: "Your anonymous feedback has been delivered."
            });
            form.reset({ content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Failed to send', {
                description: axiosError.response?.data.message ?? 'Please try again later',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-4 py-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-[14%] h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute -right-32 bottom-[8%] h-96 w-96 rounded-full bg-accent/25 blur-[140px]" />
                <div className="absolute inset-0 bg-grid-mask opacity-45" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-2xl"
            >
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-4 inline-flex items-center justify-center rounded-3xl bg-primary/10 p-4 text-primary"
                    >
                        <UserCircle2 size={48} strokeWidth={1.5} />
                    </motion.div>
                    <h1 className="mb-2 text-3xl font-black tracking-tight md:text-4xl">
                        @{username}
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Send an anonymous message to this user</p>
                </div>

                <div className="glass-card relative overflow-hidden rounded-4xl border-border/70 p-6 md:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Textarea
                                                    placeholder="Type your message here..."
                                                    className="min-h-40 resize-none rounded-2xl border-border/70 bg-background/70 p-5 text-base placeholder:text-muted-foreground/45 sm:text-lg"
                                                    {...field}
                                                />
                                                <div className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/40">
                                                    {field.value.length} Characters
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading || !content}
                                className="group relative w-full gap-2 overflow-hidden rounded-2xl py-7 text-lg font-bold"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                    {isLoading ? 'Sending...' : 'Send Anonymously'}
                                </span>
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Suggested Messages Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12"
                >
                    <div className="glass-card rounded-4xl border-border/70 p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Need a prompt?</h3>
                            </div>
                            <Button
                                onClick={fetchSuggestedMessages}
                                disabled={isSuggestLoading}
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-xl border-border/70 text-sm font-semibold"
                            >
                                {isSuggestLoading
                                    ? <><Loader2 size={14} className="animate-spin" /> Generating...</>
                                    : <><Sparkles size={14} /> Suggest</>}
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground/60 -mt-2">Click on any message below to use it.</p>

                        <div className="grid grid-cols-1 gap-3">
                            {isSuggestLoading
                                ? Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-14 w-full animate-pulse rounded-2xl border border-border/50 bg-muted/40"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    />
                                ))
                                : msgs.map((message, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.07 }}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleMessageClick(message)}
                                        className="w-full rounded-2xl border border-border/70 bg-background/50 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                                    >
                                        <span className="text-sm font-medium">{message}</span>
                                    </motion.button>
                                ))
                            }
                        </div>
                    </div>
                </motion.div>

                <Separator className="my-12 opacity-60" />

                <div className="space-y-4 pb-12 text-center">
                    <p className="text-muted-foreground font-medium">Want to receive anonymous messages too?</p>
                    <Link href="/sign-up">
                        <Button variant="outline" className="rounded-full border-primary/20 px-8 hover:bg-primary/5">
                            Create Your Account
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
