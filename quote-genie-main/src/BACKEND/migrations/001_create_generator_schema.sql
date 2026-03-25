-- Database schema for Automated Proposal & Quotation Generator
-- Run this to update the existing database

-- Proposals table (enhanced with generator features)
DROP TABLE IF EXISTS proposal_versions CASCADE;
DROP TABLE IF EXISTS proposals_generator CASCADE;

CREATE TABLE proposals_generator (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  project_type VARCHAR(100),
  requirements TEXT,
  services JSONB,
  cost_estimation DECIMAL(12, 2),
  generated_content TEXT,
  template_type VARCHAR(50) DEFAULT 'standard',
  status VARCHAR(50) DEFAULT 'draft',
  current_version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proposal versions table for tracking changes
CREATE TABLE proposal_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals_generator(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  title VARCHAR(255),
  client_name VARCHAR(255),
  generated_content TEXT,
  cost_estimation DECIMAL(12, 2),
  change_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requirements template table
CREATE TABLE requirement_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  project_type VARCHAR(100),
  required_fields JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cost estimation history
CREATE TABLE cost_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals_generator(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  base_cost DECIMAL(10, 2),
  quantity INT DEFAULT 1,
  complexity_factor DECIMAL(3, 2) DEFAULT 1.0,
  total_cost DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_proposals_generator_user_id ON proposals_generator(user_id);
CREATE INDEX idx_proposals_generator_status ON proposals_generator(status);
CREATE INDEX idx_proposal_versions_proposal_id ON proposal_versions(proposal_id);
CREATE INDEX idx_requirement_templates_user_id ON requirement_templates(user_id);
CREATE INDEX idx_cost_estimates_proposal_id ON cost_estimates(proposal_id);

-- Insert sample requirement templates
INSERT INTO requirement_templates (user_id, name, project_type, required_fields)
SELECT 
  (SELECT id FROM users LIMIT 1),
  'Web Development',
  'web',
  '{"timeline":{"label":"Project Timeline","required":true},"budget":{"label":"Budget Range","required":true},"features":{"label":"Required Features","required":true},"users":{"label":"Target Users","required":true}}'
ON CONFLICT DO NOTHING;

INSERT INTO requirement_templates (user_id, name, project_type, required_fields)
SELECT 
  (SELECT id FROM users LIMIT 1),
  'Mobile App',
  'mobile',
  '{"platforms":{"label":"Platforms (iOS/Android)","required":true},"timeline":{"label":"Timeline","required":true},"features":{"label":"Core Features","required":true},"budget":{"label":"Budget","required":true}}'
ON CONFLICT DO NOTHING;

COMMIT;
