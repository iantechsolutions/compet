// 'use client'

// import { Loader2Icon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { api } from '~/trpc/react'
// import { Button } from '../../components/ui/button'
// import { Input } from '../../components/ui/input'

// export default function CreatePost() {
//     const [name, setName] = useState('')

//     const { mutateAsync: createPost, isPending, error } = api.posts.create.useMutation()

//     const router = useRouter()

//     return (
//         <div>
//             {error && <p>{error.message}</p>}
//             <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Post name' />
//             {!isPending && <Button onClick={() => createPost({ name }).then(router.refresh)}>Create post</Button>}
//             {isPending && (
//                 <Button disabled={true}>
//                     <Loader2Icon className='mr-2 animate-spin' /> Creating post
//                 </Button>
//             )}
//         </div>
//     )
// }
