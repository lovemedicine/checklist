import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";

type AddListButtonProps = {
  onAdd: (name: string) => any;
};

export default function AddListButton({ onAdd }: AddListButtonProps) {
  const [isSending, setIsSending] = useState(false);

  async function handleClick(event: React.MouseEvent<HTMLElement>) {
    setIsSending(true);
    onAdd("untitled list");
    setIsSending(false);
  }

  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={<Add />}
        disabled={isSending}
        onClick={handleClick}
      >
        Create
      </Button>
      {isSending && (
        <CircularProgress
          size="1.3rem"
          sx={{ ml: 1.5, position: "relative", top: "5px" }}
        />
      )}
    </>
  );
}
