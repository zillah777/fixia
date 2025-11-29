import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from '@/app/(auth)/register/page'

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

// Mock UI Components to avoid JSDOM issues
jest.mock('@/components/ui/button', () => ({
    Button: (props: any) => <button {...props} />,
}))
jest.mock('@/components/ui/input', () => ({
    Input: (props: any) => <input {...props} />,
}))
jest.mock('@/components/ui/form', () => ({
    Form: ({ children }: any) => <div>{children}</div>,
    FormControl: ({ children }: any) => <div>{children}</div>,
    FormField: ({ render }: any) => render({ field: { onChange: jest.fn(), value: '' } }),
    FormItem: ({ children }: any) => <div>{children}</div>,
    FormLabel: ({ children }: any) => <label>{children}</label>,
    FormMessage: () => <div>Error</div>,
}))
jest.mock('@/components/ui/card', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <h1>{children}</h1>,
    CardDescription: ({ children }: any) => <p>{children}</p>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    CardFooter: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/components/ui/radio-group', () => ({
    RadioGroup: ({ children }: any) => <div>{children}</div>,
    RadioGroupItem: (props: any) => <input type="radio" {...props} />,
}))
jest.mock('@/components/ui/label', () => ({
    Label: ({ children }: any) => <label>{children}</label>,
}))

// Mock external libraries
jest.mock('lucide-react', () => ({
    Loader2: () => <div>Loader</div>,
    User: () => <div>User</div>,
    Briefcase: () => <div>Briefcase</div>,
}))
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}))
// Mock react-hook-form
jest.mock('react-hook-form', () => ({
    useForm: () => ({
        control: {},
        handleSubmit: (fn: any) => (e: any) => {
            e.preventDefault()
            fn()
        },
        register: jest.fn(),
        formState: { errors: {} },
    }),
}))
jest.mock('@hookform/resolvers/zod', () => ({
    zodResolver: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

describe('Authentication Flow Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders registration form correctly', () => {
        render(<RegisterPage />)

        expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
    })
})
