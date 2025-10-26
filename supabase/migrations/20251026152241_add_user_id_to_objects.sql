-- Add user_id column for ownership
ALTER TABLE objects ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Enable RLS policies (already enabled, but ensuring)
-- Note: RLS is already enabled in previous migration

-- Policy: Users can view their own objects
CREATE POLICY "Users can view their own objects" ON objects
FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own objects
CREATE POLICY "Users can insert their own objects" ON objects
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own objects
CREATE POLICY "Users can update their own objects" ON objects
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own objects
CREATE POLICY "Users can delete their own objects" ON objects
FOR DELETE USING (auth.uid() = user_id);