/**
 * Generates an avatar URL for a user
 * Tries multiple fallback sources in order:
 * 1. User's stored avatar URL
 * 2. ui-avatars.com (generates beautiful avatars from name)
 * 3. initials in a colored circle
 */
export function getAvatarUrl(avatar: string | null | undefined, name: string = "User"): string {
    // If user has a stored avatar, use it
    if (avatar && avatar.trim()) {
        return avatar
    }

    // Fallback to ui-avatars.com API with fun avatars
    const encodedName = encodeURIComponent(name)
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random`
}

/**
 * Alternative avatar generators for fallback
 */
export const avatarProviders = {
    dicebear: (name: string) => `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(name)}&backgroundColor=random`,
    uiAvatars: (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    gravatar: (email: string) => `https://www.gravatar.com/avatar/${email}?d=identicon&s=200`,
}

/**
 * Get the first letter(s) for avatar fallback text
 */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}
