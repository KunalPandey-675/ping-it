'use client'
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, KeyRound, Mail, ArrowRight } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { motion } from "framer-motion"

const SignInPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            toast.error("Login Failed", {
                description: "Incorrect username or password"
            })
        }

        if (result?.url) {
            router.replace(`/dashboard`)
        }
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-[15%] h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -right-32 bottom-[5%] h-96 w-96 rounded-full bg-accent/25 blur-[140px]" />
          <div className="absolute inset-0 bg-grid-mask opacity-45" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-black tracking-tight sm:text-5xl">Welcome Back</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Sign in to manage your anonymous inbox</p>
        </div>

        <div className="glass-card rounded-4xl border-border/70 p-7 sm:p-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField name="identifier" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Email or Username</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input 
                                        placeholder="Enter your email/username" 
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
                            <div className="flex items-center justify-between px-1">
                                <FormLabel className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Password</FormLabel>
                                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="h-12 rounded-2xl border-border/70 bg-background/70 pl-11 font-medium"
                                        {...field} 
                                    />
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="group mt-2 h-12 w-full rounded-2xl text-base font-bold"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 border-t border-border/60 pt-6 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                    New here?{' '}
                    <Link href="/sign-up" className="text-primary font-bold hover:underline">
                        Join Ping It
                    </Link>
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignInPage
