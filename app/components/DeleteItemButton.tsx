"use client";

import { useRouter } from "next/navigation";
import { DeleteForever } from "@mui/icons-material";
import { deleteItem } from "@/util/api";

export default function DeleteItemButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteItem(id);
    router.refresh();
  }

  return (
    <DeleteForever
      className="item-delete-button"
      sx={{ color: "grey", position: "relative", top: 5, cursor: "pointer" }}
      onClick={handleDelete}
    />
  );
}
