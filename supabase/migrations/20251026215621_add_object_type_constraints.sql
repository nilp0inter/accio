-- Add CHECK constraints for object type location rules

-- Remove existing constraints if any (they won't exist yet, but for safety)
ALTER TABLE objects DROP CONSTRAINT IF EXISTS site_locations_null;
ALTER TABLE objects DROP CONSTRAINT IF EXISTS area_locations_matching;
ALTER TABLE objects DROP CONSTRAINT IF EXISTS area_locations_not_null;
ALTER TABLE objects DROP CONSTRAINT IF EXISTS container_item_current_not_null;

-- Site: both locations must be NULL
ALTER TABLE objects ADD CONSTRAINT site_locations_null
  CHECK (
    type != 'site' OR (current_location_id IS NULL AND assigned_location_id IS NULL)
  );

-- Area: current_location_id must equal assigned_location_id and neither can be NULL
ALTER TABLE objects ADD CONSTRAINT area_locations_matching
  CHECK (
    type != 'area' OR (current_location_id = assigned_location_id AND current_location_id IS NOT NULL)
  );

-- Container and Item: current_location_id cannot be NULL
ALTER TABLE objects ADD CONSTRAINT container_item_current_not_null
  CHECK (
    type NOT IN ('container', 'item') OR current_location_id IS NOT NULL
  );

-- Add type validation function for location parent checks
CREATE OR REPLACE FUNCTION validate_location_types()
RETURNS TRIGGER AS $$
BEGIN
  -- Site: locations must be NULL (already checked by constraint)
  IF NEW.type = 'site' THEN
    NEW.current_location_id := NULL;
    NEW.assigned_location_id := NULL;
  END IF;

  -- Area: validate parent types are site or area
  IF NEW.type = 'area' THEN
    IF NEW.current_location_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM objects 
        WHERE id = NEW.current_location_id 
        AND type IN ('site', 'area')
      ) THEN
        RAISE EXCEPTION 'Area location must reference a site or area';
      END IF;
    END IF;
  END IF;

  -- Container and Item: validate parent types are site, area, or container
  IF NEW.type IN ('container', 'item') THEN
    IF NEW.current_location_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM objects 
        WHERE id = NEW.current_location_id 
        AND type IN ('site', 'area', 'container')
      ) THEN
        RAISE EXCEPTION 'Current location must reference a site, area, or container';
      END IF;
    END IF;
    IF NEW.assigned_location_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM objects 
        WHERE id = NEW.assigned_location_id 
        AND type IN ('site', 'area', 'container')
      ) THEN
        RAISE EXCEPTION 'Assigned location must reference a site, area, or container';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_location_types_trigger ON objects;

-- Create trigger
CREATE TRIGGER validate_location_types_trigger
BEFORE INSERT OR UPDATE ON objects
FOR EACH ROW
EXECUTE FUNCTION validate_location_types();
