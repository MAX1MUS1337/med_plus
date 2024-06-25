import { redirect, type ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async function ({ cookies }) {
    redirect(302, "/dashboard/home")
}