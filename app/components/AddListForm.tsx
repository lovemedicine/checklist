import { Box } from "@mui/material";
import ListForm from "@/components/ListForm";
import { addList } from "@/util/api";

type AddListFormProps = {
  refreshLists: () => any;
};

export default function AddListForm({ refreshLists }: AddListFormProps) {
  async function onSubmit(name: string) {
    await addList({ name });
    await refreshLists();
  }

  return (
    <Box sx={{ mb: 3 }}>
      <ListForm onSubmit={onSubmit} />
    </Box>
  );
}
