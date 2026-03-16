'use client'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"
import { motion } from "framer-motion"
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react"

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "" },
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-otp`, {
                username: params.username,
                code: data.code
            })
            toast.success('Success', {
                description: response.data.message,
            })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Verification failed', {
                description: axiosError.response?.data.message ?? "Something went wrong",
            })
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-[15%] h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
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
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="mb-4 inline-flex items-center justify-center rounded-3xl bg-primary/10 p-4 text-primary"
                    >
                        <ShieldCheck size={48} strokeWidth={1.5} />
                    </motion.div>
                    <h1 className="mb-2 text-4xl font-black tracking-tight sm:text-5xl">Verify Account</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Enter the 6-digit code sent to your email</p>
                </div>

                <div className="glass-card rounded-4xl border-border/70 p-7 sm:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Verification Code</FormLabel>
                                        <div className="relative">
                                            <Input 
                                                placeholder="000000" 
                                                className="h-14 rounded-2xl border-border/70 bg-background/70 text-center font-mono text-2xl tracking-[0.5em]"
                                                {...field} 
                                            />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="group h-12 w-full rounded-2xl text-base font-bold"
                            >
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Verify OTP
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                    
                    {/* <div className="mt-8 border-t border-border/60 pt-6 text-center">
                        <p className="text-sm text-muted-foreground font-medium">
                            Didn't receive the code?{' '}
                            <button className="text-primary font-bold hover:underline">Resend</button>
                        </p>
                    </div> */}
                </div>
            </motion.div>
        </div>
    )
}

export default VerifyAccount
