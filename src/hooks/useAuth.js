// src/hooks/useAuth.js
// Re-exports from context for cleaner imports in components
// WHY: components write "import { useAuth } from '../hooks/useAuth'"
// instead of "import { useAuth } from '../../context/AuthContext'"
export { useAuth } from '../context/AuthContext'