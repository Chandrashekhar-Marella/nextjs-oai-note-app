import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";

interface AddEditNoteDialogProps
{
    open: boolean,
    setOpen: ( open: boolean ) => void,
    noteToEdit?: Note,
}

const AddEditNoteDialog = ( {
    open,
    setOpen,
    noteToEdit,
}: AddEditNoteDialogProps ) =>
{
    const [ deleteInProgress, setDeleteInProgress ] = useState( false );

    const router = useRouter();

    const form = useForm<CreateNoteSchema>( {
        resolver: zodResolver( createNoteSchema ),
        defaultValues: {
            title: noteToEdit?.title || "",
            content: noteToEdit?.content || "",
        }
    } );

    async function onSubmit ( input: CreateNoteSchema )
    {
        try
        {
            if ( noteToEdit )
            {
                const response = await fetch( "/api/notes", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( {
                        ...input,
                        id: noteToEdit.id,
                    } ),
                } )

                if ( !response.ok ) throw Error( "Status code: " + response.status );
            } else
            {
                const response = await fetch( "/api/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( input ),
                } )

                if ( !response.ok ) throw Error( "Status code: " + response.status );

                form.reset();
            }

            router.refresh()
            setOpen( false );

        } catch ( error )
        {
            console.log( error );
            alert( "Something went wrong. Please try again!" );
        }
    }

    async function deleteNote ()
    {
        if ( !noteToEdit ) return;
        setDeleteInProgress( true );

        try
        {            
            const response = await fetch( "/api/notes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( {                    
                    id: noteToEdit.id
                } ),
            } );

            if ( !response.ok ) throw Error( "Status code: " + response.status );

            router.refresh()
            setOpen( false );

        } catch ( error )
        {
            console.log( error );
            // alert( "Something went wrong. Please try again!" );
            alert( error );
        } finally
        {
            setDeleteInProgress( false );
        }
    }

    return (
        <Dialog open={ open } onOpenChange={ setOpen } >
            <DialogContent>
                <DialogTitle>{ noteToEdit ? "Edit Note" : "Add Note" }</DialogTitle>
                <Form { ...form }>
                    <form
                        onSubmit={ form.handleSubmit( onSubmit ) }
                        className="space-y-3"
                    >
                        <FormField
                            control={ form.control }
                            name="title"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Note title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Note title" { ...field } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="content"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Note content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Note content" { ...field } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />

                        <DialogFooter className="gap-1 sm:gap-0">
                            { noteToEdit && (
                                <LoadingButton
                                    loading={ deleteInProgress }
                                    variant="destructive"
                                    disabled={ form.formState.isSubmitting }
                                    onClick={ deleteNote }
                                    type="button">
                                    Delete Note
                                </LoadingButton>
                            ) }
                            <LoadingButton
                                type="submit"
                                loading={ form.formState.isSubmitting }
                                disabled={ deleteInProgress }
                            >
                                Submit
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddEditNoteDialog