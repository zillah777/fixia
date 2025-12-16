export interface Professional {
    id: string
    name: string
    role: string
    avatar?: string
    location: string
    rating: number
    reviews: number
    verified: boolean
    tags: string[]
    price: string
    bio?: string
    profile?: {
        badges: string[]
        bio?: string
        ratingAvg?: number
    }
}
