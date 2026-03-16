"use client"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X, Clock, MessageSquareQuote } from "lucide-react"
import { Message } from "@/models/User"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { motion } from "framer-motion"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast.success("Deleted", {
                description: response.data.message
            })
            onMessageDelete(message._id.toString())
        } catch (error) {
            toast.error("Error", {
                description: "Failed to delete the message"
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.22 }}
            className="h-full"
        >
            <Card className="glass-card group h-full overflow-hidden border-border/60 transition-all duration-300 hover:border-primary/25">
                <CardHeader className="relative pb-2">
                    <div className="flex justify-between items-start gap-4">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                            <MessageSquareQuote size={18} />
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                >
                                    <X size={16} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass border-border/70 shadow-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold">Delete Message?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                        This will permanently remove this anonymous feedback. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2 sm:gap-0">
                                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDeleteConfirm}
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full px-6"
                                    >
                                        Delete Forever
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent className="grow">
                    <p className="text-base leading-relaxed text-card-foreground/95">
                        {message.content}
                    </p>
                </CardContent>
                <div className="flex items-center justify-between border-t border-border/70 bg-primary/3 px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Clock size={12} />
                        <span>{new Date(message.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export default MessageCard
