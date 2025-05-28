
import React, { useState } from 'react';
import { GraphView } from './GraphView';
import { NoteEditor } from './NoteEditor';
import { Sidebar } from './Sidebar';
import { Search } from 'lucide-react';

export interface Node {
  id: string;
  type: string;
  label: string;
  data: {
    type: string;
    reliable?: boolean;
    status?: string;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  nodeId: string;
  lastModified: Date;
}

const initialGraphData = {
  nodes: [
    {
      id: "central",
      type: "identity",
      label: "Haseeb Ahmad",
      data: { type: "person" }
    },
    {
      id: "snapchat",
      type: "platform",
      label: "snapchat",
      data: { type: "platform", reliable: true, status: "found" }
    },
    {
      id: "pinterest",
      type: "platform", 
      label: "pinterest",
      data: { type: "platform", reliable: true, status: "found" }
    },
    {
      id: "picsart",
      type: "platform",
      label: "picsart", 
      data: { type: "platform", reliable: true, status: "found" }
    },
    {
      id: "notion",
      type: "platform",
      label: "notion",
      data: { type: "platform", reliable: true, status: "found" }
    },
    {
      id: "github",
      type: "platform",
      label: "github", 
      data: { type: "platform", reliable: true, status: "found" }
    },
    {
      id: "microsoft",
      type: "platform",
      label: "microsoft",
      data: { type: "platform", reliable: true, status: "found" }
    }
  ],
  edges: [
    { id: "central-snapchat", source: "central", target: "snapchat", type: "has_account" },
    { id: "central-pinterest", source: "central", target: "pinterest", type: "has_account" },
    { id: "central-picsart", source: "central", target: "picsart", type: "has_account" },
    { id: "central-notion", source: "central", target: "notion", type: "has_account" },
    { id: "central-github", source: "central", target: "github", type: "has_account" },
    { id: "central-microsoft", source: "central", target: "microsoft", type: "has_account" }
  ]
};

export const ObsidianInterface: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'graph' | 'note'>('graph');

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
    setCurrentView('note');
  };

  const handleNoteUpdate = (nodeId: string, title: string, content: string) => {
    const existingNoteIndex = notes.findIndex(note => note.nodeId === nodeId);
    
    if (existingNoteIndex >= 0) {
      const updatedNotes = [...notes];
      updatedNotes[existingNoteIndex] = {
        ...updatedNotes[existingNoteIndex],
        title,
        content,
        lastModified: new Date()
      };
      setNotes(updatedNotes);
    } else {
      const newNote: Note = {
        id: `note-${nodeId}-${Date.now()}`,
        title,
        content,
        nodeId,
        lastModified: new Date()
      };
      setNotes([...notes, newNote]);
    }
  };

  const getCurrentNote = (): Note | null => {
    if (!selectedNode) return null;
    return notes.find(note => note.nodeId === selectedNode.id) || null;
  };

  const filteredNodes = initialGraphData.nodes.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Graph Notes</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('graph')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'graph'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Graph View
            </button>
            <button
              onClick={() => setCurrentView('note')}
              disabled={!selectedNode}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'note' && selectedNode
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              Note Editor
            </button>
          </div>
        </div>

        <Sidebar 
          nodes={filteredNodes}
          notes={notes}
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          searchTerm={searchTerm}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentView === 'graph' ? (
          <GraphView
            nodes={initialGraphData.nodes}
            edges={initialGraphData.edges}
            onNodeSelect={handleNodeSelect}
            selectedNode={selectedNode}
          />
        ) : (
          selectedNode && (
            <NoteEditor
              node={selectedNode}
              note={getCurrentNote()}
              onNoteUpdate={handleNoteUpdate}
            />
          )
        )}
      </div>
    </div>
  );
};
