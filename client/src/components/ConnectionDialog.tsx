import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

interface IConnections {
    id: string,
    name: string,
    profileImage: string,
    role: string,
    username: string
}

const ConnectionDialog = ({ connections }: { connections: IConnections[] }) => {
    const navigate = useNavigate();
    return (
        <Dialog>
            <DialogTrigger><Button variant='secondary'>My Connections</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>My Connections</DialogTitle>
                    {
                        <DialogDescription >
                            {
                                !connections || connections.length === 0 ? <DialogDescription>Nothing to show</DialogDescription> :
                                    connections.map((conn) => (
                                        <div className='flex justify-between my-3 hover:bg-zinc-900 p-5 items-center'>
                                            <div className="image flex space-x-3 items-center">
                                                <img src={conn.profileImage} className='h-14 rounded-full' />
                                                <div>
                                                    <p>{conn.name}</p>
                                                    <p className='text-sm'>@{conn.username}</p>
                                                </div>
                                            </div>
                                            <div className="button"><Button onClick={() => { navigate(`/profile?id=${conn.id}`) }}>View Profile</Button></div>
                                        </div>
                                    ))

                            }
                        </DialogDescription>
                    }
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default ConnectionDialog
