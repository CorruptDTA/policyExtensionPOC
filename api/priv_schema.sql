CREATE TABLE privacy_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    border_hex VARCHAR(7) NOT NULL
);

CREATE TABLE heuristic_keywords (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES privacy_categories(id),
    term VARCHAR(50) NOT NULL
);

-- Insert categories
INSERT INTO privacy_categories (name, color_hex, border_hex) VALUES 
('Location', '#fecaca', '#ef4444'),
('Identifiers', '#fed7aa', '#f97316');

-- Insert keywords mapped via foreign key
INSERT INTO heuristic_keywords (category_id, term) VALUES 
(1, 'gps'),
(1, 'geolocation'),
(2, 'cookies'),
(2, 'third-party');