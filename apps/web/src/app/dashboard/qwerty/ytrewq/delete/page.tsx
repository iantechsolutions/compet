"use client"

import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"


export default function Home() {

    const {mutateAsync: deleteAll} = api.test.DeleteData.useMutation()

    return (
        <div>
            <h1>delete</h1>
            <Button onClick={() => deleteAll()}>Delete</Button>
        </div>
    )
}