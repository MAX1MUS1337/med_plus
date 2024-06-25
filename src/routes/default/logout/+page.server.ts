import { redirect, type ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async function ({ cookies }) {
    cookies.delete("tok", {path: "/"})
    redirect(302, "/default/auth")
}