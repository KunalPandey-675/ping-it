import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { UserX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SendMessageForm from './SendMessageForm';

export default async function SendMessagePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    await dbConnect();
    const user = await UserModel.findOne({ username, isVerified: true }).select('_id').lean();

    if (!user) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-24 top-[14%] h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
                    <div className="absolute -right-32 bottom-[8%] h-96 w-96 rounded-full bg-accent/25 blur-[140px]" />
                </div>
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="rounded-3xl bg-destructive/10 p-5 text-destructive">
                        <UserX size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                            @{username}
                        </h1>
                        <p className="text-muted-foreground">This user does not exist or has not verified their account.</p>
                    </div>
                    <Link href="/sign-up">
                        <Button className="rounded-full px-8">Create Your Own Account</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return <SendMessageForm username={username} />;
}
