// Without a defined matcher, this one line applies next-auth
// to the entire project
import withAuth from 'next-auth/middleware';

export default withAuth({
    // Matches the pages config in `[...nextauth]`
    pages: {
        signIn: "/login",
    },
})

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: [
        '/',
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|genlogo-dark.svg).*)',
    ],
};