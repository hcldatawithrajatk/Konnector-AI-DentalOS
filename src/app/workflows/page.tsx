"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { WorkflowAutomation, WorkflowNode } from "@/types";
import {
  Workflow,
  Sparkles,
  Play,
  Pause,
  Plus,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  Sliders,
  ChevronRight,
  MessageSquare,
  Star,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

export default function WorkflowsPage() {
  const { activeClinic, workflows } = useDentalOS();

  const [workflowList, setWorkflowList] = useState<WorkflowAutomation[]>(workflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAutomation>(workflows[0]);

  const handleToggleActive = (id: string) => {
    setWorkflowList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
    if (selectedWorkflow.id === id) {
      setSelectedWorkflow({ ...selectedWorkflow, isActive: !selectedWorkflow.isActive });
    }
  };

  const getNodes = (wf: WorkflowAutomation): WorkflowNode[] => {
    if (wf.nodes && wf.nodes.length > 0) return wf.nodes;
    return [
      { id: "n-1", type: "trigger", title: "Trigger Event", description: wf.trigger },
      { id: "n-2", type: "condition", title: "Target Condition", description: wf.condition },
      { id: "n-3", type: "action", title: "Autonomous WhatsApp & Calendar Action", description: wf.action },
    ];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1">
            <Workflow className="w-3.5 h-3.5 text-teal-600" />
            <span>Autonomous Practice Automation Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Visual Workflow Automation Builder
          </h2>
          <p className="text-xs text-slate-500">
            Pre-configured patient journeys executing seamlessly across WhatsApp, Google Calendar, Reviews, and Payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Active Automations:</span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            {workflowList.filter((w) => w.isActive).length} / {workflowList.length} Running
          </span>
        </div>
      </div>

      {/* Main Grid: Workflows List (4 Cols) + Visual Canvas (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Pre-Built Journeys (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Pre-Built Dental Journeys
          </div>

          {workflowList.map((wf) => {
            const isSelected = wf.id === selectedWorkflow.id;
            const title = wf.title || wf.name;
            const desc = wf.description || wf.action;
            const nodes = getNodes(wf);

            return (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer text-left ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/40 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">{title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(wf.id);
                    }}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition ${
                      wf.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {wf.isActive ? "ACTIVE" : "PAUSED"}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {desc}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{nodes.length} Visual Steps</span>
                  <span className="font-mono text-teal-700 font-bold">
                    {wf.runsCount.toLocaleString()} Runs
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Journey Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedWorkflow.title || selectedWorkflow.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedWorkflow.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {selectedWorkflow.isActive ? "Live in Production" : "Paused"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedWorkflow.description || selectedWorkflow.action}
              </p>
            </div>

            <button
              onClick={() => handleToggleActive(selectedWorkflow.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedWorkflow.isActive
                  ? "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {selectedWorkflow.isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Automation</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Activate Automation</span>
                </>
              )}
            </button>
          </div>

          {/* Flowchart Visual Nodes */}
          <div className="space-y-4 relative">
            {getNodes(selectedWorkflow).map((node, idx, arr) => {
              const isTrigger = node.type === "trigger";
              const isAction = node.type === "action";
              const isCondition = node.type === "condition";

              return (
                <React.Fragment key={node.id}>
                  <div
                    className={`p-4 rounded-xl border-2 transition relative ${
                      isTrigger
                        ? "border-teal-500 bg-teal-50/50"
                        : isAction
                        ? "border-emerald-500 bg-emerald-50/40"
                        : isCondition
                        ? "border-amber-500 bg-amber-50/40"
                        : "border-indigo-400 bg-indigo-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                            isTrigger
                              ? "bg-teal-600 text-white"
                              : isAction
                              ? "bg-emerald-600 text-white"
                              : isCondition
                              ? "bg-amber-600 text-white"
                              : "bg-indigo-600 text-white"
                          }`}
                        >
                          Step {idx + 1}: {node.type}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">{node.title}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {node.description}
                    </p>
                  </div>

                  {idx < arr.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="w-0.5 h-6 bg-slate-300 relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
