CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,                   -- Unique identifier
    image_file_name VARCHAR(255) NOT NULL UNIQUE,        -- Original file name
    image_file_size BIGINT,                       -- File size in bytes
    image_format VARCHAR(50),                     -- File format (e.g., jpg, png)
    image_width INT,                              -- Image width in pixels
    image_height INT,                             -- Image height in pixels
    image_created_at TIMESTAMP DEFAULT NOW()      -- Timestamp of upload
);
