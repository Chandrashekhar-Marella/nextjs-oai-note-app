"use client"

import { useState } from "react";
import { Note as NoteModel } from "@prisma/client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import AddEditNoteDialog from "./AddEditNoteDialog";


interface NoteProps
{
    note: NoteModel;
}

const Note = ( { note }: NoteProps ) => 
{
    const [ showEditDialog, setShowEditDialog ] = useState( false );

    const wasUpdated = note.updatedAt > note.createdAt;

    const createdUpdatedAtTimestamp = (
        wasUpdated ? note.updatedAt : note.createdAt
    ).toDateString();


    return (
        <>
            <Card
                onClick={ () => setShowEditDialog( true ) }
                className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                    <CardTitle>{ note.title }</CardTitle>
                    <CardDescription>
                        { createdUpdatedAtTimestamp }
                        { wasUpdated && " (updated)" }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">
                        { note.content }
                    </p>
                </CardContent>
            </Card>

            <AddEditNoteDialog
                open={ showEditDialog }
                setOpen={ setShowEditDialog }
                noteToEdit={ note }
            />
        </>
    )
}

export default Note;