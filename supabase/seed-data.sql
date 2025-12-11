-- Seed Data for PropertyManage Hub
-- Run this after creating the schema to populate initial test data

-- Insert Properties
INSERT INTO properties (id, slug, name, location, price, rating, reviews, description, amenities, total_rooms, type) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'grand-hotel', 'Grand Hotel', 'New York, USA', 150.00, 4.8, 324, 'A luxurious hotel located in the heart of New York City, offering world-class amenities and exceptional service.', ARRAY['Wi-Fi', 'Parking', 'Restaurant', 'Gym', 'Spa', 'Room Service'], 120, 'Hotel'),
('550e8400-e29b-41d4-a716-446655440001', 'beach-resort', 'Beach Resort', 'Miami, USA', 200.00, 4.9, 456, 'A stunning beachfront resort with direct access to pristine white sand beaches.', ARRAY['Wi-Fi', 'Parking', 'Beach Access', 'Pool', 'Spa', 'Restaurant'], 80, 'Resort'),
('550e8400-e29b-41d4-a716-446655440002', 'mountain-villa', 'Mountain Villa', 'Aspen, USA', 300.00, 4.7, 189, 'A cozy mountain retreat perfect for skiing and nature lovers.', ARRAY['Wi-Fi', 'Fireplace', 'Kitchen', 'Ski Access', 'Parking'], 12, 'Villa'),
('550e8400-e29b-41d4-a716-446655440003', 'city-hotel', 'City Hotel', 'San Francisco, USA', 180.00, 4.6, 278, 'Modern hotel in the heart of downtown with stunning city views.', ARRAY['Wi-Fi', 'Parking', 'Business Center', 'Gym', 'Restaurant'], 95, 'Hotel'),
('550e8400-e29b-41d4-a716-446655440004', 'lakeside-resort', 'Lakeside Resort', 'Lake Tahoe, USA', 250.00, 4.8, 312, 'Peaceful lakeside resort with breathtaking mountain and lake views.', ARRAY['Wi-Fi', 'Parking', 'Lake Access', 'Pool', 'Spa', 'Restaurant'], 60, 'Resort'),
('550e8400-e29b-41d4-a716-446655440005', 'desert-oasis', 'Desert Oasis', 'Scottsdale, USA', 220.00, 4.7, 201, 'Luxury desert resort with world-class spa and golf facilities.', ARRAY['Wi-Fi', 'Parking', 'Golf Course', 'Spa', 'Pool', 'Restaurant'], 75, 'Resort')
ON CONFLICT (id) DO NOTHING;

-- Insert Property Images
INSERT INTO property_images (property_id, url, alt_text, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 'Grand Hotel exterior', 0),
('550e8400-e29b-41d4-a716-446655440000', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&sig=2', 'Grand Hotel lobby', 1),
('550e8400-e29b-41d4-a716-446655440000', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&sig=3', 'Grand Hotel room', 2),
('550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200', 'Beach Resort exterior', 0),
('550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&sig=2', 'Beach Resort beach view', 1),
('550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200', 'Mountain Villa exterior', 0),
('550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&sig=2', 'Mountain Villa interior', 1)
ON CONFLICT DO NOTHING;

-- Insert Room Types
INSERT INTO room_types (property_id, name, price, beds, size, image_url, max_guests, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Deluxe Room', 150.00, '1 King Bed', '300 sq ft', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 2, 'Spacious room with city views'),
('550e8400-e29b-41d4-a716-446655440000', 'Executive Suite', 250.00, '1 King Bed + Sofa', '500 sq ft', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 3, 'Luxurious suite with separate living area'),
('550e8400-e29b-41d4-a716-446655440000', 'Presidential Suite', 500.00, '2 King Beds', '1000 sq ft', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 4, 'Ultimate luxury with panoramic city views'),
('550e8400-e29b-41d4-a716-446655440001', 'Ocean View Room', 200.00, '1 King Bed', '350 sq ft', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 2, 'Room with stunning ocean views'),
('550e8400-e29b-41d4-a716-446655440001', 'Beachfront Suite', 350.00, '1 King Bed + Sofa', '600 sq ft', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&sig=2', 3, 'Direct beach access from your suite'),
('550e8400-e29b-41d4-a716-446655440002', 'Mountain View Cabin', 300.00, '1 Queen Bed', '400 sq ft', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', 2, 'Cozy cabin with mountain views')
ON CONFLICT DO NOTHING;

-- Insert Attractions
INSERT INTO attractions (property_id, name, distance, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Central Park', '0.5 miles', 'Beautiful urban park perfect for walking and relaxation'),
('550e8400-e29b-41d4-a716-446655440000', 'Times Square', '1.2 miles', 'Iconic entertainment hub with theaters and shopping'),
('550e8400-e29b-41d4-a716-446655440000', 'Statue of Liberty', '5 miles', 'Historic monument accessible by ferry'),
('550e8400-e29b-41d4-a716-446655440000', 'Metropolitan Museum', '1 mile', 'World-renowned art museum'),
('550e8400-e29b-41d4-a716-446655440001', 'South Beach', '0.1 miles', 'Famous beach with vibrant nightlife'),
('550e8400-e29b-41d4-a716-446655440001', 'Art Deco District', '0.3 miles', 'Historic architecture and shopping'),
('550e8400-e29b-41d4-a716-446655440002', 'Aspen Mountain', '2 miles', 'World-class skiing and snowboarding'),
('550e8400-e29b-41d4-a716-446655440002', 'Maroon Bells', '10 miles', 'Most photographed peaks in North America')
ON CONFLICT DO NOTHING;

-- Insert Features
INSERT INTO features (property_id, name, icon, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', '24/7 Concierge', '👨‍💼', 'Round-the-clock assistance for all your needs'),
('550e8400-e29b-41d4-a716-446655440000', 'Fine Dining', '🍽️', 'Award-winning restaurant with international cuisine'),
('550e8400-e29b-41d4-a716-446655440000', 'Spa & Wellness', '🧘', 'Full-service spa with massage and wellness treatments'),
('550e8400-e29b-41d4-a716-446655440000', 'Business Center', '💼', 'Fully equipped meeting rooms and business facilities'),
('550e8400-e29b-41d4-a716-446655440000', 'Fitness Center', '💪', 'State-of-the-art gym with personal trainers'),
('550e8400-e29b-41d4-a716-446655440000', 'Rooftop Pool', '🏊', 'Stunning rooftop pool with city views'),
('550e8400-e29b-41d4-a716-446655440001', 'Private Beach', '🏖️', 'Exclusive beach access for guests'),
('550e8400-e29b-41d4-a716-446655440001', 'Water Sports', '🏄', 'Kayaking, paddleboarding, and more'),
('550e8400-e29b-41d4-a716-446655440002', 'Ski-in/Ski-out', '⛷️', 'Direct access to ski slopes'),
('550e8400-e29b-41d4-a716-446655440002', 'Hot Tub', '🛁', 'Outdoor hot tub with mountain views')
ON CONFLICT DO NOTHING;

-- Insert Property About
INSERT INTO property_about (property_id, description, history, awards) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Grand Hotel has been serving guests with excellence since 1920. Located in the heart of Manhattan, we offer a perfect blend of historic charm and modern luxury.', 'Established in 1920, Grand Hotel has hosted numerous celebrities, dignitaries, and world leaders. The hotel underwent a major renovation in 2018, preserving its historic character while adding modern amenities.', ARRAY['AAA Five Diamond Award', 'Travel + Leisure World''s Best', 'Conde Nast Readers'' Choice']),
('550e8400-e29b-41d4-a716-446655440001', 'Beach Resort offers the ultimate beachfront experience with world-class amenities and exceptional service.', 'Opened in 2015, Beach Resort quickly became a favorite destination for beach lovers and luxury travelers.', ARRAY['TripAdvisor Travelers'' Choice', 'Best Beach Resort 2020']),
('550e8400-e29b-41d4-a716-446655440002', 'Mountain Villa provides a perfect mountain retreat for those seeking peace, adventure, and natural beauty.', 'Built in 2010, Mountain Villa combines rustic charm with modern comforts in the heart of the mountains.', ARRAY['Best Mountain Retreat 2019'])
ON CONFLICT (property_id) DO NOTHING;

-- Insert Property Contact
INSERT INTO property_contact (property_id, phone, email, address, hours) VALUES
('550e8400-e29b-41d4-a716-446655440000', '+1 (212) 555-0123', 'info@grandhotel.com', '123 Park Avenue, New York, NY 10001', 'Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM'),
('550e8400-e29b-41d4-a716-446655440001', '+1 (305) 555-0124', 'info@beachresort.com', '456 Ocean Drive, Miami, FL 33139', 'Front Desk: 24/7 | Restaurant: 7:00 AM - 10:00 PM'),
('550e8400-e29b-41d4-a716-446655440002', '+1 (970) 555-0125', 'info@mountainvilla.com', '789 Mountain Road, Aspen, CO 81611', 'Front Desk: 7:00 AM - 10:00 PM | Restaurant: 8:00 AM - 9:00 PM'),
('550e8400-e29b-41d4-a716-446655440003', '+1 (415) 555-0126', 'info@cityhotel.com', '789 Market Street, San Francisco, CA 94102', 'Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM'),
('550e8400-e29b-41d4-a716-446655440004', '+1 (530) 555-0127', 'info@lakesideresort.com', '123 Lakeview Drive, Lake Tahoe, CA 96150', 'Front Desk: 24/7 | Restaurant: 7:00 AM - 10:00 PM'),
('550e8400-e29b-41d4-a716-446655440005', '+1 (480) 555-0128', 'info@desertoasis.com', '456 Desert Boulevard, Scottsdale, AZ 85251', 'Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM')
ON CONFLICT (property_id) DO UPDATE SET
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  hours = EXCLUDED.hours,
  updated_at = NOW();

-- Insert Sample Bookings
INSERT INTO bookings (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, status, source, amount) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john.doe@example.com', '+1 (555) 123-4567', '2024-01-15', '2024-01-18', 2, 'confirmed', 'website', 450.00),
('550e8400-e29b-41d4-a716-446655440001', 'Jane Smith', 'jane.smith@example.com', '+1 (555) 234-5678', '2024-01-16', '2024-01-20', 2, 'pending', 'airbnb', 600.00),
('550e8400-e29b-41d4-a716-446655440002', 'Mike Johnson', 'mike.johnson@example.com', '+1 (555) 345-6789', '2024-01-17', '2024-01-19', 1, 'confirmed', 'booking.com', 380.00)
ON CONFLICT DO NOTHING;

