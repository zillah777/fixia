declare module 'isomorphic-dompurify' {
    const DOMPurify: {
        sanitize: (dirty: string, options?: any) => string;
        // Add other methods if needed
    };
    export default DOMPurify;
}
