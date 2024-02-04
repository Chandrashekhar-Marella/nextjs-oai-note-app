"use client"

import { useState } from "react";
import Link from 'next/link'
import Image from "next/image"
import { UserButton } from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import logo from "@/assets/logo.png"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import AIChatButton from "@/components/AIChatButton";


const NavBar = () =>
{
    const { theme } = useTheme();

    const [ showAddEditNoteDialog, setShowAddEditNoteDialog ] = useState( false );

    return (
        <>
            <div className="p-4 shadow">
                <div className="max-w-7xl m-auto flex flex-wrap gap-3 items-center justify-between">

                    <Link
                        href="/notes"
                        className="flex items-center gap-1"
                    >
                        <Image
                            src={ logo }
                            alt="AI Brain Logo"
                            width={ 40 }
                            height={ 40 }
                        />
                        <span className="font-bold">AI Notes</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <UserButton
                            afterSignOutUrl='/'
                            appearance={ {
                                baseTheme: ( theme === "dark" ? dark : undefined ),
                                elements: {
                                    avatarBox:
                                        { width: '2.5rem', height: '2.5rem' }
                                }
                            } }
                        />

                        <ThemeToggleButton />

                        <Button onClick={ () => setShowAddEditNoteDialog( true ) }>
                            <Plus size={ 20 } className='mr-2' />
                            Add Note
                        </Button>
                        <AIChatButton />
                    </div>
                </div>
            </div>

            {/* { showAddEditNoteDialog && <AddNoteDialog open={ showAddEditNoteDialog } setOpen={ setShowAddEditNoteDialog } /> }  */ }
            {/* This will clear the Dialog Content */ }

            <AddNoteDialog open={ showAddEditNoteDialog } setOpen={ setShowAddEditNoteDialog } />
            {/* This will not clear the Dialog Content. */ }
        </>
    )
}

export default NavBar