import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for general operations (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for storage operations (with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Initialize storage bucket
export const initializeStorage = async () => {
    try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
        
        if (listError) {
            console.error('Error listing buckets:', listError);
            throw listError;
        }

        const bucketExists = buckets.some(bucket => bucket.name === 'movie-poster');
        
        if (!bucketExists) {
            // Create bucket if it doesn't exist
            const { data, error } = await supabaseAdmin.storage.createBucket('movie-poster', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
            });
            
            if (error) {
                console.error('Error creating bucket:', error);
                throw error;
            }
            
            console.log('✅ Storage bucket created successfully');
        } else {
            console.log('✅ Storage bucket already exists');
        }
    } catch (error) {
        console.error('❌ Storage initialization failed:', error);
        throw error;
    }
};