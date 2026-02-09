import { useState, useEffect } from 'react';
import { LegalUpdate } from '../../types';
import { MOCK_UPDATES } from '../../constants';
import { supabase } from '../lib/supabaseClient';

export const useLegalUpdates = () => {
  const [updates, setUpdates] = useState<LegalUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      // 1. Check if Supabase client is available
      if (!supabase) {
        console.warn("Supabase client not configured. Using Mock Data.");
        setUpdates(MOCK_UPDATES);
        setLoading(false);
        return;
      }

      try {
        // 2. Fetch from 'articles' table in Supabase
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false }); // Sort by newest first

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Map database fields to LegalUpdate type if necessary
          // Assuming the structure matches exactly for now
          setUpdates(data as LegalUpdate[]);
        } else {
          // Fallback to Mock data if database is empty (optional)
          // or just show empty list: setUpdates([])
           console.log("No articles in database, using fallback.");
           setUpdates(MOCK_UPDATES);
        }

      } catch (err) {
        console.error("Error loading updates from Supabase:", err);
        // Fallback on error so the site isn't broken
        setUpdates(MOCK_UPDATES);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return { updates, loading };
};