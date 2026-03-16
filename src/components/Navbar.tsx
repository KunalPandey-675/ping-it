'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, LogOut, User as UserIcon } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-border/55 bg-background/70 backdrop-blur-xl'>
      <div className='mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 md:px-6'>
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.06 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-primary/20 bg-primary/90 p-2.5 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <MessageSquare size={20} />
          </motion.div>
          <span className='headline-gradient text-2xl font-black'>
            Ping It
          </span>
        </Link>

        <div className='flex items-center gap-3 sm:gap-4'>
          <AnimatePresence mode='wait'>
            {session ? (
              <motion.div 
                key="logged-in"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className='flex items-center gap-2 md:gap-4'
              >
                <div className='hidden items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-2 md:flex'>
                   <UserIcon size={14} className="text-primary" />
                   <span className='max-w-40 truncate text-sm font-semibold'>
                     {user?.username || user?.email?.split('@')[0]}
                   </span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className='gap-2 rounded-full border border-transparent px-4 hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive'
                  onClick={() => signOut()}
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="logged-out"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
              >
                <Link href='/sign-in'>
                  <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30">
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
