# Database Setup Instructions

Your Supabase database is missing the required `urls` table. Please follow these steps:

## Option 1: Create Table Manually in Supabase Dashboard

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `thrbaswuahefgxmxqfej`
3. Go to "SQL Editor" in the left sidebar
4. Run this SQL to create the basic table:

```sql
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255),
  description TEXT,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own URLs
CREATE POLICY "Users can view own urls" ON urls
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own URLs  
CREATE POLICY "Users can insert own urls" ON urls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own URLs
CREATE POLICY "Users can update own urls" ON urls
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own URLs
CREATE POLICY "Users can delete own urls" ON urls
  FOR DELETE USING (auth.uid() = user_id);
```

5. Click "Run" to execute the SQL

## Option 2: Use the Demo Mode (Current Workaround)

For now, the application works in demo mode using the `/api/demo-shorten` endpoint which doesn't require authentication or database storage. URLs are stored temporarily in memory.

## After Creating the Table

Once you've created the table, the authenticated URL creation should work properly, and you'll be able to:
- Create URLs with user accounts
- View your URL history
- Get detailed analytics
- Use all advanced features

## Verification

After creating the table, try creating a short URL through the web interface. It should work without the "Could not find column" errors.