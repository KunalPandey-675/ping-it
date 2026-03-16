'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, User, Mail, Lock, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const debounced = useDebounceCallback(setUsername, 500)

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/unique-username?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUniqueness()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            await axios.post<ApiResponse>('/api/sign-up', data)
            toast.success('Account Created', {
                description: "Check your email for the verification code."
            })
            router.replace(`/verify/${data.username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Sign-Up failed', {
                description: axiosError.response?.data.message ?? "Something went wrong"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-[14%] h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute -right-32 bottom-[8%] h-96 w-96 rounded-full bg-accent/25 blur-[140px]" />
                <div className="absolute inset-0 bg-grid-mask opacity-45" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-black tracking-tight sm:text-5xl">Create Account</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Start collecting honest anonymous feedback</p>
                </div>

                <div className="glass-card rounded-4xl border-border/70 p-7 sm:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField name="username" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Username</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                placeholder="ping_user" 
                                                className="h-12 rounded-2xl border-border/70 bg-background/70 pl-11 pr-11 font-medium"
                                                {...field} 
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }} 
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                {isCheckingUsername && <Loader2 className="animate-spin text-primary" size={16} />}
                                                {!isCheckingUsername && usernameMessage && (
                                                    usernameMessage === "Username is unique" 
                                                        ? <CheckCircle2 className="text-green-500" size={16} />
                                                        : <XCircle className="text-destructive" size={16} />
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <AnimatePresence>
                                        {usernameMessage && (
                                            <motion.p 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={`px-1 text-[11px] font-bold uppercase tracking-[0.15em] ${usernameMessage === "Username is unique" ? "text-green-500" : "text-destructive"}`}
                                            >
                                                {usernameMessage}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="email" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                placeholder="hello@example.com" 
                                                className="h-12 rounded-2xl border-border/70 bg-background/70 pl-11 font-medium"
                                                {...field} 
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="password" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                className="h-12 rounded-2xl border-border/70 bg-background/70 pl-11 font-medium"
                                                {...field} 
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="group mt-4 h-12 w-full rounded-2xl text-base font-bold"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Get Started
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-8 border-t border-border/60 pt-6 text-center">
                        <p className="text-sm text-muted-foreground font-medium">
                            Already a member?{' '}
                            <Link href="/sign-in" className="text-primary font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage
