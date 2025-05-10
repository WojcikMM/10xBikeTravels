import {cookies} from 'next/headers';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {redirect} from 'next/navigation';
import {generateRoute} from '@/lib/ai/route-generator';
import GenerateClient from './client';

export default async function GeneratePage() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});

    const {data: {session}} = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const userId = session.user.id;

    const {data: profileData} = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    const hasProfileData = profileData?.route_priority && profileData?.motorcycle_type;

    let result = null;
    let error = null;

    return (
        <GenerateClient
            userId={userId}
            profileData={profileData || null}
            hasProfileData={hasProfileData || false}
            initialResult={result}
            initialError={error}
        />
    );
}