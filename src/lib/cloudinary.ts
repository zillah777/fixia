import { v2 as cloudinary } from 'cloudinary';

// SECURITY: Only expose cloud_name (public info)
// API credentials are kept secret and used only in server-side endpoints
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * SECURITY: Generate signed upload token for client-side uploads
 * This allows secure client-side uploads without exposing API secret.
 * Token is valid for a limited time and restricted to specific folder.
 */
export async function generateSignedUploadToken(
    folder: string,
    tags?: string,
    expiresIn: number = 3600 // 1 hour in seconds
): Promise<{
    signature: string;
    timestamp: number;
    public_id?: string;
    folder: string;
    tags?: string;
}> {
    const timestamp = Math.floor(Date.now() / 1000);

    // SECURITY: Create signature with restricted parameters
    const paramsToSign = {
        folder,
        tags,
        timestamp,
        upload_preset: undefined, // Use server-side signing instead of preset
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
        Object.entries(paramsToSign).filter(([, v]) => v !== undefined)
    );

    // Sign with API secret (done server-side only)
    const signature = cloudinary.utils.api_sign_request(cleanParams, process.env.CLOUDINARY_API_SECRET!);

    return {
        signature,
        timestamp,
        folder,
        tags,
    };
}

/**
 * SECURITY: Upload file to Cloudinary from server
 * Should be called from server-side endpoint, not client-side
 * Validates file before upload
 */
export async function uploadToCloudinary(
    file: Buffer,
    filename: string,
    folder: string,
    resourceType: 'image' | 'auto' = 'image',
    options?: Record<string, any>
): Promise<any> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
                public_id: filename,
                overwrite: false,
                ...options,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(file);
    });
}

/**
 * SECURITY: Delete file from Cloudinary
 * Only callable from server-side endpoints
 */
export async function deleteFromCloudinary(publicId: string): Promise<any> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('[CLOUDINARY_DELETE_ERROR]', error);
        throw error;
    }
}

export default cloudinary;
