"use client";

import { useState } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { Item as ItemType } from "@/types/models";
import { Box, Typography } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";

const GET_ITEMS = gql`
  query {
    items {
      id
      name
      order
    }
  }
`;

export default function ItemPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { loading, error, data } = useQuery<{ items: ItemType[] }>(GET_ITEMS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (!data?.items) return null;

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
      {data.items.map((item) => (
        <Box key={item.id} sx={{ p: 1 }}>
          <DeleteForever
            className="item-delete-button"
            sx={{ color: "grey", position: "relative", top: 5 }}
            onClick={() => null}
          />
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
