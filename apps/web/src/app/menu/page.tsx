"use client"
import { useState, useEffect, useCallback } from "react";
import { Trash2, Edit2, Plus, GripVertical, Search, Save, X, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

interface MenuItem {
  _id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string | null;
  isActive: boolean;
  roles: string[];
  children?: MenuItem[];
  depth?: number;
}

interface DragState {
  draggedItem: MenuItem | null;
  dragOverItem: MenuItem | null;
  isOverRoot?: boolean; // ახალი: root drop zone-ისთვის
}

interface EditFormData {
  title: string;
  path: string;
  icon: string;
  isActive: boolean;
}

function buildTree(items: MenuItem[], parentId: string | null = null, depth: number = 0): MenuItem[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      depth,
      children: buildTree(items, item._id, depth + 1),
    }));
}

function getDepthColor(depth: number): string {
  const colors = [
    "from-blue-500/20 to-purple-500/20 border-blue-400/30",
    "from-purple-500/20 to-pink-500/20 border-purple-400/30",
    "from-pink-500/20 to-rose-500/20 border-pink-400/30",
    "from-rose-500/20 to-orange-500/20 border-rose-400/30",
    "from-orange-500/20 to-amber-500/20 border-orange-400/30",
  ];
  return colors[depth % colors.length];
}

function TreeNode({
  node,
  onToggle,
  onEdit,
  onDelete,
  onAddChild,
  onToggleActive,
  dragState,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  editingId,
  editFormData,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  expandedState, // ახალი: ცალკე expanded state
}: {
  node: MenuItem;
  onToggle: (id: string) => void;
  onEdit: (id: string, data: EditFormData) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  dragState: DragState;
  onDragStart: (e: React.DragEvent, item: MenuItem) => void;
  onDragOver: (e: React.DragEvent, item: MenuItem) => void;
  onDrop: (e: React.DragEvent, item: MenuItem) => void;
  onDragEnd: () => void;
  editingId: string | null;
  editFormData: EditFormData;
  onEditFormChange: (field: keyof EditFormData, value: string | boolean) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  expandedState: { [key: string]: boolean }; // ახალი
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isDragging = dragState.draggedItem?._id === node._id;
  const isDragOver = dragState.dragOverItem?._id === node._id;
  const isEditing = editingId === node._id;
  const isExpanded = expandedState[node._id] ?? true; // ახალი: expanded state-დან

  return (
    <div className="relative">
      <div
        draggable={!isEditing}
        onDragStart={(e) => onDragStart(e, node)}
        onDragOver={(e) => onDragOver(e, node)}
        onDrop={(e) => onDrop(e, node)}
        onDragEnd={onDragEnd}
        className={`
          group relative mb-2 transition-all duration-300
          ${isDragging ? "opacity-50 scale-95" : ""}
          ${isDragOver ? "scale-105" : ""}
        `}
        style={{ marginLeft: `${node.depth! * 32}px` }}
      >
        {/* Depth indicator line */}
        {node.depth! > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent"
            style={{ left: `-${node.depth! * 16}px` }}
          />
        )}

        <div
          className={`
            relative backdrop-blur-xl rounded-xl border
            bg-gradient-to-br ${getDepthColor(node.depth!)}
            shadow-lg hover:shadow-2xl
            transition-all duration-300
            ${isDragOver ? "ring-2 ring-white/50 shadow-white/20" : ""}
            ${!node.isActive ? "opacity-50" : ""}
          `}
        >
          <div className="p-4">
            {isEditing ? (
              // Edit Form - გაუმჯობესებული dark inputs
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="cursor-move opacity-60">
                    <GripVertical className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => onEditFormChange("title", e.target.value)}
                      placeholder="Title"
                      className="px-3 py-2 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                    />
                    <input
                      type="text"
                      value={editFormData.path}
                      onChange={(e) => onEditFormChange("path", e.target.value)}
                      placeholder="Path"
                      className="px-3 py-2 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-8">
                  <input
                    type="text"
                    value={editFormData.icon}
                    onChange={(e) => onEditFormChange("icon", e.target.value)}
                    placeholder="Icon (emoji or class)"
                    className="flex-1 px-3 py-2 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                  />
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => onEditFormChange("isActive", e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600/50 bg-slate-800/50 checked:bg-blue-500/50"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={onSaveEdit}
                      className="p-2 rounded-lg bg-green-600/30 hover:bg-green-600/50 transition-colors"
                    >
                      <Save className="w-4 h-4 text-green-300" />
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Display Mode
              <div className="flex items-center gap-3">
                <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-white/60" />
                </div>

                <button
                  onClick={() => onToggle(node._id)}
                  className={`
                    p-1 rounded-lg transition-all duration-200
                    ${hasChildren ? "hover:bg-slate-700/50" : "invisible"}
                  `}
                >
                  {hasChildren && (
                    isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-white/80" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/80" />
                    )
                  )}
                </button>

                <div className="flex-1 flex items-center gap-3">
                  {node.icon && (
                    <span className="text-2xl">{node.icon}</span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-lg">{node.title}</span>
                      {!node.isActive && (
                        <span className="px-2 py-0.5 bg-red-600/30 border border-red-500/50 rounded text-xs text-red-300">
                          Inactive
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-sm">/{node.path}</span>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onToggleActive(node._id, !node.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      node.isActive 
                        ? "bg-yellow-600/30 hover:bg-yellow-600/50" 
                        : "bg-green-600/30 hover:bg-green-600/50"
                    }`}
                    title={node.isActive ? "Deactivate" : "Activate"}
                  >
                    {node.isActive ? (
                      <EyeOff className="w-4 h-4 text-yellow-300" />
                    ) : (
                      <Eye className="w-4 h-4 text-green-300" />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(node._id, {
                      title: node.title,
                      path: node.path,
                      icon: node.icon,
                      isActive: node.isActive
                    })}
                    className="p-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-300" />
                  </button>
                  <button
                    onClick={() => onAddChild(node._id)}
                    className="p-2 rounded-lg bg-green-600/30 hover:bg-green-600/50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-green-300" />
                  </button>
                  <button
                    onClick={() => onDelete(node._id)}
                    className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>

      {hasChildren && isExpanded && ( // გამოყენებული expandedState
        <div className="mt-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onToggleActive={onToggleActive}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              editingId={editingId}
              editFormData={editFormData}
              onEditFormChange={onEditFormChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              expandedState={expandedState}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuManager() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null,
    isOverRoot: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    path: "",
    icon: "",
    isActive: true,
  });
  const [expandedState, setExpandedState] = useState<{ [key: string]: boolean }>({}); // ახალი: ცალკე state expanded-ისთვის

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchMenus = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/api/v1/menu`);
    setMenus(response.data);
    const initialExpanded: { [key: string]: boolean } = {};
    response.data.forEach((item: MenuItem) => {
      initialExpanded[item._id] = true;
    });
    setExpandedState(initialExpanded);
    toast.success("Menus loaded successfully");
  } catch (error) {
    toast.error("Failed to fetch menus");
    console.error(error);
  } finally {
    setLoading(false);
  }
}, [API_BASE_URL]);

useEffect(() => {
  fetchMenus();
}, [fetchMenus]);


  const tree = buildTree(menus);

  // გამოსწორებული: toggle მხოლოდ expandedState-ს ცვლის, menus flat რჩება
  const handleToggle = (id: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id: string, data: EditFormData) => {
    setEditingId(id);
    setEditFormData(data);
  };

  const handleEditFormChange = (field: keyof EditFormData, value: string | boolean) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    try {
      await axios.put(`${API_BASE_URL}/api/v1/menu/${editingId}`, editFormData);
      
      setMenus((prev) =>
        prev.map((item) =>
          item._id === editingId ? { ...item, ...editFormData } : item
        )
      );
      
      toast.success("Menu updated successfully");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update menu");
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: "", path: "", icon: "", isActive: true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item and all its children?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/menu/${id}`);
      setMenus((prev) => prev.filter((item) => item._id !== id && item.parentId !== id));
      // ახალი: expanded state-დან ამოვიღოთ
      setExpandedState((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      toast.success("Menu deleted successfully");
    } catch (error) {
      toast.error("Failed to delete menu");
      console.error(error);
    }
  };

  const handleAddChild = async (parentId: string) => {
    try {
      const newItem = {
        title: "New Menu Item",
        path: "new-menu-item",
        icon: "📄",
        parentId: parentId,
        isActive: true,
        roles: [],
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/v1/menu/create`, newItem);
      setMenus((prev) => [...prev, response.data]);
      // ახალი: expanded parent-ისთვის
      setExpandedState((prev) => ({ ...prev, [parentId]: true }));
      toast.success("Menu item added successfully");
    } catch (error) {
      toast.error("Failed to add menu item");
      console.error(error);
    }
  };

  const handleAddRoot = async () => {
    try {
      const newItem = {
        title: "New Root Menu",
        path: "new-root-menu",
        icon: "🏠",
        parentId: null,
        isActive: true,
        roles: [],
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/v1/menu/create`, newItem);
      setMenus((prev) => [...prev, response.data]);
      // ახალი: expanded root-ისთვის
      setExpandedState((prev) => ({ ...prev, [response.data._id]: true }));
      toast.success("Root menu added successfully");
    } catch (error) {
      toast.error("Failed to add root menu");
      console.error(error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await axios.put(`${API_BASE_URL}/api/v1/menu/${id}`, { isActive });
      
      setMenus((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive } : item
        )
      );
      
      toast.success(`Menu ${isActive ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to update menu status");
      console.error(error);
    }
  };

  // გამოსწორებული drag: root drop-ის მხარდაჭერა
  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDragState({ ...dragState, draggedItem: item });
  };

  const handleDragOverRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setDragState({ ...dragState, isOverRoot: true });
  };

  const handleDropRoot = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragState.draggedItem) {
      setDragState({ ...dragState, isOverRoot: false });
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/v1/menu/${dragState.draggedItem._id}`, {
        parentId: null // root-ად გადატანა
      });

      setMenus((prev) =>
        prev.map((item) =>
          item._id === dragState.draggedItem!._id
            ? { ...item, parentId: null }
            : item
        )
      );

      toast.success("Menu moved to root successfully");
    } catch (error) {
      toast.error("Failed to move to root");
      console.error(error);
    }

    setDragState({ draggedItem: null, dragOverItem: null, isOverRoot: false });
  };

  const handleDragOver = (e: React.DragEvent, item: MenuItem) => {
    e.preventDefault();
    if (dragState.draggedItem?._id === item._id) return;
    setDragState({ ...dragState, dragOverItem: item, isOverRoot: false });
  };

  const handleDrop = async (e: React.DragEvent, targetItem: MenuItem) => {
    e.preventDefault();
    if (!dragState.draggedItem || dragState.draggedItem._id === targetItem._id) {
      setDragState({ ...dragState, isOverRoot: false });
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/v1/menu/${dragState.draggedItem._id}`, {
        parentId: targetItem._id
      });

      setMenus((prev) =>
        prev.map((item) =>
          item._id === dragState.draggedItem!._id
            ? { ...item, parentId: targetItem._id }
            : item
        )
      );

      toast.success("Menu reorganized successfully");
    } catch (error) {
      toast.error("Failed to reorganize menu");
      console.error(error);
    }

    setDragState({ draggedItem: null, dragOverItem: null, isOverRoot: false });
  };

  const handleDragEnd = () => {
    setDragState({ draggedItem: null, dragOverItem: null, isOverRoot: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300 text-xl backdrop-blur-sm">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Menu Manager
          </h1>
          <p className="text-slate-400">Drag & drop to reorganize your menu structure</p>
        </div>

        {/* Search & Add */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search menus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <Button
            onClick={handleAddRoot}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Root Menu
          </Button>
        </div>

        {/* ახალი: Root Drop Zone */}
        <div
          onDragOver={handleDragOverRoot}
          onDrop={handleDropRoot}
          className={`
            mb-4 p-4 rounded-xl border-2 border-dashed transition-all duration-300
            ${dragState.isOverRoot ? "bg-blue-500/10 border-blue-400/50 ring-2 ring-blue-400/30" : "bg-slate-800/50 border-slate-600/50"}
          `}
        >
          <p className="text-center text-slate-400 flex items-center justify-center gap-2">
            <GripVertical className="w-4 h-4" />
            Drop here to make item a root menu
          </p>
        </div>

        {/* Tree */}
        <div className="space-y-2">
          {tree.map((root) => (
            <TreeNode
              key={root._id}
              node={root}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              onToggleActive={handleToggleActive}
              dragState={dragState}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              editingId={editingId}
              editFormData={editFormData}
              onEditFormChange={handleEditFormChange}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              expandedState={expandedState} // გადაცემული
            />
          ))}
        </div>

        {tree.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">მენიუები არ არის!</p>
          </div>
        )}
      </div>
    </div>
  );
}