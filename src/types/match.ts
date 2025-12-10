export interface User {
    id: string
    name: string
    image?: string
    avatar?: string
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
    clientId: string
    providerId: string
    request: Request
    reviews?: { authorId: string; rating: number; comment: string }[]
    // Work completion approval system
    providerApprovedCompletion?: boolean | null
    clientApprovedCompletion?: boolean | null
    providerCompletionComment?: string | null
}

export interface Message {
    id: number | string
    senderId: string
    text: string
    createdAt: string
}
