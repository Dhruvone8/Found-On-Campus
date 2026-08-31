export function normalizeEmail(email: unknown): string | null {
    if (typeof email !== "string" || !email.trim()) {
        return null;
    }

    return email.trim().toLowerCase();
}

export function isCollegeEmail(email: string): boolean {
    const isCollegeEmail = email.endsWith("@vit.edu.in");

    const isDevTestEmail =
        process.env.NODE_ENV !== "production" &&
        email === process.env.DEV_TEST_EMAIL;

    return isCollegeEmail || isDevTestEmail;
}