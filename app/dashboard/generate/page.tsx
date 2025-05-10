import {cookies} from 'next/headers';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {redirect} from 'next/navigation';
import {generateRoute} from '@/lib/ai/route-generator';
import GenerateClient from './client';

export default async function GeneratePage({searchParams}: {
    searchParams: {
        start_point?: string;
        route_priority?: string;
        motorcycle_type?: string;
        distance_type?: string;
        distance?: string;
        duration?: string;
        generate?: string;
    }
}) {
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

    if (searchParams.generate === 'true' && searchParams.start_point) {
        try {
            const routePriority = searchParams.route_priority || profileData?.route_priority || 'scenic';
            const motorcycleType = searchParams.motorcycle_type || profileData?.motorcycle_type || 'standard';

            const params = {
                startPoint: searchParams.start_point,
                routePriority,
                motorcycleType,
                distance: searchParams.distance_type === 'distance' ? parseInt(searchParams.distance || '150') : undefined,
                duration: searchParams.distance_type === 'duration' ? parseFloat(searchParams.duration || '2') : undefined,
            };

            const generatedRoute = await generateRoute(params);

            result = {
                ...generatedRoute,
                inputParams: params,
            };
        } catch (err: any) {
            console.error('Error generating route:', err);
            error = err.message || 'Failed to generate route. Please try again.';
        }
    }

    return (
        <GenerateClient
            userId={userId}
            profileData={profileData || null}
            hasProfileData={hasProfileData || false}
            initialResult={result}
            initialError={error}
            searchParams={searchParams}
        />
    );
}