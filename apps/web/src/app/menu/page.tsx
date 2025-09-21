"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItem {
  _id: string;
  title: string;
  path: string;
  icon?: string;
  isActive: boolean;
  roles?: string[];
}

interface MenuFormValues {
  title: string;
  path: string;
  icon?: string;
  isActive: boolean;
  roles: string[];
}

export default function MenuTable() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<MenuFormValues>({
      defaultValues: {
        title: "",
        path: "",
        icon: "",
        isActive: true,
        roles: [],
      },
    });

  const fetchMenus = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu`
      );
      setMenus(res.data);
    } catch (error) {
      toast.error("Failed to fetch menus");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const onSubmit = async (data: MenuFormValues) => {
    try {
      if (editingMenu) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu/${editingMenu._id}`,
          data
        );
        toast.success("Menu updated");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu/create`,
          data
        );
        toast.success("Menu created");
      }
      setOpenDialog(false);
      setEditingMenu(null);
      reset();
      fetchMenus();
    } catch (error) {
      toast.error("Failed to save menu");
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setValue("title", menu.title);
    setValue("path", menu.path);
    setValue("icon", menu.icon || "");
    setValue("isActive", menu.isActive);
    setValue("roles", menu.roles || []);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu/${id}`
      );
      toast.success("Menu deleted");
      fetchMenus();
    } catch (error) {
      toast.error("Failed to delete menu");
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          reset();
          setEditingMenu(null);
          setOpenDialog(true);
        }}
      >
        Add Menu
      </Button>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map((menu) => (
            <TableRow key={menu._id}>
              <TableCell>{menu.title}</TableCell>
              <TableCell>{menu.path}</TableCell>
              <TableCell>{menu.icon || "-"}</TableCell>
              <TableCell>{menu.isActive ? "Yes" : "No"}</TableCell>
              <TableCell>{menu.roles?.join(", ") || "-"}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(menu)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(menu._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMenu ? "Edit Menu" : "Add Menu"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Input
              placeholder="Title"
              {...register("title", { required: true })}
            />
            <Input
              placeholder="Path"
              {...register("path", { required: true })}
            />
            <Input placeholder="Icon" {...register("icon")} />

            <Select
              value={watch("isActive") ? "true" : "false"}
              onValueChange={(val) => setValue("isActive", val === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Active?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Roles (comma separated)"
              value={watch("roles").join(", ")}
              onChange={(e) =>
                setValue(
                  "roles",
                  e.target.value.split(",").map((r) => r.trim())
                )
              }
            />

            <DialogFooter>
              <Button type="submit">{editingMenu ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
