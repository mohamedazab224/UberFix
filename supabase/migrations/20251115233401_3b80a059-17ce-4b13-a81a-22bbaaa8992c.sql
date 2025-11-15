-- Delete duplicate properties keeping only the latest one
DELETE FROM properties 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY code ORDER BY created_at DESC) as rn
    FROM properties 
    WHERE code IS NOT NULL
  ) t WHERE rn > 1
);

-- Delete properties with duplicate names keeping the latest
DELETE FROM properties 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, type ORDER BY created_at DESC) as rn
    FROM properties 
    WHERE name IS NOT NULL
  ) t WHERE rn > 1
);

-- Now add unique constraints
ALTER TABLE properties 
ADD CONSTRAINT properties_code_unique UNIQUE (code);

CREATE UNIQUE INDEX properties_name_type_unique ON properties (name, type) 
WHERE name IS NOT NULL;