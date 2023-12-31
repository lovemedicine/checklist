import { useState, useRef, useEffect } from "react";
import { Checkbox, TextField, CircularProgress, Box } from "@mui/material";

type AddItemFormProps = {
  listId: number;
  itemNames: string[];
  onAdd: (id: string) => any;
};

type NameMap = {
  [key: string]: boolean;
};

export default function AddItemForm({
  listId,
  itemNames,
  onAdd,
}: AddItemFormProps) {
  const [name, setName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSaving && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSaving]);

  const nameMap = itemNames.reduce((map, name) => {
    map[name] = true;
    return map;
  }, {} as NameMap);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let trimmedName = name.trim();

    if (nameMap[trimmedName]) {
      setIsValid(false);
      return;
    } else {
      setIsValid(true);
    }

    if (trimmedName.length > 0) {
      setIsSaving(true);
      onAdd(trimmedName);
      setName("");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
      <Checkbox checked={true} disabled={true} sx={{ padding: "5px" }} />
      &nbsp;
      <TextField
        sx={{ width: "170px" }}
        variant="outlined"
        size="small"
        placeholder="New item"
        onChange={(event) => setName(event.target.value)}
        value={name}
        autoComplete="off"
        disabled={isSaving}
        error={!isValid}
        helperText={isValid ? "" : "Item already exists"}
        inputRef={inputRef}
      />
      <Box sx={{ display: "inline-block", ml: 1 }}>
        {isSaving && (
          <CircularProgress
            size="1.5rem"
            sx={{ position: "relative", top: "7px" }}
          />
        )}
      </Box>
    </form>
  );
}
