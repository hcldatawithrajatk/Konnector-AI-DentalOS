"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { searchKnowledgeBaseRAG } from "@/lib/aiEngine";
import {
  BrainCircuit,
  Search,
  Upload,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  Database,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function RAGKnowledgePage() {
  const { activeClinic, knowledgeDocs, addKnowledgeDoc } = useDentalOS();

  const [query, setQuery] = useState("What is the warranty and protocol on dental implants?");
  const [results, setResults] = useState<any[]>(() =>
    searchKnowledgeBaseRAG("What is the warranty and protocol on dental implants?", knowledgeDocs)
  );

  const [newTitle, setNewTitle] = useState("");
  const [newSnippet, setNewSnippet] = useState("");
  const [newTags, setNewTags] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = searchKnowledgeBaseRAG(query, knowledgeDocs);
    setResults(res);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSnippet) return;

    addKnowledgeDoc({
      title: newTitle,
      fileType: "pdf",
      fileSize: "1.2 MB",
      chunksCount: 14,
      vectorStatus: "indexed",
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : ["Clinical", "FAQ"],
      snippet: newSnippet,
    });

    setShowUploadModal(false);
    setNewTitle("");
    setNewSnippet("");
    setNewTags("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
            <span>Vertex AI Vector Search & RAG Retrieval</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Base & Clinical RAG
          </h2>
          <p className="text-xs text-slate-500">
            Ground your AI employees in your exact clinical protocols, pricing fee guides, post-op instructions, and insurance policies.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>+ Upload Document / URL</span>
        </button>
      </div>

      {/* RAG Testing Inspector Console */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Admin RAG Semantic Testing Console</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how Gemini 2.5 Pro performs vector similarity searches against indexed clinical documents.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question (e.g. 'Can I get 0% EMI on Invisalign?')"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Run Semantic Retrieval
          </button>
        </form>

        {/* Retrieved Chunks Display */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Retrieved Context Chunks ({results.length} Ranked):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {res.doc.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-teal-100 text-teal-800">
                    Similarity: {(res.similarityScore * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-[11px] bg-white p-2.5 rounded-lg border border-slate-100">
                  &ldquo;{res.retrievedChunk}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Chunk {idx + 1} of {res.doc.chunksCount}</span>
                  <div className="flex gap-1">
                    {res.doc.tags.map((t: string, i: number) => (
                      <span key={i} className="text-teal-700 font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indexed Document Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Indexed Knowledge Documents</h3>
          <span className="text-xs text-slate-500">Vertex AI Vector Index: vtx-dental-index-01</span>
        </div>

        <div className="divide-y divide-slate-100">
          {knowledgeDocs.map((doc) => (
            <div key={doc.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{doc.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {doc.fileSize} • {doc.chunksCount} Vector Chunks • Updated {doc.lastUpdated}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-1">
                  {doc.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {doc.vectorStatus.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Upload Knowledge Source</h3>

            <form onSubmit={handleUploadDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2025 Root Canal FAQ & Guarantee.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Text Excerpt / Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Paste clinical policy, price information, or post-op instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Endodontics, Pricing, Recovery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Index & Embed with Vertex AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
