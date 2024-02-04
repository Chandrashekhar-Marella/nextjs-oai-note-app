import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import logo from "@/assets/logo.png"
import { Button } from '@/components/ui/button'

export default function Home ()
{

  const { userId } = auth();

  if ( userId ) redirect('/notes');

  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className="flex items-center gap-4">
        <Image
          src={ logo }
          alt="AI Notes Logo"
          width={ 100 }
          height={ 100 }
        />
        <span className="font-extrabold tracking-tight text-4xl lg:text-5xl">AI Notes</span>
      </div>

      <p className='max-w-prose text-center '>
        An intelligent note-taking app with AI integration, built with Open AI, Pinecone, NextJS, Shadcn UI, Clerk and more ...
      </p>

      <Button size={ 'lg' } asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  )
}
