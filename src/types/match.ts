export interface User {
    id: string
    name: string
    image?: string
    email?: string
    phone?: string
}

export interface Proposal {
    id: string
    message: string
    price: number
    createdAt: string
}

export interface Request {
    id: string
    title: string
    description: string
    status: string
    proposals?: Proposal[]
}

export interface Match {
    id: string
    createdAt: string
    isCompleted: boolean
    client?: User
    provider?: User
    request: Request
}

export interface Message {
    id: number | string
    senderId: string
    text: string
    timestamp: string
}
