import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { findOrderedItems } from "@/util/db";
import DeleteItemButton from "@/components/DeleteItemButton";
import { getUserId } from "@/util/auth";

export async function getItems() {
  const userId = await getUserId();
  return await findOrderedItems(userId);
}

export default async function ItemPage() {
  const items = await getItems();

  if (!items?.length) return null;

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Link href="/">&laquo; Home</Link>
      </Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: "monospace" }}>
          Items
        </Typography>
      </Box>
      {items.map((item) => (
        <Box key={item.id} sx={{ p: 1 }}>
          <DeleteItemButton id={item.id} />
          &nbsp;
          {item.name}
        </Box>
      ))}
    </>
  );

  // function onDelete(itemId: number) {
  //   const optimisticData = (items as Item[]).filter(
  //     (item) => item.id !== itemId
  //   );
  //   refreshItems(deleteItem(itemId), { optimisticData });
  // }

  // async function handleDelete() {
  //   setIsDeleting(true);
  //   onDelete ? onDelete(item.id) : null;
  //   setIsDeleting(false);
  // }
}
