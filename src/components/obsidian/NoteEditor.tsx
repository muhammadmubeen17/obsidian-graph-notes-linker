
import React, { useState, useEffect } from 'react';
import { Node, Note } from './ObsidianInterface';
import { ArrowUp } from 'lucide-react';

interface NoteEditorProps {
  node: Node;
  note: Note | null;
  onNoteUpdate: (nodeId: string, title: string, content: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  node, 
  note, 
  onNoteUpdate 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle(node.label);
      setContent('');
    }
  }, [node, note]);

  const handleSave = () => {
    onNoteUpdate(node.id, title, content);
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'identity': return 'text-purple-400';
      case 'platform': return 'text-cyan-400';
      case 'identifier': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getNodeTypeColor(node.type)} bg-gray-100`}>
              {node.type}
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{node.label}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {note && (
              <span className="text-sm text-gray-500">
                Last modified: {formatDate(note.lastModified)}
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              placeholder="Enter note title..."
            />
          </div>

          {/* Node Information */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Node Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 text-gray-900 font-mono">{node.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className={`ml-2 font-medium ${getNodeTypeColor(node.type)}`}>
                  {node.type}
                </span>
              </div>
              {node.data.status && (
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 text-green-600">{node.data.status}</span>
                </div>
              )}
              {node.data.reliable !== undefined && (
                <div>
                  <span className="text-gray-500">Reliable:</span>
                  <span className={`ml-2 ${node.data.reliable ? 'text-green-600' : 'text-red-600'}`}>
                    {node.data.reliable ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
              placeholder="Write your notes here...

You can document:
• Analysis and findings
• Connection details
• Research notes
• Important observations
• Links and references"
            />
          </div>

          {/* Markdown Support Note */}
          <div className="text-xs text-gray-500 italic">
            This editor supports plain text. You can format your notes using markdown-like syntax for better organization.
          </div>
        </div>
      </div>
    </div>
  );
};
