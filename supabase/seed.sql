-- ====================================================================
-- NEXUSBIZ MULTI-COUNTRY BUSINESS DIRECTORY - SEED DATA (SUPABASE)
-- ====================================================================

-- 1. Insert Countries
INSERT INTO public.countries (id, name, slug, code, flag_emoji, phone_prefix, currency, is_active)
VALUES 
  ('11111111-0000-0000-0000-000000000001', 'Pakistan', 'pakistan', 'PK', '🇵🇰', '+92', 'PKR', true),
  ('11111111-0000-0000-0000-000000000002', 'United States', 'usa', 'US', '🇺🇸', '+1', 'USD', true),
  ('11111111-0000-0000-0000-000000000003', 'United Kingdom', 'uk', 'GB', '🇬🇧', '+44', 'GBP', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Regions
INSERT INTO public.regions (id, country_id, name, slug, code)
VALUES
  -- Pakistan
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Punjab', 'punjab', 'PB'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Sindh', 'sindh', 'SD'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Islamabad Capital Territory', 'islamabad-capital', 'ICT'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'Khyber Pakhtunkhwa', 'khyber-pakhtunkhwa', 'KP'),
  -- USA
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'California', 'california', 'CA'),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', 'New York', 'new-york', 'NY'),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000002', 'Texas', 'texas', 'TX'),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000002', 'Illinois', 'illinois', 'IL'),
  -- UK
  ('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000003', 'England', 'england', 'ENG'),
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000003', 'Scotland', 'scotland', 'SCT')
ON CONFLICT DO NOTHING;

-- 3. Insert Cities
INSERT INTO public.cities (id, country_id, region_id, name, slug, postal_code, is_popular)
VALUES
  -- Pakistan Cities
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Lahore', 'lahore', '54000', true),
  ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Rawalpindi', 'rawalpindi', '46000', true),
  ('33333333-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Multan', 'multan', '60000', true),
  ('33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Karachi', 'karachi', '74200', true),
  ('33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', 'Islamabad', 'islamabad', '44000', true),
  -- USA Cities
  ('33333333-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005', 'San Francisco', 'san-francisco', '94102', true),
  ('33333333-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005', 'Los Angeles', 'los-angeles', '90001', true),
  ('33333333-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000006', 'New York City', 'new-york-city', '10001', true),
  ('33333333-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000007', 'Austin', 'austin', '78701', true),
  ('33333333-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000008', 'Chicago', 'chicago', '60601', true),
  -- UK Cities
  ('33333333-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009', 'London', 'london', 'EC1A 1BB', true),
  ('33333333-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009', 'Manchester', 'manchester', 'M1 1AD', true),
  ('33333333-0000-0000-0000-000000000013', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009', 'Birmingham', 'birmingham', 'B1 1AA', true),
  ('33333333-0000-0000-0000-000000000014', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000010', 'Edinburgh', 'edinburgh', 'EH1 1YZ', true)
ON CONFLICT DO NOTHING;

-- 4. Insert Categories
INSERT INTO public.categories (id, name, slug, icon, description, display_order)
VALUES
  ('44444444-0000-0000-0000-000000000001', 'IT & Software', 'it-software', 'Laptop', 'Custom software development, cloud infrastructure, AI solutions, web and mobile app development.', 1),
  ('44444444-0000-0000-0000-000000000002', 'Healthcare & Medical', 'healthcare', 'Stethoscope', 'Hospitals, dental clinics, specialty diagnostics, certified pharmacies, and healthcare centers.', 2),
  ('44444444-0000-0000-0000-000000000003', 'Banking & Finance', 'banking-finance', 'Building2', 'Commercial banks, accounting firms, investment advisors, audit services, and insurance agencies.', 3),
  ('44444444-0000-0000-0000-000000000004', 'Construction & Real Estate', 'construction-real-estate', 'HardHat', 'General contractors, architectural designers, real estate brokers, and structural engineers.', 4),
  ('44444444-0000-0000-0000-000000000005', 'Restaurants & Dining', 'restaurants-food', 'UtensilsCrossed', 'Fine dining, artisanal cafes, traditional local cuisine, bakeries, and catering services.', 5),
  ('44444444-0000-0000-0000-000000000006', 'Legal Services', 'legal-services', 'Scale', 'Corporate law practitioners, immigration solicitors, civil litigation, and notary public.', 6),
  ('44444444-0000-0000-0000-000000000007', 'Education & Training', 'education', 'GraduationCap', 'Accredited universities, colleges, professional test prep centers, and vocational institutes.', 7),
  ('44444444-0000-0000-0000-000000000008', 'Hotels & Hospitality', 'hotels-travel', 'Hotel', 'Boutique hotels, executive resorts, corporate travel agencies, and serviced apartments.', 8)
ON CONFLICT (slug) DO NOTHING;

-- Complete seed script ready for deployment
