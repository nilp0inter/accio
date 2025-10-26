-- Create object_images table
CREATE TABLE object_images (
    id bigserial PRIMARY KEY,
    object_id bigint NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create index on object_id for performance
CREATE INDEX idx_object_images_object_id ON object_images(object_id);

-- Enable Row Level Security
ALTER TABLE object_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only object owners can manage images
CREATE POLICY "Users can view images of their objects" ON object_images
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM objects
        WHERE objects.id = object_images.object_id
        AND objects.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert images for their objects" ON object_images
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM objects
        WHERE objects.id = object_images.object_id
        AND objects.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update images of their objects" ON object_images
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM objects
        WHERE objects.id = object_images.object_id
        AND objects.user_id = auth.uid()
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM objects
        WHERE objects.id = object_images.object_id
        AND objects.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete images of their objects" ON object_images
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM objects
        WHERE objects.id = object_images.object_id
        AND objects.user_id = auth.uid()
    )
);