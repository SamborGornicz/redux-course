import { Auth } from '@supabase/ui'
import { supabase } from "../lib/api";

const AuthWrapper = () => (
    <div className='flex justify-center items-center min-h-screen'>
        <div className="w-10/12 md:w-6/12 lg:w-4/12 xl:w-3/12 p-4">
            <Auth
                supabaseClient={supabase}
                providers={['github']}
            />
        </div>
    </div>
);

export default AuthWrapper;
