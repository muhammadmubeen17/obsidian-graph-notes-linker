
import React from 'react';
import { Node, Note } from './ObsidianInterface';
import { Book } from 'lucide-react';

interface SidebarProps {
  nodes: Node[];
  notes: Note[];
  selectedNode: Node | null;
  onNodeSelect: (node: Node) => void;
  searchTerm: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  nodes, 
  notes, 
  selectedNode, 
  onNodeSelect,
  searchTerm 
}) => {
  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'identity': return 'bg-purple-600';
      case 'platform': return 'bg-cyan-600';
      case 'identifier': return 'bg-emerald-600';
      default: return 'bg-gray-600';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'identity': return '👤';
      case 'platform': return '🔗';
      case 'identifier': return '🏷️';
      default: return '📄';
    }
  };

  const nodeHasNote = (nodeId: string) => {
    return notes.some(note => note.nodeId === nodeId);
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Nodes Section */}
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Nodes ({nodes.length})
        </h2>
        
        <div className="space-y-2">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onNodeSelect(node)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                selectedNode?.id === node.id
                  ? 'bg-purple-50 border border-purple-300'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${getNodeTypeColor(node.type)} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                  {getNodeIcon(node.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium truncate">
                      {node.label}
                    </span>
                    {nodeHasNote(node.id) && (
                      <Book className="w-3 h-3 text-purple-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {node.type}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Notes Section */}
      {notes.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Recent Notes ({notes.length})
          </h2>
          
          <div className="space-y-2">
            {notes
              .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
              .slice(0, 5)
              .map((note) => {
                const node = nodes.find(n => n.id === note.nodeId);
                if (!node) return null;
                
                return (
                  <button
                    key={note.id}
                    onClick={() => onNodeSelect(node)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent group"
                  >
                    <div className="flex items-start space-x-3">
                      <Book className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 font-medium text-sm truncate">
                          {note.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {node.label} • {new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(note.lastModified)}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchTerm && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {nodes.length === 0 ? (
              <span>No nodes found for "{searchTerm}"</span>
            ) : (
              <span>{nodes.length} node{nodes.length !== 1 ? 's' : ''} found</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
