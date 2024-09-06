import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inicializa Supabase
const SUPABASE_URL = "//hlkkxgasvzokzdwehkjj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa2t4Z2Fzdnpva3pkd2Voa2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NjYwMDEsImV4cCI6MjA0MDU0MjAwMX0.CC2aONtzpwO8DvLl0HOLVCBfnflfATjXEtGnX8M9X3c";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;

