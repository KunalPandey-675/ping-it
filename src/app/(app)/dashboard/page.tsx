"use client"

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/models/User"
import { acceptMsgSchema } from "@/schemas/acceptMsgSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, Copy, Check, Share2, MessageSquare, Info } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id.toString() !== messageId))
    }

    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(acceptMsgSchema)
    })

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Error', {
                description: axiosError.response?.data.message || "Failed to fetch settings"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(refresh)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.info('Refreshed', { description: "Showing latest messages" })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Error', {
                description: axiosError.response?.data.message || "Failed to fetch messages"
            })
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue("acceptMessages", !acceptMessages)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Error', {
                description: axiosError.response?.data.message || "Failed to update settings"
            })
        }
    }

    if (!session || !session.user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium">Loading your workspace...</p>
            </div>
        )
    }

    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success("Copied!", { description: "Profile URL copied to clipboard" });
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8 lg:py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
            >
                <div>
                  <h1 className="mb-2 text-4xl font-black tracking-tight md:text-5xl">Workspace</h1>
                  <p className="text-base text-muted-foreground md:text-lg">Manage your messages and profile controls.</p>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-2 backdrop-blur-sm">
                    <div className="flex flex-col px-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Status</span>
                        <span className="text-sm font-semibold text-card-foreground">{acceptMessages ? 'Accepting Messages' : 'Paused'}</span>
                    </div>
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                        className="scale-110"
                    />
                </div>
            </motion.div>

            {/* Profile Link Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-12 overflow-hidden relative"
            >
                <div className="glass-card group relative overflow-hidden rounded-3xl border-border/70 p-6 sm:p-8">
                    <div className="absolute right-0 top-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                         <Share2 size={120} />
                    </div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="rounded-xl bg-primary p-2 text-primary-foreground shadow-lg shadow-primary/25">
                                <Copy size={20} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Your Unique Link</h2>
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Share this link with your audience to start receiving honest, anonymous feedback. 
                            You can pause or resume incoming messages anytime.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="group relative grow">
                                <input
                                    type="text"
                                    value={profileUrl}
                                    readOnly
                                    className="w-full rounded-2xl border border-border/70 bg-background/70 p-4 pr-12 font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                                   <MessageSquare size={16} />
                                </div>
                            </div>
                            <Button 
                                onClick={copyToClipboard}
                                className="h-full rounded-2xl px-8 py-4"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied' : 'Copy Link'}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black tracking-tight">Your Messages</h3>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {messages.length}
                    </div>
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-border/70 hover:bg-primary/10"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <Separator className="mb-8 opacity-60" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message._id as string}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/70 bg-transparent py-20"
                        >
                            <div className="mb-4 rounded-2xl bg-secondary/60 p-4 text-muted-foreground">
                                <MessageSquare size={32} />
                            </div>
                            <p className="mb-2 text-xl font-black tracking-tight">No messages yet</p>
                            <p className="text-muted-foreground max-w-xs text-center">
                                Share your link to start hearing from your friends and followers.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="mt-12 flex items-center gap-4 rounded-3xl border border-border/70 bg-card/60 p-6 text-sm text-muted-foreground backdrop-blur-sm">
                <Info size={16} className="shrink-0 text-primary" />
                <p>Messages are automatically stored and encrypted. Only you can see them.</p>
            </div>
        </div>
    )
}

export default Dashboard
