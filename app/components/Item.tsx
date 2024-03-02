import { useState, forwardRef } from "react";
import { Checkbox, CircularProgress } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { Item as ItemType } from "@/types/models";
import { updateList, updateListItem } from "@/util/api";

export type ItemProps = {
  listId: number;
  item: ItemType;
  selected: boolean;
  dragEnabled: boolean;
  onDelete?: (id: number) => any;
  onSelectedChange: () => void;
  listeners?: any;
  style?: {
    transform: string | undefined;
    transition: string | undefined;
  };
};

export default forwardRef(function Item(
  {
    item,
    listId,
    selected,
    dragEnabled,
    onDelete,
    onSelectedChange,
    style,
    listeners,
    ...props
  }: ItemProps,
  ref: any
) {
  const [checked, setChecked] = useState(selected);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      ref={ref}
      className="item"
      style={{ display: "flex", justifyContent: "space-between", ...style }}
      {...props}
    >
      <div>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          sx={{ padding: "5px" }}
        />
        &nbsp;
        <div
          className="item-name"
          style={{
            cursor: dragEnabled ? "grab" : "auto",
            touchAction: "none",
          }}
          {...listeners}
        >
          {item.name}
        </div>
      </div>
      <div
        className="item-delete"
        style={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {(item.isOptimistic || isDeleting) && (
          <CircularProgress
            size="1.5rem"
            sx={{ position: "relative", top: "7px" }}
          />
        )}
        {!item.isOptimistic && !isDeleting && onDelete && (
          <DeleteForever
            className="item-delete-button"
            sx={{ color: "grey", position: "relative", top: 5 }}
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    const data = { listId, itemId: item.id, checked };
    updateListItem(data);
    setChecked(checked);
    onSelectedChange();
  }

  async function handleDelete() {
    setIsDeleting(true);
    onDelete ? onDelete(item.id) : null;
    setIsDeleting(false);
  }
});
