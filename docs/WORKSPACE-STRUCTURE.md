# Workspace Structure Documentation

## Overview
This document outlines the Linear-inspired workspace structure with Kanban boards and phase sidebars for the CompanyOS application.

## Folder Structure

```
components/
├── workspace/
│   ├── index.ts                    # Main export file
│   ├── WorkspaceLayout.tsx         # Main layout component
│   ├── KanbanBoard.tsx            # Kanban board with drag & drop
│   ├── KanbanCard.tsx             # Individual card component
│   ├── KanbanColumnHeader.tsx     # Column header component
│   ├── PhaseSidebar.tsx           # Right sidebar with phases
│   └── LeftPanel.tsx              # Left navigation panel
└── [existing components]

pages/
├── workspace-demo.tsx             # Demo page showcasing the workspace
└── [existing pages]
```

## Component Architecture

### 1. WorkspaceLayout.tsx
**Main container component** that orchestrates the three-panel layout:
- **Left Panel**: Navigation, agent stack, quick actions
- **Center Panel**: Kanban board with draggable columns and cards
- **Right Panel**: Phase overview with metrics and progress

**Key Features:**
- Responsive layout with flexbox
- TypeScript interfaces for all data structures
- Support for different workspace types (fundraising, hiring, marketing, etc.)

### 2. KanbanBoard.tsx
**Interactive Kanban board** with Linear-inspired design:
- Horizontal scrolling columns
- Drag and drop functionality
- Add item/column buttons
- Board header with actions

**Key Features:**
- State management for columns and items
- Drag and drop between columns
- Responsive design with proper overflow handling

### 3. KanbanCard.tsx
**Individual card component** showing item details:
- Priority indicators with colors and icons
- Assignee information with status
- Tags and descriptions
- Timestamps and status

**Key Features:**
- Priority-based color coding
- Responsive design for different content lengths
- Hover effects and interactions

### 4. PhaseSidebar.tsx
**Right sidebar** showing workflow phases:
- Phase status and progress
- Agent assignments
- Metrics and progress bars
- Quick actions per phase

**Key Features:**
- Scrollable content for many phases
- Progress visualization
- Agent status indicators
- Interactive quick actions

### 5. LeftPanel.tsx
**Left navigation panel** with workspace controls:
- Workspace type indicator
- Navigation menu
- Agent stack status
- Quick actions

**Key Features:**
- Workspace-specific icons
- Agent status indicators
- Navigation with icons
- User profile section

## Data Structures

### Core Types
```typescript
interface Phase {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  agents: Agent[];
  metrics: PhaseMetrics;
  quickActions: QuickAction[];
}

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: Agent;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  role: string;
}
```

## Styling Approach

### Design System
- **Colors**: Tailwind CSS with consistent color palette
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Subtle shadows for depth and hierarchy
- **Borders**: Clean borders with consistent radius

### Linear-Inspired Elements
- Clean, minimal design
- Soft shadows and subtle borders
- Consistent spacing and typography
- Smooth transitions and hover effects
- Professional color scheme

## Current Status

### ✅ Completed
- [x] Core component structure
- [x] TypeScript interfaces
- [x] Linear-inspired design
- [x] Drag and drop functionality
- [x] Responsive layout
- [x] Sample data and demo page
- [x] Component exports and documentation

### 🔄 In Progress
- [ ] Integration with real agent system
- [ ] Backend API connections
- [ ] Real-time updates
- [ ] User authentication integration

### 📋 Next Steps

#### Phase 1: Integration (Week 1-2)
1. **Connect to Agent System**
   - Integrate with existing agent registry
   - Connect agent status updates
   - Implement agent assignment logic

2. **Backend Integration**
   - Create API endpoints for workspace data
   - Implement CRUD operations for items
   - Add real-time updates via WebSocket

3. **Database Schema**
   - Design workspace tables
   - Create relationships between items, phases, and agents
   - Implement data persistence

#### Phase 2: Features (Week 3-4)
1. **Advanced Interactions**
   - Multi-select and bulk actions
   - Keyboard shortcuts
   - Advanced filtering and search
   - Custom views and layouts

2. **Agent Integration**
   - Real agent execution
   - Agent task assignment
   - Agent communication
   - Agent performance metrics

3. **Workflow Automation**
   - Phase transitions
   - Automated task assignment
   - Notification system
   - Progress tracking

#### Phase 3: Enhancement (Week 5-6)
1. **Analytics & Reporting**
   - Phase performance metrics
   - Agent productivity tracking
   - Workflow optimization insights
   - Custom dashboards

2. **Customization**
   - Custom workspace templates
   - Configurable phases and workflows
   - Custom fields and properties
   - Theme customization

3. **Advanced Features**
   - Time tracking
   - File attachments
   - Comments and collaboration
   - Integration with external tools

## Usage Examples

### Basic Workspace Setup
```typescript
import { WorkspaceLayout } from '../components/workspace';

const MyWorkspace = () => {
  return (
    <WorkspaceLayout
      workspaceType="fundraising"
      title="Fundraising Pipeline"
      phases={myPhases}
      columns={myColumns}
    />
  );
};
```

### Custom Kanban Board
```typescript
import { KanbanBoard } from '../components/workspace';

const CustomBoard = () => {
  return (
    <KanbanBoard
      title="Custom Board"
      columns={customColumns}
      workspaceType="custom"
    />
  );
};
```

## Testing Strategy

### Unit Tests
- Component rendering tests
- Props validation tests
- Event handler tests
- State management tests

### Integration Tests
- Drag and drop functionality
- Data flow between components
- API integration tests
- Real-time update tests

### E2E Tests
- Complete workflow scenarios
- User interaction flows
- Cross-browser compatibility
- Performance testing

## Performance Considerations

### Optimization Strategies
- Virtual scrolling for large lists
- Lazy loading of components
- Memoization of expensive calculations
- Efficient re-rendering with React.memo

### Monitoring
- Component render performance
- Memory usage
- Network request optimization
- User interaction metrics

## Accessibility

### WCAG Compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements
- Focus management

### Features
- ARIA labels and descriptions
- Semantic HTML structure
- Keyboard shortcuts
- High contrast mode support

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
- Drag and drop API
- CSS Grid and Flexbox
- Modern JavaScript features
- WebSocket support

---

This workspace structure provides a solid foundation for building sophisticated workflow management tools with a modern, Linear-inspired interface. The modular design allows for easy extension and customization while maintaining consistency across different workspace types. 